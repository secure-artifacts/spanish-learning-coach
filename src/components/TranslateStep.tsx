import { useState } from 'react';
import type { Step } from '../types';
import { textsMatch } from '../utils/speech';

interface Props {
  step: Step;
  done: boolean;
  onToggle: () => void;
}

export function TranslateStep({ step, done, onToggle }: Props) {
  const items = step.translationItems ?? [];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const checkItem = (i: number) => {
    const ok = textsMatch(answers[i] ?? '', items[i].es);
    setRevealed((r) => ({ ...r, [i]: true }));
    if (ok && Object.keys(revealed).length + 1 >= items.length) onToggle();
  };

  const revealAll = () => {
    const all: Record<number, boolean> = {};
    items.forEach((_, i) => {
      all[i] = true;
    });
    setRevealed(all);
  };

  return (
    <div className="step-body">
      <p className="step-instructions">
        {step.instructions ?? '先独立写出西语，再点击「核对」或「显示答案」。'}
      </p>
      <div className="translate-list">
        {items.map((item, i) => (
          <div key={i} className="translate-item">
            <p className="translate-zh">{i + 1}. {item.zh}</p>
            <textarea
              className="dictation-input"
              rows={2}
              placeholder="写西语翻译…"
              value={answers[i] ?? ''}
              onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
            />
            <div className="step-actions">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => checkItem(i)}>
                核对
              </button>
            </div>
            {revealed[i] && (
              <p className="translate-answer">
                参考：{item.es}
                {textsMatch(answers[i] ?? '', item.es) ? ' ✓' : '（对照改进）'}
              </p>
            )}
          </div>
        ))}
      </div>
      <div className="step-actions">
        <button type="button" className="btn btn-secondary" onClick={revealAll}>
          显示全部答案
        </button>
        <button type="button" className={`btn ${done ? 'btn-done' : 'btn-secondary'}`} onClick={onToggle}>
          {done ? '✓ 已完成' : '标记完成'}
        </button>
      </div>
    </div>
  );
}
