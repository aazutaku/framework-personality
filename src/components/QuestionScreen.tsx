import type { Question } from '@/data/types';

interface QuestionScreenProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  onAnswer: (choiceIndex: number) => void;
}

export default function QuestionScreen({
  question,
  currentIndex,
  totalQuestions,
  onAnswer,
}: QuestionScreenProps) {
  const progress = ((currentIndex) / totalQuestions) * 100;

  return (
    <div className="question-screen">
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="question-counter">
        Q{currentIndex + 1} / {totalQuestions}
      </div>
      <h2 className="question-text">{question.question}</h2>
      <div className="choices">
        {question.choices.map((choice, index) => (
          <button
            key={index}
            className="choice-button"
            onClick={() => onAnswer(index)}
          >
            <span className="choice-label">
              {String.fromCharCode(65 + index)}
            </span>
            <span className="choice-text">{choice.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
