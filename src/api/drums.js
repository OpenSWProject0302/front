import { fetchJSON } from "./client";

// 1) 드럼 Job 시작: POST /api/jobs/drums/start
export async function startDrumJob({ inputKey, genre, tempo, level }) {
  return await fetchJSON("/api/jobs/drums/start", {
    method: "POST",
    body: {
      inputKey, // uploads/{guest_id}/{uuid}.wav
      genre,    // 예: "Ballad" or "Rock"
      tempo,    // BPM 숫자
      level,    // "Easy" | "Normal"
    },
  });
}

// 2) 드럼 Job 상태 조회: GET /api/jobs/drums/:jobId
export async function getDrumJob(jobId) {
  return await fetchJSON(`/api/jobs/drums/${jobId}`, {
    method: "GET",
  });
}
