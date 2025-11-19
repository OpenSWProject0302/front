// src/components/TarotDeck.jsx
import { useEffect, useRef, useState } from "react";
import FlippableGenreCard from "./FlippableGenreCard";
import "./TarotDeck.css";
import { presignUpload, putToS3 } from "../api/uploads";

export default function TarotDeck({ items = [], onSelect }) {
    const [active, setActive] = useState(0);     // 중앙 카드 index
    const [flipped, setFlipped] = useState(false); // 단 하나만 뒤집힘
    const wrapRef = useRef(null);

    const [busy, setBusy] = useState(false);
    //   const [progress, setProgress] = useState(0); // (선택) 진행률 UI 쓰려면

    const count = items.length;
    const wrap = (i) => ((i % count) + count) % count;

    const focusTo = (i) => {
        setActive(wrap(i));
        setFlipped(false); // 포커스 이동 시 항상 앞면으로
    };

    const prev = () => focusTo(active - 1);
    const next = () => focusTo(active + 1);

    async function handleStartFromForm(form) {
        try {
            if (!form.file) throw new Error("파일을 선택해 주세요.");
            setBusy(true);

            // 1) presign
            const { ok, uploadUrl, key /*, expiresIn*/ } = await presignUpload({
                filename: form.file.name,
                size: form.file.size,
                contentType: form.file.type,
            });
            if (!ok) throw new Error("presign 발급 실패");

            // 2) S3 업로드
            await putToS3({ uploadUrl, file: form.file });
            // (선택) 진행률 버전: await putToS3WithProgress({ uploadUrl, file: form.file, onProgress:setProgress });

            // 3) 여기서 'key'를 들고 다음 Job 생성 API를 호출하면 됨.
            //    아직 백엔드 미구현이면 key만 콘솔에 보관.
            console.log("S3 업로드 완료. key:", key);

            // 상위로 알려주고(선택) 뒤집기 닫기
            onSelect?.({ ...form, inputKey: key });
            setFlipped(false);
            alert("업로드 완료! (key 콘솔 확인)");
        } catch (e) {
            console.error(e);
            alert(e.message || "업로드 실패");
        } finally {
            setBusy(false);
            //   setProgress(0);
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
    }, [active, count]);

    // 휠/스와이프
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const onWheel = (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) (e.deltaX > 0 ? next() : prev());
        };
        el.addEventListener("wheel", onWheel, { passive: true });
        return () => el.removeEventListener("wheel", onWheel);
    }, [active, count]);

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
    }, [active, count]);

    if (!count) return null;

    return (
        <div className="tarot-wrap" ref={wrapRef}>
            <button className="nav-btn left" onClick={prev} aria-label="이전">‹</button>
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
                                onSubmit={handleStartFromForm}
                            />
                            {busy && (
                                <div className="upload-indicator">업로드 중…{/* (선택) {Math.round(progress*100)}% */}</div>
                            )}
                        </div>
                    );
                })}
            </div>
            <button className="nav-btn right" onClick={next} aria-label="다음">›</button>
        </div>
    );
}
