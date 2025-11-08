// src/components/FlippableGenreCard.jsx
import GenreCard from "./GenreCard";
import OptionsForm from "./OptionsForm";
import "./FlippableGenreCard.css";

/**
 * props:
 *  - item
 *  - isActive: 현재 중앙 카드인지
 *  - flipped: 현재 뒤집혀 있는지 (제어형)
 *  - onFlip(): 앞면 클릭 시 호출 (isActive일 때만 쓰기)
 *  - onCancel(): 뒷면에서 취소 클릭
 *  - onSubmit(payload)
 */
export default function FlippableGenreCard({
    item,
    isActive,
    flipped,
    onFlip,
    onCancel,
    onSubmit,
}) {
    return (
        <div className={`flip-card ${flipped ? "is-flipped" : ""}`}>
            <div className="flip-inner">
                {/* 앞면 */}
                <div
                    className="flip-face flip-front"
                    onClick={() => {
                        if (isActive) onFlip?.(); // 중앙일 때만 뒤집기
                    }}
                    // 중앙이 아니면 클릭 불가처럼 보이게 커서 표시만 변경(선택)
                    style={{ cursor: isActive ? "pointer" : "default" }}
                >
                    <GenreCard title={item.title} image={item.image} onClick={() => { }} />
                </div>

                {/* 뒷면 */}
                <div className="flip-face flip-back">
                    <OptionsForm
                        defaultValues={{ genreId: item.id, title: item.title }}
                        onCancel={onCancel}
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
