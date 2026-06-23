import type { DayPlan, Step, WeekPlan } from '../../types';
import type { CefrLevel, GrammarTopic } from './types';
import { isVerbTopic } from './enrichTopic';
import { HOLA_PLAYLIST_URL, YOUTUBE_MAP, youtubeSearchUrl } from './types';

function videoStep(id: string, topic: GrammarTopic, session: 'micro' | 'deep'): Step {
  const key = topic.videoKey;
  if (key && YOUTUBE_MAP[key]) {
    const v = YOUTUBE_MAP[key];
    return {
      id: `${id}-video`,
      type: 'video',
      session,
      title: `观看：${topic.titleEs}`,
      durationMin: session === 'micro' ? 8 : 15,
      youtubeId: v.id.startsWith('PL') ? undefined : v.id,
      youtubeTitle: v.title,
      instructions: `观看视频，记录：① 本语法点的 2 条核心规则 ② 视频中的 3 个例句。\n\n主题：${topic.title}`,
      url: v.id.startsWith('PL') ? HOLA_PLAYLIST_URL : undefined,
      urlLabel: v.id.startsWith('PL') ? '打开 Hola Spanish 播放列表' : undefined,
    };
  }
  const search = topic.videoSearch ?? `${topic.titleEs} español gramática`;
  return {
    id: `${id}-video`,
    type: 'link',
    session,
    title: `观看：${topic.titleEs}`,
    durationMin: 10,
    url: youtubeSearchUrl(search),
    urlLabel: '在 YouTube 搜索教学视频',
    instructions: `打开 YouTube 搜索「${search}」，选 8–15 分钟的教学视频观看。记 3 个例句。`,
  };
}

function quizStep(id: string, suffix: string, q: GrammarTopic['quiz'], session: 'micro' | 'deep'): Step {
  return {
    id: `${id}-quiz-${suffix}`,
    type: 'quiz',
    session,
    title: suffix === '1' ? '测验' : `加练测验 ${suffix}`,
    durationMin: 5,
    quizQuestion: q.question,
    quizOptions: q.options.map((text, i) => ({ text, correct: i === q.correctIndex })),
    quizExplanation: q.explanation,
  };
}

export function buildGrammarDay(level: CefrLevel, index: number, topic: GrammarTopic): DayPlan {
  const id = `${level.toLowerCase()}-${topic.id}`;
  const steps: Step[] = [
    videoStep(id, topic, 'micro'),
    {
      id: `${id}-read`,
      type: 'read',
      session: 'deep',
      title: '语法规则',
      durationMin: 10,
      instructions: `${topic.rules}\n\n例句（抄写并翻译）：\n${topic.examples.map((e, i) => `${i + 1}. ${e}`).join('\n')}`,
    },
    {
      id: `${id}-vocab`,
      type: 'vocab',
      session: 'micro',
      title: '词汇积累',
      durationMin: 8,
      vocabItems: topic.vocabulary,
      instructions:
        '翻转卡片记忆。点击 🔊 听发音。不熟的词稍后「加入积累本」，碎片时间反复复习。',
    },
    {
      id: `${id}-fillblank`,
      type: 'fillblank',
      session: 'deep',
      title: '填空练习',
      durationMin: 10,
      fillBlanks: topic.fillBlanks,
      instructions: '根据本课语法填入缺失的词。注意动词变位、冠词、代词。',
    },
    {
      id: `${id}-practice`,
      type: 'practice',
      session: 'deep',
      title: '动手练习（6 项）',
      durationMin: 20,
      instructions: '逐项完成，建议计时。完成一项打勾一项。',
      checklist: topic.practiceItems,
    },
    {
      id: `${id}-translate`,
      type: 'translate',
      session: 'deep',
      title: '翻译练习',
      durationMin: 12,
      translationItems: topic.translationDrills,
      instructions: '先独立写西语，再核对参考答案。错误写入错题本。',
    },
    {
      id: `${id}-dictation-1`,
      type: 'dictation',
      session: 'micro',
      title: '听写 ①',
      durationMin: 5,
      dictationText: topic.dictation ?? topic.examples[0] ?? topic.speakPrompt.slice(0, 80),
      dictationHint: topic.titleEs,
      instructions: '播放朗读，写下听到的内容，然后核对答案。',
    },
    ...(topic.extraDictations ?? []).slice(0, 2).map((text, i) => ({
      id: `${id}-dictation-${i + 2}`,
      type: 'dictation' as const,
      session: 'micro' as const,
      title: `听写 ${['②', '③'][i]}`,
      durationMin: 5,
      dictationText: text,
      dictationHint: topic.titleEs,
      instructions: '再听一遍，加深记忆。',
    })),
    {
      id: `${id}-speak-1`,
      type: 'speak',
      session: 'deep',
      title: '口语 ①',
      durationMin: 8,
      speakPrompt: topic.speakPrompt,
      speakHint: topic.speakHint,
      instructions: '录音说出参考内容，或换成你自己的话，但必须用本课语法。',
    },
    ...(topic.extraSpeakPrompts ?? []).slice(0, 2).map((prompt, i) => ({
      id: `${id}-speak-${i + 2}`,
      type: 'speak' as const,
      session: 'deep' as const,
      title: `口语 ${['②', '③'][i]}`,
      durationMin: 8,
      speakPrompt: prompt,
      instructions: '自由发挥，尽量多说几句，不要停超过 3 秒。',
    })),
    quizStep(id, '1', topic.quiz, 'deep'),
    ...(topic.extraQuizzes ?? []).map((q, i) => quizStep(id, String(i + 2), q, i === 0 ? 'micro' : 'deep')),
    {
      id: `${id}-reflect`,
      type: 'reflect',
      session: 'micro',
      title: '错题与积累',
      durationMin: 5,
      instructions:
        '① 本课最容易错的 1 点写进错题本\n② 不熟的 3 个词加入积累本\n③ 用 1 句话总结本课语法\n④ 明天复习时先回顾这 3 项',
    },
  ];

  if (isVerbTopic(topic)) {
    steps.push({
      id: `${id}-conjuguemos`,
      type: 'link',
      session: 'micro',
      title: '变位加练',
      url: 'https://conjuguemos.com',
      urlLabel: 'Conjuguemos 动词变位',
      instructions: `打开 Conjuguemos，选择与本课「${topic.title}」对应的时态/语气，练习 10 分钟。`,
    });
  }

  return {
    id,
    dayLabel: `${level}-${String(index + 1).padStart(2, '0')}`,
    title: topic.title,
    goal: topic.goal,
    steps,
  };
}

