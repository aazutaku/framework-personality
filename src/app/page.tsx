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

interface Bubble {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  wobble: number;
}

interface FoamDrip {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  wobble: number;
  variant: number;
  opacity: number;
  stretch: number;
  blur: number;
  kind: 'blob' | 'stream';
}

function FoamOverlay() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [foamDrips, setFoamDrips] = useState<FoamDrip[]>([]);

  useEffect(() => {
    // 炭酸の泡（ビール中を上昇）
    const b = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 3 + Math.random() * 10,
      delay: Math.random() * 1.4,
      duration: 1.2 + Math.random() * 1.8,
      wobble: -15 + Math.random() * 30,
    }));
    setBubbles(b);

    // 上から溢れ落ちてくるクリーミーな白泡
    const drips: FoamDrip[] = [];
    let id = 0;

    // クリームの流れ（太い帯状の泡が流れ落ちる）
    for (let i = 0; i < 18; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 30 + Math.random() * 40,
        delay: 0.6 + Math.random() * 0.8,
        duration: 1.8 + Math.random() * 1.2,
        wobble: -8 + Math.random() * 16,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.7 + Math.random() * 0.3,
        stretch: 2.5 + Math.random() * 2.0,
        blur: 6 + Math.random() * 8,
        kind: 'stream',
      });
    }

    // 大きめのクリーミーな塊（ぼかし強め）
    for (let i = 0; i < 40; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 20 + Math.random() * 25,
        delay: 0.7 + Math.random() * 1.0,
        duration: 1.4 + Math.random() * 1.2,
        wobble: -10 + Math.random() * 20,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.75 + Math.random() * 0.25,
        stretch: 1.5 + Math.random() * 1.5,
        blur: 4 + Math.random() * 6,
        kind: 'blob',
      });
    }

    // 中くらいの泡（ソフトフォーカス）
    for (let i = 0; i < 60; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 10 + Math.random() * 14,
        delay: 0.8 + Math.random() * 1.0,
        duration: 1.0 + Math.random() * 1.2,
        wobble: -12 + Math.random() * 24,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.7 + Math.random() * 0.3,
        stretch: 1.2 + Math.random() * 1.0,
        blur: 2 + Math.random() * 4,
        kind: 'blob',
      });
    }

    // 細かい泡（ディテール用、ぼかし少なめ）
    for (let i = 0; i < 50; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 5 + Math.random() * 8,
        delay: 0.7 + Math.random() * 1.3,
        duration: 0.8 + Math.random() * 1.0,
        wobble: -15 + Math.random() * 30,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.5 + Math.random() * 0.4,
        stretch: 1.0 + Math.random() * 0.6,
        blur: 1 + Math.random() * 2,
        kind: 'blob',
      });
    }

    setFoamDrips(drips);
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
      </div>
      <div className="foam-cascade">
        {foamDrips.map((d) => (
          <div
            key={d.id}
            className={`foam-drip foam-drip-v${d.variant} ${d.kind === 'stream' ? 'foam-stream' : ''}`}
            style={{
              left: `${d.left}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
              filter: `blur(${d.blur}px)`,
              ['--drip-wobble' as string]: `${d.wobble}px`,
              ['--drip-opacity' as string]: d.opacity,
              ['--drip-stretch' as string]: d.stretch,
            }}
          />
        ))}
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
    const timer = setTimeout(() => setShowFoam(false), 4500);
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
