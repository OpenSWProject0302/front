import { useState } from "react";
import GenreCard from "./GenreCard";
import OptionsForm from "./OptionsForm";
import "./FlippableGenreCard.css";

export default function FlippableGenreCard({
    item,
    isActive,
    flipped,
    onFlip,
    onCancel,
    onSubmit,
}) {
    const [subGenre, setSubGenre] = useState("");

    const handleFormSubmit = (formValues) => {
        if (item.title === "Pop" && !subGenre) {
            alert("Pop 세부 장르를 선택해 주세요.");
            return;
        }

        onSubmit?.({
            ...formValues,
            subGenre,
            title: formValues.title ?? item.title,
        });
    };

    return (
        <div className={`flip-card ${flipped ? "is-flipped" : ""}`}>
            <div className="flip-inner">
                {/* 앞면 */}
                <div
                    className="flip-face flip-front"
                    onClick={() => {
                        if (isActive) onFlip?.();
                    }}
                    style={{ cursor: isActive ? "pointer" : "default" }}
                >
                    <GenreCard title={item.title} image={item.image} onClick={() => { }} />
                </div>

                {/* 뒷면 */}
                <div className="flip-face flip-back">
                    <OptionsForm
                        defaultValues={{ genreId: item.id, title: item.title }}
                        onCancel={onCancel}
                        onSubmit={handleFormSubmit}
                    >
                        {/* Pop일 때만 카드 안 아래쪽에 세부 장르 한 줄 추가 */}
                        {item.title === "Pop" && (
                            <div className="genre-sub-field">
                                <label className="genre-sub-label">세부 장르</label>
                                <select
                                    className="genre-sub-select"
                                    value={subGenre}
                                    onChange={(e) => setSubGenre(e.target.value)}
                                >
                                    <option value="">선택해주세요</option>
                                    <option value="Ballad">Pop Ballad</option>
                                    <option value="Rock">Pop Rock</option>
                                    <option value="Funk">Pop Funk</option>
                                    <option value="R&B">Pop R&amp;B</option>
                                    <option value="Disco">Pop Disco</option>
                                </select>
                            </div>
                        )}
                    </OptionsForm>
                </div>
            </div>
        </div>
    );
}
