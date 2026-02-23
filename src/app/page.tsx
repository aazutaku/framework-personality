'use client';

import { useState, useCallback } from 'react';
import StartScreen from '@/components/StartScreen';
import QuestionScreen from '@/components/QuestionScreen';
import ResultScreen from '@/components/ResultScreen';
import type { FrameworkType, FrameworkResult, Question } from '@/data/types';
import questionsData from '@/data/questions.json';
import resultsData from '@/data/results.json';

type Screen = 'start' | 'quiz' | 'result';

const questions = questionsData as Question[];
const results = resultsData as FrameworkResult[];

const initialScores: Record<FrameworkType, number> = {
  threeC: 0,
  fourP: 0,
  pest: 0,
  swot: 0,
  fiveForces: 0,
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<FrameworkType, number>>({ ...initialScores });
  const [result, setResult] = useState<FrameworkResult | null>(null);
  const [fadeClass, setFadeClass] = useState('fade-in');

  const transition = useCallback((callback: () => void) => {
    setFadeClass('fade-out');
    setTimeout(() => {
      callback();
      setFadeClass('fade-in');
    }, 300);
  }, []);

  const handleStart = useCallback(() => {
    transition(() => {
      setScreen('quiz');
      setCurrentQuestion(0);
      setScores({ ...initialScores });
    });
  }, [transition]);

  const handleAnswer = useCallback((choiceIndex: number) => {
    const question = questions[currentQuestion];
    const choice = question.choices[choiceIndex];

    const newScores = { ...scores };
    for (const [key, value] of Object.entries(choice.scores)) {
      newScores[key as FrameworkType] += value;
    }
    setScores(newScores);

    if (currentQuestion + 1 < questions.length) {
      transition(() => {
        setCurrentQuestion(currentQuestion + 1);
      });
    } else {
      const topType = (Object.entries(newScores) as [FrameworkType, number][])
        .sort(([, a], [, b]) => b - a)[0][0];
      const matchedResult = results.find((r) => r.type === topType)!;
      transition(() => {
        setResult(matchedResult);
        setScreen('result');
      });
    }
  }, [currentQuestion, scores, transition]);

  const handleRetry = useCallback(() => {
    transition(() => {
      setScreen('start');
      setCurrentQuestion(0);
      setScores({ ...initialScores });
      setResult(null);
    });
  }, [transition]);

  return (
    <div className="app">
      <div className={`screen-container ${fadeClass}`}>
        {screen === 'start' && <StartScreen onStart={handleStart} />}
        {screen === 'quiz' && (
          <QuestionScreen
            question={questions[currentQuestion]}
            currentIndex={currentQuestion}
            totalQuestions={questions.length}
            onAnswer={handleAnswer}
          />
        )}
        {screen === 'result' && result && (
          <ResultScreen result={result} scores={scores} onRetry={handleRetry} />
        )}
      </div>
    </div>
  );
}
