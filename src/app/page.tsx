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
  x: number;
  y: number;
  size: number;
  delay: number;
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
    // 細かい泡を大量生成（画面を埋め尽くす）
    const blobs: FoamBlob[] = [];
    let id = 0;

    // 泡の頭部分（ビールの上に乗る厚い層）: 6行 x 密に配置
    for (let row = 0; row < 6; row++) {
      const count = 12 + Math.floor(Math.random() * 4);
      for (let col = 0; col < count; col++) {
        blobs.push({
          id: id++,
          x: -8 + (col / (count - 1)) * 116 + (Math.random() - 0.5) * 10,
          y: row * 22 + Math.random() * 12,
          size: 28 + Math.random() * 22,
          delay: row * 0.04 + Math.random() * 0.08,
        });
      }
    }

    // 溢れ出す泡（画面上部まで広がる）: さらに上に積み重ね
    for (let row = 6; row < 30; row++) {
      const count = 10 + Math.floor(Math.random() * 6);
      for (let col = 0; col < count; col++) {
        blobs.push({
          id: id++,
          x: -8 + (col / (count - 1)) * 116 + (Math.random() - 0.5) * 14,
          y: row * 22 + Math.random() * 14,
          size: 30 + Math.random() * 28,
          delay: 0.3 + row * 0.02 + Math.random() * 0.06,
        });
      }
    }

    setFoamBlobs(blobs);

    const b = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 8,
      delay: Math.random() * 1.0,
      duration: 0.8 + Math.random() * 1.2,
      wobble: -12 + Math.random() * 24,
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
              className="foam-blob"
              style={{
                left: `${blob.x}%`,
                bottom: `${blob.y}px`,
                width: `${blob.size}px`,
                height: `${blob.size}px`,
                animationDelay: `${blob.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="foam-whiteout" />
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
    const timer = setTimeout(() => setShowFoam(false), 4000);
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
