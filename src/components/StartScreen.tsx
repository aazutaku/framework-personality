interface StartScreenProps {
  onStart: () => void;
}

export default function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div className="start-screen">
      <div className="start-icon">🍺</div>
      <h1 className="start-title">
        フレームワーク
        <br />
        飲み会診断
      </h1>
      <p className="start-subtitle">
        あなたの思考のクセから
        <br />
        飲み会での振る舞いが丸わかり！
      </p>
      <div className="start-frameworks">
        <span className="fw-tag">3C</span>
        <span className="fw-tag">4P</span>
        <span className="fw-tag">PEST</span>
        <span className="fw-tag">SWOT</span>
        <span className="fw-tag">5Forces</span>
      </div>
      <button className="start-button" onClick={onStart}>
        診断スタート
      </button>
      <p className="start-note">全10問・所要時間 約2分</p>
    </div>
  );
}
