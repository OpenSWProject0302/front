// src/components/TarotDeck.jsx
import { useEffect, useRef, useState } from "react";
import FlippableGenreCard from "./FlippableGenreCard";
import "./TarotDeck.css";

export default function TarotDeck({ items = [], onSelect }) {
    const [active, setActive] = useState(0);     // 중앙 카드 index
    const [flipped, setFlipped] = useState(false); // 단 하나만 뒤집힘
    const wrapRef = useRef(null);

    const count = items.length;
    const wrap = (i) => ((i % count) + count) % count;

    const focusTo = (i) => {
        setActive(wrap(i));
        setFlipped(false); // 포커스 이동 시 항상 앞면으로
    };

    const prev = () => focusTo(active - 1);
    const next = () => focusTo(active + 1);

    // 키보드
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Escape") setFlipped(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [active, count]);

    // 휠/스와이프
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const onWheel = (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) (e.deltaX > 0 ? next() : prev());
        };
        el.addEventListener("wheel", onWheel, { passive: true });
        return () => el.removeEventListener("wheel", onWheel);
    }, [active, count]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        let startX = 0;
        const ts = (e) => (startX = e.touches[0].clientX);
        const te = (e) => {
            const dx = e.changedTouches[0].clientX - startX;
            if (dx < -30) next();
            if (dx > 30) prev();
        };
        el.addEventListener("touchstart", ts);
        el.addEventListener("touchend", te);
        return () => {
            el.removeEventListener("touchstart", ts);
            el.removeEventListener("touchend", te);
        };
    }, [active, count]);

    if (!count) return null;

    return (
        <div className="tarot-wrap" ref={wrapRef}>
            <button className="nav-btn left" onClick={prev} aria-label="이전">‹</button>
            <div className="deck">
                {items.map((it, i) => {
                    const isActive = i === active;
                    const offset = i - active;
                    const abs = Math.abs(offset);
                    const translateX = offset * 220;
                    const translateY = Math.min(abs * 8, 24);
                    const rotate = offset * -2.5;
                    const scale = 1 - Math.min(abs * 0.08, 0.32);
                    const zIndex = 100 - abs;

                    return (
                        <div
                            key={it.id ?? i}
                            style={{
                                position: "absolute",
                                transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotate}deg) scale(${scale})`,
                                zIndex,
                                opacity: 1 - Math.min(abs * 0.15, 0.45),
                                transition: "transform 0.3s ease, opacity 0.3s ease",
                            }}
                            onClick={() => {
                                // 옆 카드 클릭 시: 포커스만 이동 (뒤집지 않음)
                                if (!isActive) focusTo(i);
                            }}
                        >
                            <FlippableGenreCard
                                item={it}
                                isActive={isActive}
                                flipped={isActive && flipped}
                                onFlip={() => setFlipped(true)}          // 중앙 카드 앞면 클릭 → 뒤집기
                                onCancel={() => setFlipped(false)}       // 폼의 취소
                                onSubmit={(payload) => {
                                    // 제출 처리 (필요 시 부모로 전달/업로드 등)
                                    onSelect?.(payload);
                                    setFlipped(false);
                                }}
                            />
                        </div>
                    );
                })}
            </div>
            <button className="nav-btn right" onClick={next} aria-label="다음">›</button>
        </div>
    );
}
