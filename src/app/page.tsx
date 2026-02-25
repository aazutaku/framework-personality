'use client';

import { useState, useCallback, useEffect } from 'react';
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
  none: 0,
};

interface FoamBlob {
  id: number;
  left: number;
  size: number;
  delay: number;
  layer: number;
}

interface Bubble {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  wobble: number;
}

function FoamOverlay() {
  const [foamBlobs, setFoamBlobs] = useState<FoamBlob[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    // 3層の泡ブロブ（奥→手前で大きく）
    const blobs: FoamBlob[] = [];
    // 奥の層: 小さめ、密に
    for (let i = 0; i < 14; i++) {
      blobs.push({
        id: i,
        left: -5 + (i / 13) * 110,
        size: 50 + Math.random() * 30,
        delay: Math.random() * 0.3,
        layer: 0,
      });
    }
    // 中間層
    for (let i = 0; i < 10; i++) {
      blobs.push({
        id: 100 + i,
        left: -5 + (i / 9) * 110,
        size: 55 + Math.random() * 35,
        delay: Math.random() * 0.3 + 0.05,
        layer: 1,
      });
    }
    // 手前の層: 大きく、少なめ
    for (let i = 0; i < 8; i++) {
      blobs.push({
        id: 200 + i,
        left: -5 + (i / 7) * 110,
        size: 60 + Math.random() * 40,
        delay: Math.random() * 0.3 + 0.1,
        layer: 2,
      });
    }
    setFoamBlobs(blobs);

    const b = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 3 + Math.random() * 10,
      delay: Math.random() * 1.4,
      duration: 1.2 + Math.random() * 1.8,
      wobble: -15 + Math.random() * 30,
    }));
    setBubbles(b);
  }, []);

  return (
    <div className="foam-overlay">
      <div className="foam-beer">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="bubble"
            style={{
              left: `${b.left}%`,
              bottom: '0%',
              width: `${b.size}px`,
              height: `${b.size}px`,
              animationDelay: `${b.delay}s`,
              animationDuration: `${b.duration}s`,
              ['--wobble' as string]: `${b.wobble}px`,
            }}
          />
        ))}
        <div className="foam-head">
          {foamBlobs.map((blob) => (
            <div
              key={blob.id}
              className={`foam-blob foam-blob-layer${blob.layer}`}
              style={{
                left: `${blob.left}%`,
                width: `${blob.size}px`,
                height: `${blob.size}px`,
                animationDelay: `${blob.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<FrameworkType, number>>({ ...initialScores });
  const [result, setResult] = useState<FrameworkResult | null>(null);
  const [fadeClass, setFadeClass] = useState('fade-in');
  const [showFoam, setShowFoam] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowFoam(false), 3200);
    return () => clearTimeout(timer);
  }, []);

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
    <>
      {showFoam && <FoamOverlay />}
      <div className="app">
        <div className={`app-content screen-container ${fadeClass}`}>
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
    </>
  );
}
