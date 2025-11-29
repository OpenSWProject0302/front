import { useState } from "react";
import TarotDeck from "../components/TarotDeck";
import ImgDefault from "../image/genre_default.png";
import ImgBallad from "../image/Ballad.jpg";
import ImgBlues from "../image/Blues.jpg";
import ImgDisco from "../image/Disco.jpg";
import ImgFunk from "../image/Funk.jpg";
import ImgJazz from "../image/Jazz.jpg";
import ImgLatin from "../image/Latin.jpg";
import ImgRnB from "../image/R&B.jpg";
import ImgReggae from "../image/Reggae.jpg";
import ImgRock from "../image/Rock.jpg";
import ImgPop from "../image/Pop.jpg";


export default function Home() {
  // 드럼 변환 결과 전체(payload) 저장용 상태
  const [result, setResult] = useState(null);
  // 모달 열림/닫힘 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 공통 다운로드 함수: 새 탭 없이 바로 다운로드 시도
  const triggerDownload = (url, filename) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    // 파일 이름 힌트
    if (filename) link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const genres = [
    { id: 1, title: "Ballad", image: ImgBallad },
    { id: 2, title: "Blues", image: ImgBlues },
    { id: 3, title: "Jazz", image: ImgJazz },
    { id: 4, title: "R&B", image: ImgRnB },
    { id: 5, title: "Funk", image: ImgFunk },
    { id: 6, title: "Rock", image: ImgRock },
    { id: 7, title: "Disco", image: ImgDisco },
    { id: 8, title: "Reggae", image: ImgReggae },
    { id: 9, title: "Latin", image: ImgLatin },
    { id: 10, title: "Pop", image: ImgPop },
  ];

  // result 안에서 실제 링크 가져오기 
  const pdfLink = result?.pdfUrl || result?.pdfKey || result?.job?.pdfKey;
  const audioLink = result?.audioUrl || result?.audioKey || result?.job?.audioKey;
  const midiLink = result?.midiUrl || result?.midiKey || result?.job?.midiKey;
  const guideLink = result?.guideUrl || result?.guideKey || result?.job?.guideKey;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#C2DAEF",
        padding: "40px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: 36,
          fontWeight: 700,
          margin: "0 0 24px 60px",
          alignSelf: "flex-start",
        }}
      >
        EaSheet
      </h1>

      <TarotDeck
        items={genres}
        onSelect={(payload) => {
          console.log("홈에서 받은 데이터:", payload);
          setResult(payload);      // 전체 payload 저장
          setIsModalOpen(true);    // 변환 완료 시 모달 열기
        }}
      />

      {/* 변환 완료 모달 (팝업) */}
      {isModalOpen && result && (
        <div
          style={backdropStyle}
          onClick={() => setIsModalOpen(false)} // 바깥 클릭 시 닫기
        >
          <div
            style={modalStyle}
            onClick={(e) => e.stopPropagation()} // 안쪽 클릭은 전파 막기
          >
            <h2 style={{ marginBottom: 8, fontSize: 20 }}>
              변환이 완료되었습니다!
            </h2>
            <p style={{ margin: 0, color: "#64748B", fontSize: 14 }}>
              아래 버튼을 눌러 결과 파일을 다운로드하세요.
            </p>

            <div
              style={{
                marginTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              {/* 악보 PDF */}
              {pdfLink && (
                <button
                  type="button"
                  style={btnStyle}
                  onClick={() => triggerDownload(pdfLink, "easheet_score.pdf")}
                >
                  악보(PDF) 다운로드
                </button>
              )}

              {/* MIDI 파일 */}
              {midiLink && (
                <button
                  type="button"
                  style={btnStyle}
                  onClick={() => triggerDownload(midiLink, "easheet_drums.mid")}
                >
                  MIDI 파일 다운로드
                </button>
              )}

              {/* 가이드 오디오 (드럼만) */}
              {guideLink && (
                <button
                  type="button"
                  style={btnStyle}
                  onClick={() => triggerDownload(guideLink, "easheet_guide.wav")}
                >
                  가이드 오디오 다운로드
                </button>
              )}

              {/* 믹스 오디오 (최종) */}
              {audioLink && (
                <button
                  type="button"
                  style={btnStyle}
                  onClick={() => triggerDownload(audioLink, "easheet_mix.wav")}
                >
                  오디오 파일 다운로드
                </button>
              )}
            </div>

            <button
              type="button"
              style={closeBtnStyle}
              onClick={() => setIsModalOpen(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 공통 버튼 스타일
const btnStyle = {
  display: "block",
  padding: "10px 14px",
  background: "#758DA3",
  borderRadius: 10,
  textDecoration: "none",
  color: "white",
  fontWeight: 600,
  fontSize: 14,
  textAlign: "center",
  transition: "background 0.2s, transform 0.1s",
  border: "none",
  cursor: "pointer",
};

// 화면 전체를 덮는 어두운 배경
const backdropStyle = {
  position: "fixed",
  inset: 0,
  backgroundColor: "rgba(0,0,0,0.35)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

// 가운데 뜨는 모달 카드
const modalStyle = {
  background: "#F8FAFC",
  borderRadius: 16,
  boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
  width: 360,
  maxWidth: "90vw",
  padding: 24,
  textAlign: "center",
};

// 닫기 버튼
const closeBtnStyle = {
  marginTop: 12,
  border: "none",
  background: "transparent",
  color: "#64748B",
  cursor: "pointer",
  fontSize: 13,
};
