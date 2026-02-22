import type { FrameworkResult, FrameworkType } from '../data/types';

interface ResultScreenProps {
  result: FrameworkResult;
  scores: Record<FrameworkType, number>;
  onRetry: () => void;
}

export default function ResultScreen({ result, scores, onRetry }: ResultScreenProps) {
  const maxScore = Math.max(...Object.values(scores));
  const sortedScores = Object.entries(scores)
    .sort(([, a], [, b]) => b - a) as [FrameworkType, number][];

  const frameworkLabels: Record<FrameworkType, string> = {
    threeC: '3C分析',
    fourP: '4P分析',
    pest: 'PEST分析',
    swot: 'SWOT分析',
    fiveForces: '5フォース',
  };

  const handleShare = () => {
    const text = `【フレームワーク性格診断】\n私は「${result.name}」${result.subtitle}でした！\n${result.emoji}\n\n${result.description.slice(0, 60)}…\n\n#フレームワーク性格診断 #分析FW診断`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {
        navigator.clipboard.writeText(text);
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('結果をコピーしました！SNSに貼り付けてシェアしよう');
    }
  };

  return (
    <div className="result-screen">
      <div className="result-header">
        <p className="result-label">あなたの分析タイプは…</p>
        <div className="result-emoji">{result.emoji}</div>
        <h1 className="result-name">{result.name}</h1>
        <p className="result-subtitle">{result.subtitle}</p>
      </div>

      <div className="result-card">
        <p className="result-description">{result.description}</p>
      </div>

      <div className="result-card">
        <h3 className="card-title">🧬 あなたの特徴</h3>
        <ul className="traits-list">
          {result.traits.map((trait, i) => (
            <li key={i}>{trait}</li>
          ))}
        </ul>
      </div>

      <div className="result-card warning-card">
        <h3 className="card-title">⚠️ 弱点</h3>
        <p>{result.weakness}</p>
      </div>

      <div className="result-card drinking-card">
        <h3 className="card-title">🍻 飲み会での注意事項</h3>
        <p>{result.drinkingAdvice}</p>
      </div>

      <div className="result-card">
        <h3 className="card-title">💑 相性</h3>
        <p className="compat-good">✅ ベスト: {result.compatibility.best}</p>
        <p className="compat-bad">❌ ワースト: {result.compatibility.worst}</p>
      </div>

      <div className="result-card">
        <h3 className="card-title">📊 スコア分布</h3>
        <div className="score-chart">
          {sortedScores.map(([type, score]) => (
            <div key={type} className="score-row">
              <span className="score-label">{frameworkLabels[type]}</span>
              <div className="score-bar-container">
                <div
                  className={`score-bar ${type === result.type ? 'score-bar-primary' : ''}`}
                  style={{ width: `${(score / maxScore) * 100}%` }}
                />
              </div>
              <span className="score-value">{score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="result-actions">
        <button className="share-button" onClick={handleShare}>
          結果をシェア 📤
        </button>
        <button className="retry-button" onClick={onRetry}>
          もう一度診断する
        </button>
      </div>
    </div>
  );
}
