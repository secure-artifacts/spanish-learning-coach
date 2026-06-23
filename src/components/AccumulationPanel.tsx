import { speakSpanish } from '../utils/speech';
import { useAccumulation } from '../hooks/useAccumulation';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AccumulationPanel({ open, onClose }: Props) {
  const { items, removeItem, markReviewed, clearAll } = useAccumulation();

  if (!open) return null;

  return (
    <div className="accum-overlay" onClick={onClose} role="presentation">
      <div className="accum-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="积累本">
        <header className="accum-header">
          <h2>📚 我的积累本</h2>
          <span className="accum-count">{items.length} 词条</span>
          <button type="button" className="accum-close" onClick={onClose}>
            ✕
          </button>
        </header>
        <p className="accum-tip">学习各课「词汇积累」时加入的词都会保存在这里。碎片时间翻一翻、听一听。</p>
        {items.length === 0 ? (
          <p className="accum-empty">还没有词条。完成各课的「词汇积累」步骤，点击「全部加入积累本」。</p>
        ) : (
          <ul className="accum-list">
            {[...items].reverse().map((item) => (
              <li key={item.id} className="accum-item">
                <div className="accum-word">
                  <strong>{item.es}</strong>
                  <span>{item.zh}</span>
                  {item.note && <small>{item.note}</small>}
                  {item.source && <small className="accum-source">来自：{item.source}</small>}
                </div>
                <div className="accum-item-actions">
                  <button type="button" className="btn-icon" onClick={() => speakSpanish(item.es)} title="朗读">
                    🔊
                  </button>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => markReviewed(item.id)}>
                    复习 +1 ({item.reviewCount})
                  </button>
                  <button type="button" className="btn-icon" onClick={() => removeItem(item.id)} title="删除">
                    🗑
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <footer className="accum-footer">
          <button type="button" className="btn btn-secondary btn-sm" onClick={clearAll} disabled={!items.length}>
            清空积累本
          </button>
        </footer>
      </div>
    </div>
  );
}
