// src/pages/home.jsx
import TarotDeck from "../components/TarotDeck";
import ImgDefault from "../image/genre_default.png";

export default function Home() {
  const genres = [
    { id: 1, title: "Ballad", image: ImgDefault },
    { id: 2, title: "Blues", image: ImgDefault },
    { id: 3, title: "Jazz", image: ImgDefault },
    { id: 4, title: "R&B", image: ImgDefault },
    { id: 5, title: "Funk", image: ImgDefault },
    { id: 6, title: "Rock", image: ImgDefault },
    { id: 7, title: "Disco", image: ImgDefault },
    { id: 8, title: "Reggae", image: ImgDefault },
    { id: 9, title: "Latin", image: ImgDefault },
    // …필요만큼 추가 
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#C2DAEF", padding: "40px 0" }}>
      <h1 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 24px 60px" }}>EaSheet</h1>
      <TarotDeck
        items={genres}
        onSelect={(g) => console.log("선택:", g.title)}
      />
    </div>
  );
}
