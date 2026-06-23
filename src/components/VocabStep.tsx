import { useState } from 'react';
import type { Step } from '../types';
import { speakSpanish } from '../utils/speech';
import { useAccumulation } from '../hooks/useAccumulation';

interface Props {
  step: Step;
  done: boolean;
  onToggle: () => void;
}

export function VocabStep({ step, done, onToggle }: Props) {
  const { addMany, items } = useAccumulation();
  const vocab = step.vocabItems ?? [];
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const knownCount = Object.values(checked).filter(Boolean).length;
  const savedCount = vocab.filter((v) =>
    items.some((i) => i.es.toLowerCase() === v.es.toLowerCase()),
  ).length;

  const saveAll = () => {
    addMany(vocab, step.title ?? '词汇');
    onToggle();
  };

  return (
    <div className="step-body">
      <p className="step-instructions">
        {step.instructions ??
          '点击卡片翻转看中文。已掌握的打勾，不熟的词会加入你的「积累本」。建议大声朗读 3 遍。'}
      </p>
      <div className="vocab-stats">
        已掌握 {knownCount}/{vocab.length} · 积累本已有 {savedCount} 个本课词
      </div>
      <div className="vocab-grid">
        {vocab.map((v, i) => (
          <div
            key={i}
            className={`vocab-card ${flipped[i] ? 'flipped' : ''} ${checked[i] ? 'known' : ''}`}
          >
            <button
              type="button"
              className="vocab-face vocab-front"
              onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
            >
              <span className="vocab-es">{v.es}</span>
              {v.note && <span className="vocab-note">{v.note}</span>}
            </button>
            {flipped[i] && (
              <div className="vocab-face vocab-back">
                <span className="vocab-zh">{v.zh}</span>
              </div>
            )}
            <div className="vocab-actions">
              <button type="button" className="btn-icon" onClick={() => speakSpanish(v.es)} title="朗读">
                🔊
              </button>
              <label className="vocab-check">
                <input
                  type="checkbox"
                  checked={!!checked[i]}
                  onChange={(e) => setChecked((c) => ({ ...c, [i]: e.target.checked }))}
                />
                掌握
              </label>
            </div>
          </div>
        ))}
      </div>
      <div className="step-actions">
        <button type="button" className="btn btn-primary" onClick={saveAll}>
          全部加入积累本
        </button>
        <button type="button" className={`btn ${done ? 'btn-done' : 'btn-secondary'}`} onClick={onToggle}>
          {done ? '✓ 已完成' : '标记完成'}
        </button>
      </div>
    </div>
  );
}
