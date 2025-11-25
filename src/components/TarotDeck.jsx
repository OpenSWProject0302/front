// src/components/TarotDeck.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import FlippableGenreCard from "./FlippableGenreCard";
import "./TarotDeck.css";
import { presignUpload, putToS3 } from "../api/uploads";
import { startDrumJob, getDrumJob } from "../api/drums";

export default function TarotDeck({ items = [], onSelect }) {
  const [active, setActive] = useState(0); // 중앙 카드 index
  const [flipped, setFlipped] = useState(false); // 단 하나만 뒤집힘
  const wrapRef = useRef(null);

  const [, setBusy] = useState(false);

  // 🔔 토스트 & 에러 모달 상태
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  // 🔥 변환 중 전체 로딩 오버레이 상태
  const [loading, setLoading] = useState(false);

  const count = items.length;

  // index 순환
  const wrap = useCallback(
    (i) => {
      if (!count) return 0;
      return ((i % count) + count) % count;
    },
    [count]
  );

  const focusTo = useCallback(
    (i) => {
      setActive(wrap(i));
      setFlipped(false); // 포커스 이동 시 항상 앞면으로
    },
    [wrap]
  );

  const prev = useCallback(() => focusTo(active - 1), [focusTo, active]);
  const next = useCallback(() => focusTo(active + 1), [focusTo, active]);

  // ✅ presign → S3 업로드 → jobs/drums/start → jobs/drums/:id 폴링까지 처리
  async function handleStartFromForm(form) {
    try {
      if (!form.file) throw new Error("파일을 선택해 주세요.");
      setBusy(true);
      setLoading(true); // 🔥 로딩 오버레이 ON

      // 🔔 변환 시작 토스트 표시
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000); // 4초 후 자동 사라짐

      // MIME 타입 보정
      let fileType = form.file.type;
      if (!fileType && form.file.name.toLowerCase().endsWith(".wav")) {
        fileType = "audio/wav";
      }

      // 1) presign 발급
      const { ok, uploadUrl, key } = await presignUpload({
        filename: form.file.name,
        size: form.file.size,
        contentType: fileType,
      });
      if (!ok) throw new Error("presign 발급 실패");

      // 2) S3 업로드
      await putToS3({ uploadUrl, file: form.file, contentType: fileType });
      console.log("S3 업로드 완료. key:", key);

      // 3) 장르/옵션 정리
      let genre = form.genre || form.title || form.genreName;

      // 🔥 Pop 선택 시 세부 장르(subGenre)를 최종 장르로 사용
      if (
        (genre === "Pop" || form.title === "Pop" || form.genre === "Pop") &&
        form.subGenre
      ) {
        genre = `${form.subGenre}`;
      }

      if (!genre) {
        console.warn("장르 정보가 비어 있어 기본값 Rock 사용:", form);
        genre = "Rock";
      }

      const tempo = Number(form.bpm) || 160;
      const level = form.difficulty || "Normal"; // "Easy" | "Normal"

      const payload = {
        inputKey: key,
        genre,
        tempo,
        level,
      };

      console.log("jobs/drums/start 요청 payload:", payload);

      // 4) 드럼 Job 시작
      const startRes = await startDrumJob(payload);
      if (startRes?.ok === false) {
        console.error("drums/start 실패 응답:", startRes);
        throw new Error(
          startRes.message || "드럼 변환 Job 생성 중 오류가 발생했습니다."
        );
      }

      const jobId = startRes.jobId;
      console.log("=== DRUM JOB STARTED ===", jobId);

      // 5) Job 상태 폴링
      const pollIntervalMs = 5000;      // 5초 간격
      const maxAttempts = 360;          // 180회 → 180 * 5초 = 900초 (15분)

      let job = null;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // 잠깐 대기
        await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

        // 상태 조회
        job = await getDrumJob(jobId);
        console.log("Job 상태 조회:", job);

        if (job.status === "DONE") break;
        if (job.status === "ERROR") {
          throw new Error(
            job.errorMessage || "드럼 변환 중 오류가 발생했습니다."
          );
        }
      }

      if (!job) {
        throw new Error("작업 정보를 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      }
      if (job.status !== "DONE") {
        throw new Error(
          "변환 시간이 초과되었습니다. 파일 길이를 줄이거나 다시 시도해 주세요."
        );
      }

      console.log("=== DRUM JOB DONE ===");
      console.log(job);

      // 부모로 응답 전달 (Home에서 모달 띄움)
      onSelect?.({ ...form, inputKey: key, job });

      setFlipped(false);
    } catch (e) {
      console.error(e);

      // ❌ 실패 시 에러 모달 표시
      setErrorMessage(e.message || "업로드/변환 중 오류가 발생했습니다.");
      setShowErrorModal(true);
    } finally {
      setBusy(false);
      setLoading(false); // 🔥 로딩 오버레이 OFF
    }
  }

  // 키보드
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") setFlipped(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next]);

  // 휠
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY))
        e.deltaX > 0 ? next() : prev();
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel);
  }, [prev, next]);

  // 터치
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let startX = 0;
    const ts = (e) => (startX = e.touches[0].clientX);
    const te = (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (dx < -30) next();
      if (dx > 30) prev();
    };
    el.addEventListener("touchstart", ts);
    el.addEventListener("touchend", te);
    return () => {
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchend", te);
    };
  }, [prev, next]);

  if (!count) return null;

  return (
    <>
      {/* 🔵 전체 로딩 오버레이 */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p className="loading-text">음원을 분석하고 있어요...</p>
          <p className="loading-sub">최대 3~5분 정도 소요될 수 있습니다.</p>
        </div>
      )}

      {/* 🟦 변환 시작 토스트 (작게 하단에 표시) */}
      {showToast && (
        <div className="tarot-toast">
          <div className="tarot-toast-title">요청이 전송되었습니다.</div>
          <div className="tarot-toast-body">
            업로드 및 변환 작업이 시작되었습니다.
            <br />
            파일 길이에 따라 최대 3~5분 정도 소요될 수 있습니다.
          </div>
        </div>
      )}

      {/* 🟥 에러 모달 */}
      {showErrorModal && (
        <div
          className="tarot-error-backdrop"
          onClick={() => setShowErrorModal(false)}
        >
          <div
            className="tarot-error-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="tarot-error-title">변환 중 오류가 발생했습니다</h2>
            <p className="tarot-error-message">{errorMessage}</p>
            <button
              type="button"
              className="tarot-error-close-btn"
              onClick={() => setShowErrorModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <div className="tarot-wrap" ref={wrapRef}>
        <button className="nav-btn left" onClick={prev} aria-label="이전">
          ‹
        </button>
        <div className="deck">
          {items.map((it, i) => {
            const isActive = i === active;
            const offset = i - active;
            const abs = Math.abs(offset);
            const translateX = offset * 220;
            const translateY = Math.min(abs * 8, 24);
            const rotate = offset * -2.5;
            const scale = 1 - Math.min(abs * 0.08, 0.32);
            const zIndex = 100 - abs;

            return (
              <div
                key={it.id ?? i}
                style={{
                  position: "absolute",
                  transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                  zIndex,
                  opacity: 1 - Math.min(abs * 0.15, 0.45),
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                }}
                onClick={() => {
                  // 옆 카드 클릭 시: 포커스만 이동 (뒤집지 않음)
                  if (!isActive) focusTo(i);
                }}
              >
                <FlippableGenreCard
                  item={it}
                  isActive={isActive}
                  flipped={isActive && flipped}
                  onFlip={() => setFlipped(true)}
                  onCancel={() => setFlipped(false)}
                  // 🔥 현재 카드(it)의 장르를 form에 함께 전달
                  onSubmit={(form) =>
                    handleStartFromForm({
                      ...form,
                      genre: it.genre ?? it.title ?? it.id,
                    })
                  }
                />
              </div>
            );
          })}
        </div>
        <button className="nav-btn right" onClick={next} aria-label="다음">
          ›
        </button>
      </div>
    </>
  );
}
