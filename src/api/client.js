const BASE_URL = ""; // 같은 도메인이면 빈 문자열, 프록시/별도 도메인이면 'https://api.example.com'

export async function fetchJSON(
  path,
  { method = "GET", headers = {}, body } = {}
) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include", // ✅ 쿠키 주고받기
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const msg = data?.message || res.statusText || "Request failed";
    throw new Error(msg);
  }
  return data;
}
