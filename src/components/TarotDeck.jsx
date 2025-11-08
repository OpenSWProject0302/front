// src/components/TarotDeck.jsx
import { useEffect, useRef, useState } from "react";
import "./TarotDeck.css";
import GenreCard from "./GenreCard";


export default function TarotDeck({ items = [], onSelect }) {
    const [active, setActive] = useState(0);
    const wrapRef = useRef(null);

    // ◀ 이전 버튼 (첫 번째일 때는 맨 끝으로 이동)
    const prev = () =>
        setActive((i) => (i === 0 ? items.length - 1 : i - 1));

    // ▶ 다음 버튼 (마지막일 때는 맨 앞으로 이동)
    const next = () =>
        setActive((i) => (i === items.length - 1 ? 0 : i + 1));

    // 키보드 좌우 화살표 지원
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [items.length]);

    // 휠(트랙패드 좌우 스와이프)
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const onWheel = (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                if (e.deltaX > 0) next();
                else prev();
            }
        };
        el.addEventListener("wheel", onWheel, { passive: true });
        return () => el.removeEventListener("wheel", onWheel);
    }, [items.length]);

    // 터치 스와이프(모바일)
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        let startX = 0;
        const onTouchStart = (e) => (startX = e.touches[0].clientX);
        const onTouchEnd = (e) => {
            const dx = e.changedTouches[0].clientX - startX;
            if (dx < -30) next();
            if (dx > 30) prev();
        };
        el.addEventListener("touchstart", onTouchStart);
        el.addEventListener("touchend", onTouchEnd);
        return () => {
            el.removeEventListener("touchstart", onTouchStart);
            el.removeEventListener("touchend", onTouchEnd);
        };
    }, [items.length]);

    return (
        <div className="tarot-wrap" ref={wrapRef}>
            <button className="nav-btn left" onClick={prev}>‹</button>
            <div className="deck">
                {items.map((it, i) => {
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
                                cursor: "pointer",
                            }}
                            onClick={() => (abs > 0 ? setActive(i) : onSelect?.(it))}
                        >
                            <GenreCard
                                title={it.title}
                                image={it.image}
                                onClick={() => onSelect?.(it)}
                            />
                        </div>
                    );
                })}
            </div>
            <button className="nav-btn right" onClick={next}>›</button>
        </div>
    );
}
