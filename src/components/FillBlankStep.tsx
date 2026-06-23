import { useState } from 'react';
import type { Step } from '../types';
import { normalizeForCompare } from '../utils/speech';

interface Props {
  step: Step;
  done: boolean;
  onToggle: () => void;
}

export function FillBlankStep({ step, done, onToggle }: Props) {
  const blanks = step.fillBlanks ?? [];
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const check = () => {
    setChecked(true);
    const allOk = blanks.every((b, i) =>
      normalizeForCompare(answers[i] ?? '').includes(normalizeForCompare(b.answer)),
    );
    if (allOk) onToggle();
  };

  return (
    <div className="step-body">
      <p className="step-instructions">
        {step.instructions ?? '在空格处填入正确的词（西语，注意变位和性数）。'}
      </p>
      <div className="fillblank-list">
        {blanks.map((b, i) => {
          const ok =
            checked &&
            normalizeForCompare(answers[i] ?? '').includes(normalizeForCompare(b.answer));
          const bad = checked && !ok;
          return (
            <div key={i} className={`fillblank-item ${ok ? 'correct' : bad ? 'wrong' : ''}`}>
              <p className="fillblank-prompt">{b.prompt}</p>
              {b.hint && <p className="fillblank-hint">提示：{b.hint}</p>}
              <input
                className="fillblank-input"
                placeholder="填入答案…"
                value={answers[i] ?? ''}
                onChange={(e) => {
                  setAnswers((a) => ({ ...a, [i]: e.target.value }));
                  setChecked(false);
                }}
              />
              {bad && <p className="fillblank-answer">参考答案：{b.answer}</p>}
            </div>
          );
        })}
      </div>
      <div className="step-actions">
        <button type="button" className="btn btn-primary" onClick={check}>
          核对答案
        </button>
        <button type="button" className={`btn ${done ? 'btn-done' : 'btn-secondary'}`} onClick={onToggle}>
          {done ? '✓ 已完成' : '标记完成'}
        </button>
      </div>
    </div>
  );
}
