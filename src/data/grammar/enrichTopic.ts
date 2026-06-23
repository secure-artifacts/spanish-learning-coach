import type { CefrLevel, GrammarTopic } from './types';
import { pickVocabForUnit, TOPIC_VOCAB, type VocabEntry } from './vocabBank';

function pickWordsFromExamples(examples: string[]): string[] {
  return examples
    .flatMap((e) => e.replace(/[¿?¡!.,]/g, '').split(/\s+/))
    .filter((w) => w.length > 3 && /^[A-Za-zÁÉÍÓÚáéíóúÑñü]+$/.test(w))
    .slice(0, 5);
}

function makeFillBlanksFromExamples(examples: string[]): { prompt: string; answer: string }[] {
  return examples.slice(0, 3).map((ex) => {
    const words = ex.split(/\s+/);
    if (words.length < 3) return { prompt: ex.replace(/\S+/, '______'), answer: words[0] ?? '' };
    const idx = Math.min(1, words.length - 2);
    const answer = words[idx].replace(/[.,!?¿¡]/g, '');
    const prompt = words.map((w, i) => (i === idx ? '______' : w)).join(' ');
    return { prompt, answer };
  });
}

function makeExtraDictations(topic: GrammarTopic): string[] {
  const fromExamples = topic.examples.filter((e) => e.length < 80).slice(0, 2);
  const fromSpeak = topic.speakPrompt
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10 && s.length < 100)
    .slice(0, 2);
  return [...new Set([...fromExamples, ...fromSpeak, ...(topic.extraDictations ?? [])])].slice(0, 3);
}

function makeTranslationDrills(topic: GrammarTopic): { zh: string; es: string }[] {
  const base = topic.translationDrills ?? [];
  const fromExamples = topic.examples.slice(0, 2).map((es, i) => ({
    zh: `请用本课语法翻译例句 ${i + 1} 的含义（对照西语例句）`,
    es,
  }));
  return [...base, ...fromExamples].slice(0, 4);
}

function makeExtraQuizzes(topic: GrammarTopic): GrammarTopic['extraQuizzes'] {
  const extras = topic.extraQuizzes ?? [];
  if (extras.length >= 2) return extras;

  const wrong1 = topic.quiz.options.find((_, i) => i !== topic.quiz.correctIndex) ?? '错误选项';
  const generated = [
    {
      question: `改错：找出更地道的表达（${topic.titleEs}）`,
      options: [
        topic.quiz.options[topic.quiz.correctIndex],
        wrong1,
        topic.quiz.options[(topic.quiz.correctIndex + 2) % topic.quiz.options.length] ?? wrong1,
      ],
      correctIndex: 0,
      explanation: topic.quiz.explanation,
    },
    {
      question: `以下哪句正确使用了「${topic.title}」？`,
      options: [
        topic.examples[0] ?? topic.quiz.options[topic.quiz.correctIndex],
        topic.examples[1] ?? wrong1,
        wrong1,
      ],
      correctIndex: 0,
    },
  ];
  return [...extras, ...generated].slice(0, 3);
}

function makeExtraSpeak(topic: GrammarTopic): string[] {
  const prompts = [
    topic.speakPrompt,
    ...(topic.extraSpeakPrompts ?? []),
    `用「${topic.titleEs}」描述你今天做的一件事（至少 4 句）。`,
    `想象你在和语伴聊天，用本课语法问 3 个问题。`,
  ];
  return [...new Set(prompts)].slice(0, 3);
}

function makePracticeItems(topic: GrammarTopic): string[] {
  const base = topic.practiceItems ?? [];
  const generated = [
    `变位/转换快练：针对「${topic.titleEs}」写 10 个不同主语（yo/tú/él/nosotros）的句子`,
    `错题本：把本课例句改写成否定句或疑问句各 2 句`,
    `影子跟读：对每条例句朗读 3 遍，录音对比`,
    `造句挑战：用本语法写 1 句关于工作、1 句关于家庭、1 句关于旅行`,
    `中→西：不看答案，先写再核对例句`,
  ];
  return [...new Set([...base, ...generated])].slice(0, 6);
}

export function enrichTopic(level: CefrLevel, unitIndex: number, topic: GrammarTopic): GrammarTopic {
  const topicVocab = TOPIC_VOCAB[topic.id] ?? [];
  const levelVocab = pickVocabForUnit(level, unitIndex, 6);
  const vocabulary: VocabEntry[] = [
    ...topicVocab,
    ...levelVocab.filter((v) => !topicVocab.some((t) => t.es === v.es)),
  ].slice(0, 10);

  const keyWords = pickWordsFromExamples(topic.examples);
  vocabulary.push(
    ...keyWords.slice(0, 3).map((es) => ({ es, zh: '（本课例句词汇）', note: '见例句' })),
  );

  return {
    ...topic,
    vocabulary,
    extraQuizzes: makeExtraQuizzes(topic),
    extraDictations: makeExtraDictations(topic),
    extraSpeakPrompts: makeExtraSpeak(topic).slice(1),
    fillBlanks: topic.fillBlanks?.length
      ? topic.fillBlanks
      : makeFillBlanksFromExamples(topic.examples),
    translationDrills: makeTranslationDrills(topic),
    practiceItems: makePracticeItems(topic),
  };
}

export function isVerbTopic(topic: GrammarTopic): boolean {
  const keys = ['时', '动词', '变位', 'pretérito', 'subjuntivo', 'imperativo', 'condicional', 'futuro', '虚拟', '过去', '命令'];
  const text = `${topic.title} ${topic.titleEs} ${topic.id}`;
  return keys.some((k) => text.toLowerCase().includes(k.toLowerCase()));
}
