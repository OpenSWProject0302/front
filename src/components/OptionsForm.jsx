// src/components/OptionsForm.jsx
import { useState } from "react";

export default function OptionsForm({
    defaultValues,
    onSubmit,
    onCancel,
    children, // 🔥 Pop 세부 장르용
}) {
    const [difficulty, setDifficulty] = useState("Easy");
    const [instrument, setInstrument] = useState("drum");
    const [bpm, setBpm] = useState(120);
    const [file, setFile] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        onSubmit?.({
            genreId: defaultValues?.genreId,
            title: defaultValues?.title,
            difficulty,
            instrument,
            bpm,
            file,
        });
    };

    return (
        <form className="options-wrap" onSubmit={submit}>
            {/* ✅ 카드 안 맨 위에 항상 장르 이름 */}
            <h3 className="options-title">
                {defaultValues?.title || "옵션 선택"}
            </h3>

            {/* 🔥 Pop 전용 세부 장르 필드는 여기: (현재 구조 유지) */}
            {children}

            {/* 난이도 */}
            <label className="options-label difficulty-label">
                악보 난이도
                <span className="tooltip-icon">?</span>
                <div className="tooltip-content">
                    <strong>Easy:</strong> 단순하고 적은 패턴으로 초보자에게 적합한
                    리듬 패턴을 제공합니다.
                    <br />
                    <br />
                    <strong>Normal:</strong> 실용적이고 재미있는 리듬 패턴으로
                    중급자에게 적합한 리듬 패턴을 제공합니다.
                </div>
            </label>
            <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="options-input"
            >
                <option>Easy</option>
                <option>Normal</option>
            </select>

            {/* 악기 */}
            <label className="options-label">추출할 악기</label>
            <select
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
                className="options-input"
            >
                <option value="drum">드럼</option>
            </select>

            {/* BPM */}
            <label className="options-label">음원의 BPM</label>
            <input
                type="number"
                min={40}
                max={300}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="options-input"
                placeholder="예: 120"
            />

            {/* 파일 업로드 */}
            <label className="options-label">음원파일 업로드</label>
            <input
                type="file"
                accept=".mp3,.wav,.flac"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="options-input"
            />

            {/* 버튼 */}
            <div className="options-actions">
                <button type="button" onClick={onCancel} className="btn ghost">
                    취소
                </button>
                <button type="submit" className="btn primary">
                    변환 시작
                </button>
            </div>
        </form>
    );
}
