// src/pages/home.jsx
import { useState } from "react";
import TarotDeck from "../components/TarotDeck";
import ImgDefault from "../image/genre_default.png";

export default function Home() {
  // 🎯 드럼 변환 결과(DrumJob 조회 응답) 저장용 상태
  const [result, setResult] = useState(null);
  // 🎯 모달 열림/닫힘 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  const genres = [
    { id: 1, title: "Ballad", image: ImgDefault },
    { id: 2, title: "Blues", image: ImgDefault },
    { id: 3, title: "Jazz", image: ImgDefault },
    { id: 4, title: "R&B", image: ImgDefault },
    { id: 5, title: "Funk", image: ImgDefault },
    { id: 6, title: "Rock", image: ImgDefault },
    { id: 7, title: "Disco", image: ImgDefault },
    { id: 8, title: "Reggae", image: ImgDefault },
    { id: 9, title: "Latin", image: ImgDefault },
    { id: 10, title: "Pop", image: ImgDefault },
    // …필요만큼 추가
  ];

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
          // TarotDeck에서 onSelect?.({ ...form, inputKey: key, job });
          console.log("홈에서 받은 데이터:", payload);
          setResult(payload.job); // 🎯 DrumJob 조회 응답 전체 저장
          setIsModalOpen(true); // 🔥 변환 완료 시 모달 열기
        }}
      />

      {/* 🎉 변환 완료 모달 (팝업) */}
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
              {/* 백엔드에서 pdf_key에 S3 전체 URL을 넣어준다고 가정 */}
              {result.pdfKey && (
                <a href={result.pdfKey} style={btnStyle}>
                  악보(PDF) 다운로드
                </a>
              )}

              {/* 오디오 결과 (예: 드럼만 오디오 or 믹스 오디오) */}
              {result.audioKey && (
                <a href={result.audioKey} style={btnStyle}>
                  오디오 파일 다운로드
                </a>
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
