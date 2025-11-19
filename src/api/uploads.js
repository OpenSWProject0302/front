// src/api/uploads.js
import { fetchJSON } from "./client";

/** presign 발급 */
export async function presignUpload({ filename, size, contentType }) {
  // POST /api/uploads/presign
  return await fetchJSON("/api/uploads/presign", {
    method: "POST",
    body: { filename, size, contentType },
  });
}

/** S3로 실제 업로드 (PUT presigned URL) */
export async function putToS3({ uploadUrl, file }) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  if (!res.ok) throw new Error(`S3 upload failed with ${res.status}`);
  return true;
}

/* (선택) 진행률 필요하면 XHR 버전
export function putToS3WithProgress({ uploadUrl, file, onProgress }) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300) ? resolve(true) : reject(new Error(`S3 upload failed ${xhr.status}`));
    xhr.onerror = () => reject(new Error("Network error"));
    xhr.send(file);
  });
}
*/