export function buildReviewDay(level: CefrLevel, weekNum: number, topics: GrammarTopic[]): DayPlan {
  const id = `${level.toLowerCase()}-review-w${weekNum}`;
  const allVocab = topics.flatMap((t) => t.vocabulary ?? []).slice(0, 15);

  return {
    id,
    dayLabel: `${level} 复习 W${weekNum}`,
    title: `${level} 第 ${weekNum} 周复习`,
    goal: `巩固本周 ${topics.length} 个语法点，大量练习`,
    steps: [
      {
        id: `${id}-list`,
        type: 'read',
        session: 'deep',
        title: '本周语法清单',
        durationMin: 10,
        instructions: `每个语法点用 1 句话总结规则：\n${topics.map((t, i) => `${i + 1}. ${t.title} (${t.titleEs})`).join('\n')}`,
      },
      {
        id: `${id}-vocab`,
        type: 'vocab',
        session: 'micro',
        title: '本周词汇总复习',
        durationMin: 10,
        vocabItems: allVocab,
        instructions: '复习本周全部词汇，全部加入积累本。',
      },
      {
        id: `${id}-quiz-batch`,
        type: 'practice',
        session: 'deep',
        title: '测验重做',
        durationMin: 25,
        instructions: `重做错题：回到本周 ${topics.length} 课，重做所有「测验」和「加练测验」。`,
        checklist: topics.map((t) => `重做：${t.title}`),
      },
      {
        id: `${id}-speak`,
        type: 'speak',
        session: 'deep',
        title: '综合口语 5 分钟',
        durationMin: 10,
        instructions: '计时 5 分钟不间断，必须用到至少 3 个本周语法点。',
        speakPrompt: `（涵盖：${topics.map((t) => t.titleEs).join('、')}）`,
      },
      {
        id: `${id}-dictation`,
        type: 'dictation',
        session: 'micro',
        title: '综合听写',
        durationMin: 8,
        dictationText: topics.map((t) => t.examples[0]).filter(Boolean).join(' ').slice(0, 120),
        instructions: '听写本周例句组合，难度较高，可重复播放。',
      },
      {
        id: `${id}-link`,
        type: 'link',
        session: 'micro',
        title: '在线加练',
        url: 'https://conjuguemos.com',
        urlLabel: 'Conjuguemos',
        instructions: '补充练习 15 分钟。',
      },
    ],
  };
}

const DAYS_PER_WEEK = 6;
const TOPICS_BEFORE_REVIEW = 5;

export function groupIntoWeeks(
  level: CefrLevel,
  items: { day: DayPlan; topic: GrammarTopic }[],
  startWeekNum: number,
): WeekPlan[] {
  const weeks: WeekPlan[] = [];
  let weekNum = startWeekNum;
  let i = 0;

  while (i < items.length) {
    const chunk = items.slice(i, i + TOPICS_BEFORE_REVIEW);
    const weekDays = chunk.map((c) => c.day);
    if (chunk.length > 0) {
      weekDays.push(
        buildReviewDay(
          level,
          weekNum - startWeekNum + 1,
          chunk.map((c) => c.topic),
        ),
      );
    }
    weeks.push({
      id: `${level.toLowerCase()}-w${weekNum}`,
      weekNum,
      title: `${level} · ${chunk[0]?.topic.title ?? ''}${chunk.length > 1 ? ` → ${chunk[chunk.length - 1]?.topic.title}` : ''}`,
      focus: chunk.map((c) => c.topic.title).join(' · '),
      days: weekDays.slice(0, DAYS_PER_WEEK + 1),
    });
    i += TOPICS_BEFORE_REVIEW;
    weekNum++;
  }
  return weeks;
}
