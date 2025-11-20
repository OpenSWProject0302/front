import { fetchJSON } from "./client";

// 드럼 파이프라인 실행
export async function processDrums({ inputKey, genre, tempo, level }) {
  return await fetchJSON("/api/drums/process", {
    method: "POST",
    body: {
      inputKey, // uploads/{guest_id}/{uuid}.mp3
      genre, // 예: "Ballad" or "Rock"
      tempo, // BPM 숫자
      level, // "Easy" | "Normal"
    },
  });
}
