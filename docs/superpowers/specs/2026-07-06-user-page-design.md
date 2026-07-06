# User Page — Exam-Taking UI

## Overview

Transform the stub `src/pages/user.tsx` into a full-featured exam-taking interface for students. The page provides 8 tabbed question sets (data1.json–data8.json), a fullscreen quiz mode, auto-grading, and a review panel with wrong-answer filtering.

Route: `/admin2` → User component (change from Admin in App.tsx).  
Data: imported directly from `@asset/data1.json`–`@asset/data8.json` (no API calls).

---

## UX Flow

```
[idle] → [confirm dialog] → [quiz (fullscreen)] → [result + review]
```

| Phase | Description |
|---|---|
| idle | 8 tabs visible, quiz info card shown, "Làm bài" button |
| confirming | Modal dialog: "Bắt đầu bài kiểm tra thứ X?" with [Huỷ] [Đồng ý] |
| quiz | `document.documentElement.requestFullscreen()`, 40 shuffled questions |
| result | Auto-graded score /10, review cards, filter toggle wrong-only |

---

## Component Tree

```
UserPage
├── Header              — gradient bg, title "Bài kiểm tra", subtitle
├── TabBar              — 8 pill tabs "Bài kiểm tra thứ i" (i=1..8)
├── QuizInfoCard        — shows when no test active: 40 questions, "Làm bài" button
├── ConfirmDialog       — overlay modal, confirm/cancel
├── QuizFullscreen      — shown during fullscreen quiz
│   ├── ProgressBar     — "Đã làm X/40"
│   ├── QuestionCard[]  — 40 cards, scroll
│   │   ├── question text
│   │   └── option A B C D (labels fixed, content shuffled)
│   └── SubmitButton    — fixed bottom, "Nộp bài"
└── ResultView
    ├── ScoreCard        — score /10, circular progress indicator
    ├── FilterToggle     — [Tất cả] [Chỉ câu sai] pills
    └── ReviewCard[]     — one per question
        ├── correct     → green highlight
        └── wrong       → red highlight + "Đáp án đúng: …" below
```

---

## Data Flow

### Imports
```typescript
import rawData1 from '@asset/data1.json'
import rawData2 from '@asset/data2.json'
// … through data8.json

const ALL_DATA = [rawData1, rawData2, …, rawData8]
```

### Question interface (same as admin)
```typescript
interface Question {
  question: string
  selection: string[]   // 4 options
  answer: string | null
}
```

### Core state
```typescript
type Phase = 'idle' | 'confirming' | 'quiz' | 'result'

const [activeTab, setActiveTab] = useState(0)          // 0–7
const [phase, setPhase] = useState<Phase>('idle')
const [currentQuestions, setCurrentQuestions] = useState<ShuffledQ[]>([])
const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
const [showWrongOnly, setShowWrongOnly] = useState(false)
```

### Shuffle algorithm (Fisher-Yates)

**Question order**: Shuffle the array of 40 questions on mount of quiz phase.  
**Option order**: For each question, shuffle the 4 answer strings. **Do NOT shuffle the 4 views (A/B/C/D)** — they remain in DOM-order: the 0th shuffled item renders as A, 1st as B, etc.

```typescript
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
```

### Grading
```typescript
const score = currentQuestions.filter(
  q => userAnswers[q.shuffledId] === q.answer
).length
const scaledScore = Math.round((score / currentQuestions.length) * 10)
```

---

## Fullscreen Behavior

1. User clicks "Đồng ý" on confirm dialog.
2. Call `document.documentElement.requestFullscreen()`.  
   On mobile (iOS Safari), Fullscreen API may not be supported — fall back to a div that covers `100dvh × 100vw` with `position: fixed; inset: 0; z-index: 9999`.
3. On fullscreenchange / fullscreenerror / Escape key: exit quiz and return to idle phase.
4. "Nộp bài" button calls `document.exitFullscreen()` and transitions to result phase.

---

## Result View

### Score card
- Large centered score number (e.g. "7") with "/10" subtitle.
- Circular SVG progress ring in lime accent (`#CFF23A`).
- Summary text: "Đúng X/40 câu".

### Review cards
Each question rendered in a white floating card:
- **Correct**: lime-green left border / highlight, option selected shown with checkmark.
- **Wrong**: red-tinted background on the wrong answer, text "Đáp án đúng: …" displayed below the options in a lime badge.
- Every option is **read-only** (no interaction).

### Wrong-only filter
Two pills next to score card: [Tất cả] [Chỉ câu sai].  
Active pill uses dark background `#141414`, inactive uses gray `#E4E4E8`.

---

## Design System Mapping

Use exact tokens from `dashboard-vibe-design-system.md`:

| Element | DS Token |
|---|---|
| Page bg | `bg-gradient-to-br from-[#EFEFF2] via-[#F2F1F5] to-[#C9C0EA]` |
| Gradient glow | `.absolute` div `bg-gradient-to-tr from-[#A79BDD] to-transparent opacity-30 blur-3xl` |
| Card | `bg-white/80 backdrop-blur-xl rounded-[20px] shadow-[0_20px_40px_rgba(20,20,30,0.06)] border border-white/40` |
| Tab active | `bg-[#141414] text-white rounded-full px-5 py-2 text-[13px] font-semibold` |
| Tab inactive | `bg-[#E4E4E8] text-[#8B8B92] rounded-full px-5 py-2 text-[13px] font-semibold` |
| Primary button | `bg-[#141414] text-white rounded-full px-5 py-2.5 text-[13px] font-semibold shadow-md` |
| Correct answer | `bg-[#CFF23A]/15 border border-[#CFF23A]/30` + checkmark circle `bg-[#CFF23A]` |
| Wrong answer | `bg-red-50/80 border border-red-200/50` |
| Correct label badge | `bg-[#CFF23A] text-[#141414] text-[11px] font-bold px-2.5 py-1 rounded-full` |
| Icon chip | `w-8 h-8 rounded-full bg-[#141414] flex items-center justify-center` |
| Muted text | `text-[#8B8B92] text-[13px]` |
| Font | Plus Jakarta Sans (already set in index.css) |

---

## Mobile Responsiveness

| Breakpoint | Behavior |
|---|---|
| < 640px | Tab bar: horizontal scroll + snap. Cards: full width. Padding 16px. Score card compact. |
| 640–1024px | 2-column bento layout, tabs wrap. |
| > 1024px | Centered max-w-4xl, standard spacing. |

Quiz fullscreen on mobile: larger touch targets (min 44px), option text wraps naturally, submit button `w-full`.

---

## Files Changed

1. `src/pages/user.tsx` — full rewrite (~400–500 lines)
2. `src/App.tsx` — change `/admin2` route from `<Admin />` to `<User />`

---

## Boundaries & Constraints

- **No external API**: Data imported as static JSON modules.
- **No state persistence**: Answers lost on page refresh (acceptable for a quiz tool).
- **Fullscreen API**: Falls back to CSS full-viewport overlay on unsupported browsers.
- **Submission is final**: Once "Nộp bài" is clicked, answers cannot be changed.
- **A B C D labels never shuffle** — only the content behind them does.
