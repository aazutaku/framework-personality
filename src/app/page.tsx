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

function CarbonationBubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const b = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 3 + Math.random() * 10,
      delay: Math.random() * 3.0,
      duration: 2.0 + Math.random() * 3.0,
      wobble: -15 + Math.random() * 30,
    }));
    setBubbles(b);
  }, []);

  return (
    <div className="carbonation-bg">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble-loop"
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
      <div className="foam-top-band" />
      <div className="foam-top-band-soft" />
    </div>
  );
}

function FoamOverlay() {
  const [foamDrips, setFoamDrips] = useState<FoamDrip[]>([]);

  useEffect(() => {
    // 上から溢れ落ちてくるクリーミーな白泡
    const drips: FoamDrip[] = [];
    let id = 0;

    // === 第1波: ちょろっと垂れ始める（delay 0〜0.5s, 少量） ===

    for (let i = 0; i < 8; i++) {
      drips.push({
        id: id++,
        left: 10 + Math.random() * 80,
        size: 15 + Math.random() * 20,
        delay: Math.random() * 0.5,
        duration: 2.2 + Math.random() * 1.0,
        wobble: -3 + Math.random() * 6,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.8 + Math.random() * 0.2,
        stretch: 2.5 + Math.random() * 1.5,
        blur: 3 + Math.random() * 4,
        kind: 'stream',
      });
    }

    // === 第2波: じわじわ増えてくる（delay 0.4〜1.0s） ===

    for (let i = 0; i < 25; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 18 + Math.random() * 25,
        delay: 0.4 + Math.random() * 0.6,
        duration: 2.0 + Math.random() * 1.0,
        wobble: -4 + Math.random() * 8,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.8 + Math.random() * 0.2,
        stretch: 2.5 + Math.random() * 1.5,
        blur: 3 + Math.random() * 5,
        kind: 'stream',
      });
    }

    // 丸い泡も混ざり始める
    for (let i = 0; i < 15; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 12 + Math.random() * 16,
        delay: 0.5 + Math.random() * 0.5,
        duration: 1.6 + Math.random() * 0.8,
        wobble: -4 + Math.random() * 8,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.75 + Math.random() * 0.25,
        stretch: 1.2 + Math.random() * 0.8,
        blur: 2 + Math.random() * 3,
        kind: 'blob',
      });
    }

    // === 第3波: かなり増えてきた（delay 0.9〜1.6s） ===

    for (let i = 0; i < 50; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 20 + Math.random() * 30,
        delay: 0.9 + Math.random() * 0.7,
        duration: 1.8 + Math.random() * 1.2,
        wobble: -4 + Math.random() * 8,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.82 + Math.random() * 0.18,
        stretch: 2.8 + Math.random() * 2.0,
        blur: 3 + Math.random() * 5,
        kind: 'stream',
      });
    }

    for (let i = 0; i < 30; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 14 + Math.random() * 18,
        delay: 1.0 + Math.random() * 0.6,
        duration: 1.4 + Math.random() * 1.0,
        wobble: -5 + Math.random() * 10,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.75 + Math.random() * 0.25,
        stretch: 1.3 + Math.random() * 0.8,
        blur: 2 + Math.random() * 4,
        kind: 'blob',
      });
    }

    // === 第4波: ドバーッと溢れる（delay 1.5〜2.3s, 大量） ===

    // 太いクリームで画面を均等に覆う
    for (let i = 0; i < 60; i++) {
      drips.push({
        id: id++,
        left: (i / 60) * 100 + (Math.random() - 0.5) * 4,
        size: 25 + Math.random() * 40,
        delay: 1.5 + Math.random() * 0.8,
        duration: 1.8 + Math.random() * 1.2,
        wobble: -3 + Math.random() * 6,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.85 + Math.random() * 0.15,
        stretch: 3.0 + Math.random() * 2.5,
        blur: 4 + Math.random() * 6,
        kind: 'stream',
      });
    }

    // 隙間を埋め尽くす
    for (let i = 0; i < 60; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 18 + Math.random() * 28,
        delay: 1.6 + Math.random() * 0.7,
        duration: 1.6 + Math.random() * 1.0,
        wobble: -4 + Math.random() * 8,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.8 + Math.random() * 0.2,
        stretch: 2.5 + Math.random() * 2.0,
        blur: 3 + Math.random() * 5,
        kind: 'stream',
      });
    }

    // === 第5波: 止まらない追い打ち（delay 2.2〜3.0s） ===

    for (let i = 0; i < 50; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 12 + Math.random() * 22,
        delay: 2.2 + Math.random() * 0.8,
        duration: 1.2 + Math.random() * 1.0,
        wobble: -5 + Math.random() * 10,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.7 + Math.random() * 0.3,
        stretch: 2.0 + Math.random() * 2.0,
        blur: 2 + Math.random() * 4,
        kind: 'stream',
      });
    }

    for (let i = 0; i < 40; i++) {
      drips.push({
        id: id++,
        left: Math.random() * 100,
        size: 10 + Math.random() * 14,
        delay: 2.3 + Math.random() * 0.7,
        duration: 1.0 + Math.random() * 0.8,
        wobble: -6 + Math.random() * 12,
        variant: Math.floor(Math.random() * 3),
        opacity: 0.7 + Math.random() * 0.25,
        stretch: 1.5 + Math.random() * 1.0,
        blur: 1 + Math.random() * 3,
        kind: 'blob',
      });
    }

    setFoamDrips(drips);
  }, []);

  return (
    <div className="foam-overlay">
      <div className="foam-beer" />
      <div className="foam-cascade">
        {foamDrips.map((d) => (
          <div
            key={d.id}
            className={`foam-drip foam-drip-v${d.variant} ${d.kind === 'stream' ? 'foam-stream' : 'foam-blob'}`}
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
      const sortedTypes = (Object.entries(newScores) as [FrameworkType, number][])
        .sort(([, a], [, b]) => b - a);
      const topType = sortedTypes[0][0];
      const secondType = sortedTypes[1][0];
      const matchedResult =
        results.find((r) => r.type === topType && r.secondaryTypes.includes(secondType)) ||
        results.find((r) => r.type === topType)!;
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
      <CarbonationBubbles />
      <FoamOverlay />
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
