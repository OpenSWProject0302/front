import { fetchJSON } from "./client";

export async function initGuest() {
  // GET /api/guest/init
  const data = await fetchJSON("/api/guest/init", { method: "GET" });
  // { ok, guestId } 예상. 실제로 중요한 건 쿠키 세팅.
  return data;
}
