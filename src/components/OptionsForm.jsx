import { useState } from "react";

export default function OptionsForm({ defaultValues, onSubmit, onCancel }) {
    const [difficulty, setDifficulty] = useState("Easy");
    const [instrument, setInstrument] = useState("drum");
    const [bpm, setBpm] = useState(120);
    const [file, setFile] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        onSubmit?.({
            genreId: defaultValues?.genreId,
            difficulty,
            instrument,
            bpm,
            file,
        });
    };

    return (
        <form className="options-wrap" onSubmit={submit}>
            <h3 className="options-title">{defaultValues?.title || "옵션 선택"}</h3>

            {/* 난이도 */}
            <label className="options-label">악보 난이도</label>
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

            {/* BPM (숫자 입력만) */}
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
