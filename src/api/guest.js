import { fetchJSON } from "./client";

export async function initGuest() {
  // GET /api/guest/init
  const data = await fetchJSON("/api/guest/init", { method: "GET" });
  
  return data;
}
