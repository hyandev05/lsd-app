import { useState, useCallback, useEffect, useRef } from 'react'
import {
    FileText, Play, X, Check, AlertCircle,
    ArrowLeft, LayoutGrid,
} from 'lucide-react'

import rawData0 from '@asset/data.json'
import rawData1 from '@asset/data1.json'
import rawData2 from '@asset/data2.json'
import rawData3 from '@asset/data3.json'
import rawData4 from '@asset/data4.json'
import rawData5 from '@asset/data5.json'
import rawData6 from '@asset/data6.json'
import rawData7 from '@asset/data7.json'
import rawData8 from '@asset/data8.json'

interface Question {
    question: string
    selection: string[]
    answer: string | null
}

type Phase = 'idle' | 'confirming' | 'quiz' | 'result'

const ALL_DATA: Question[][] = [
    rawData0 as Question[], rawData1 as Question[], rawData2 as Question[],
    rawData3 as Question[], rawData4 as Question[], rawData5 as Question[],
    rawData6 as Question[], rawData7 as Question[], rawData8 as Question[],
]

const QUIZ_LABELS = ['A', 'B', 'C', 'D'] as const

function shuffle<T>(arr: T[]): T[] {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
}

interface ShuffledQ extends Question {
    shuffledId: number
    shuffledSelection: string[]
}

export default function User() {
    const [activeTab, setActiveTab] = useState(0)
    const [phase, setPhase] = useState<Phase>('idle')
    const [currentQuestions, setCurrentQuestions] = useState<ShuffledQ[]>([])
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({})
    const [showWrongOnly, setShowWrongOnly] = useState(false)
    const [showNavigator, setShowNavigator] = useState(false)
    const quizRef = useRef<HTMLDivElement>(null)

    const startQuiz = useCallback(() => {
        const raw = ALL_DATA[activeTab]
        const shuffled = shuffle(raw).map((q, i) => ({
            ...q,
            shuffledId: i,
            shuffledSelection: q.selection ? shuffle([...q.selection]) : [],
        }))
        setCurrentQuestions(shuffled)
        setUserAnswers({})
        setShowWrongOnly(false)
        setPhase('quiz')

        try {
            document.documentElement.requestFullscreen?.()
        } catch {
            /* fallback: CSS fixed overlay */
        }
    }, [activeTab])

    const submitQuiz = useCallback(() => {
        try {
            document.exitFullscreen?.()
        } catch {
            /* ignore */
        }
        setPhase('result')
    }, [])

    const handleFullscreenChange = useCallback(() => {
        if (!document.fullscreenElement && phase === 'quiz') {
            // user pressed Escape — keep quiz state; they see the overlay
        }
    }, [phase])

    useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () =>
            document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [handleFullscreenChange])

    const answeredCount = Object.keys(userAnswers).length
    const totalQuestions = currentQuestions.length
    const correctCount = currentQuestions.filter(
        q => userAnswers[q.shuffledId] === q.answer,
    ).length
    const score = totalQuestions > 0
        ? Math.round((correctCount / totalQuestions) * 10)
        : 0

    const wrongQuestions = currentQuestions.filter(
        q =>
            userAnswers[q.shuffledId] &&
            userAnswers[q.shuffledId] !== q.answer,
    )

    const displayQuestions = showWrongOnly
        ? wrongQuestions
        : currentQuestions.filter(q => userAnswers[q.shuffledId] !== undefined)

    const selectAnswer = (qId: number, answer: string) => {
        setUserAnswers(prev => ({ ...prev, [qId]: answer }))
    }

    const focusQuestion = useCallback((idx: number) => {
        setShowNavigator(false)
        setTimeout(() => {
            const el = document.getElementById(`q-${idx}`)
            el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 50)
    }, [])

    const goBackToIdle = () => {
        try {
            document.exitFullscreen?.()
        } catch {
            /* ignore */
        }
        setPhase('idle')
        setCurrentQuestions([])
        setUserAnswers({})
    }

    /* -------------------------------------------------- */
    /*  RENDER                                            */
    /* -------------------------------------------------- */
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#EFEFF2] via-[#F2F1F5] to-[#C9C0EA] relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-[#A79BDD] to-transparent opacity-30 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* ========== HEADER ========== */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-full bg-[#141414] flex items-center justify-center shadow-lg">
                        <FileText size={18} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-[22px] font-bold text-[#17171B] tracking-tight">
                            Bài kiểm tra
                        </h1>
                        <p className="text-[13px] text-[#8B8B92]">
                            Lịch sử Đảng Cộng sản Việt Nam
                        </p>
                    </div>
                </div>

                {/* ========== TAB SELECT ========== */}
                {phase !== 'quiz' && (
                    <div className="mb-6">
                        <div className="bg-[#141414] rounded-[20px] p-4 sm:p-5 shadow-lg">
                            <label className="text-[11px] font-bold text-[#CFF23A] uppercase tracking-wider mb-2 block">
                                Chọn bài kiểm tra
                            </label>
                            <div className="relative">
                                <select
                                    value={activeTab}
                                    onChange={e => { setActiveTab(Number(e.target.value)); setPhase('idle') }}
                                    className="w-full bg-[#1C1C1F] text-white text-[14px] font-semibold px-4 py-3 rounded-[14px] border border-white/10 outline-none appearance-none cursor-pointer"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23CFF23A' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                                        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center', paddingRight: '40px',
                                    }}
                                >
                                    {ALL_DATA.map((_, i) => (
                                        <option key={i} value={i}>
                                            Bài kiểm tra thứ {i + 1} — {ALL_DATA[i]?.length || 0} câu
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== IDLE PHASE ========== */}
                {phase === 'idle' && (
                    <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-6 sm:p-8 shadow-[0_20px_40px_rgba(20,20,30,0.06)] border border-white/40 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 rounded-full bg-[#141414] flex items-center justify-center mx-auto mb-4">
                            <FileText size={28} className="text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-[#17171B] mb-2">
                            Bài kiểm tra thứ {activeTab + 1}
                        </h2>
                        <p className="text-[14px] text-[#8B8B92] mb-1">
                            {ALL_DATA[activeTab]?.length || 0} câu hỏi trắc nghiệm
                        </p>
                        <p className="text-[12px] text-[#8B8B92] mb-6">
                            Thời gian: tự do &#x2022; Làm lại được nhiều lần
                        </p>
                        <button
                            onClick={() => setPhase('confirming')}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141414] text-white text-[14px] font-semibold hover:opacity-90 transition-all shadow-md"
                        >
                            <Play size={16} /> Làm bài
                        </button>
                    </div>
                )}

                {/* ========== CONFIRM DIALOG ========== */}
                {phase === 'confirming' && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
                        onClick={() => setPhase('idle')}
                    >
                        <div
                            className="bg-white rounded-[20px] p-6 sm:p-8 max-w-sm w-[90%] shadow-2xl border border-white/40"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-lg font-bold text-[#17171B] mb-2">
                                Bắt đầu làm bài?
                            </h3>
                            <p className="text-[14px] text-[#8B8B92] mb-6">
                                Bài kiểm tra thứ {activeTab + 1} —{' '}
                                {ALL_DATA[activeTab]?.length || 0} câu hỏi trắc nghiệm.
                                Câu hỏi và đáp án sẽ được xáo trộn ngẫu nhiên.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setPhase('idle')}
                                    className="px-5 py-2.5 rounded-full bg-[#E4E4E8] text-[#17171B] text-[13px] font-semibold hover:opacity-80 transition-all"
                                >
                                    Huỷ
                                </button>
                                <button
                                    onClick={() => {
                                        setPhase('idle')
                                        setTimeout(startQuiz, 50)
                                    }}
                                    className="px-5 py-2.5 rounded-full bg-[#141414] text-white text-[13px] font-semibold hover:opacity-90 transition-all shadow-md"
                                >
                                    Đồng ý
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== QUIZ FULLSCREEN ========== */}
                {phase === 'quiz' && (
                    <div
                        ref={quizRef}
                        className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#EFEFF2] via-[#F2F1F5] to-[#C9C0EA] overflow-y-auto"
                    >
                        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
                            {/* Quiz header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-[13px] font-semibold text-[#17171B]">
                                        Bài kiểm tra thứ {activeTab + 1}
                                    </span>
                                    <span className="text-[12px] text-[#8B8B92] bg-[#E4E4E8] px-2.5 py-1 rounded-full">
                                        {answeredCount}/{totalQuestions}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={goBackToIdle}
                                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E4E4E8] text-[#8B8B92] text-[13px] font-semibold hover:text-[#17171B] transition-all"
                                    >
                                        <X size={14} /> Thoát
                                    </button>
                                    <button
                                        onClick={submitQuiz}
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#141414] text-white text-[13px] font-semibold hover:opacity-90 transition-all shadow-md"
                                    >
                                        <Check size={16} /> Nộp bài
                                    </button>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full h-1.5 bg-[#E4E4E8] rounded-full mb-6 overflow-hidden">
                                <div
                                    className="h-full bg-[#CFF23A] rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(answeredCount / totalQuestions) * 100}%`,
                                    }}
                                />
                            </div>

                            {/* Questions */}
                            <div className="space-y-4">
                                {currentQuestions.map((q, idx) => (
                                    <div
                                        key={q.shuffledId}
                                        id={`q-${idx}`}
                                        className={`bg-white/80 backdrop-blur-xl rounded-[20px] p-5 sm:p-6 shadow-[0_20px_40px_rgba(20,20,30,0.06)] border border-white/40 ${userAnswers[q.shuffledId]
                                            ? 'ring-1 ring-[#CFF23A]/40'
                                            : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3 mb-4">
                                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#141414] text-white text-[12px] font-bold flex items-center justify-center">
                                                {idx + 1}
                                            </span>
                                            <p className="text-[14px] font-semibold text-[#17171B] leading-relaxed">
                                                {q.question}
                                            </p>
                                        </div>

                                        <div className="space-y-2 ml-0 sm:ml-11">
                                            {q.shuffledSelection.map((opt, optIdx) => (
                                                <button
                                                    key={optIdx}
                                                    onClick={() => selectAnswer(q.shuffledId, opt)}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] transition-all text-left ${userAnswers[q.shuffledId] === opt
                                                        ? 'bg-[#CFF23A]/15 border border-[#CFF23A]/30'
                                                        : 'hover:bg-[#FAFAFC] border border-transparent'
                                                        }`}
                                                >
                                                    <div
                                                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${userAnswers[q.shuffledId] === opt
                                                            ? 'border-[#CFF23A] bg-[#CFF23A]'
                                                            : 'border-[#DADADE]'
                                                            }`}
                                                    >
                                                        {userAnswers[q.shuffledId] === opt && (
                                                            <div className="w-2 h-2 rounded-full bg-[#141414]" />
                                                        )}
                                                    </div>
                                                    <span
                                                        className={`text-[12px] font-bold flex-shrink-0 w-5 text-center ${userAnswers[q.shuffledId] === opt
                                                            ? 'text-[#141414]'
                                                            : 'text-[#8B8B92]'
                                                            }`}
                                                    >
                                                        {QUIZ_LABELS[optIdx]}
                                                    </span>
                                                    <span
                                                        className={`text-[13px] ${userAnswers[q.shuffledId] === opt
                                                            ? 'text-[#17171B] font-medium'
                                                            : 'text-[#17171B]/70'
                                                            }`}
                                                    >
                                                        {opt}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bottom submit */}
                            <div className="sticky bottom-0 mt-6 pb-4 flex items-center justify-center gap-3">
                                <button
                                    onClick={() => setShowNavigator(true)}
                                    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/90 backdrop-blur-xl border border-white/40 text-[#8B8B92] hover:text-[#17171B] transition-all shadow-md"
                                    title="Danh sách câu hỏi"
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={submitQuiz}
                                    className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#141414] text-white text-[14px] font-semibold hover:opacity-90 transition-all shadow-lg"
                                >
                                    <Check size={18} /> Nộp bài
                                </button>
                            </div>
                        </div>

                        {/* ========== QUESTION NAVIGATOR ========== */}
                        {showNavigator && (
                            <div
                                className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/20 backdrop-blur-sm"
                                onClick={() => setShowNavigator(false)}
                            >
                                <div
                                    className="bg-white rounded-[20px] p-5 sm:p-6 shadow-2xl border border-white/40 max-w-sm w-[92%]"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[14px] font-bold text-[#17171B]">
                                            Danh sách câu hỏi
                                        </span>
                                        <button
                                            onClick={() => setShowNavigator(false)}
                                            className="w-8 h-8 rounded-full bg-[#E4E4E8] flex items-center justify-center hover:opacity-80 transition-all"
                                        >
                                            <X size={14} className="text-[#8B8B92]" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        {currentQuestions.map((q, idx) => {
                                            const hasAnswer = userAnswers[q.shuffledId] !== undefined
                                            return (
                                                <button
                                                    key={q.shuffledId}
                                                    onClick={() => focusQuestion(idx)}
                                                    className={`w-full aspect-square rounded-[12px] flex items-center justify-center text-[12px] font-bold transition-all ${
                                                        hasAnswer
                                                            ? 'bg-[#CFF23A]/20 text-[#141414] border border-[#CFF23A]/30'
                                                            : 'bg-[#E4E4E8] text-[#8B8B92] hover:bg-[#DADADE]'
                                                    }`}
                                                >
                                                    {idx + 1}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                )}

                {/* ========== RESULT PHASE ========== */}
                {phase === 'result' && (
                    <div className="space-y-4">
                        {/* Score card */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-[20px] p-6 sm:p-8 shadow-[0_20px_40px_rgba(20,20,30,0.06)] border border-white/40 text-center">
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        fill="none"
                                        stroke="#E4E4E8"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        fill="none"
                                        stroke="#CFF23A"
                                        strokeWidth="8"
                                        strokeDasharray={`${2 * Math.PI * 42}`}
                                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - correctCount / totalQuestions)
                                            }`}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-[#17171B]">
                                        {score}
                                    </span>
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-[#17171B] mb-1">
                                {score}/10
                            </h2>
                            <p className="text-[14px] text-[#8B8B92] mb-4">
                                Đúng {correctCount}/{totalQuestions} câu
                            </p>

                            {wrongQuestions.length > 0 && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 border border-red-200/50 text-[12px] text-red-600 font-medium">
                                    <AlertCircle size={13} /> {wrongQuestions.length} câu sai
                                </div>
                            )}
                        </div>

                        {/* Filter + back */}
                        <div className="flex items-center gap-3 flex-wrap">
                            <button
                                onClick={() => setShowWrongOnly(false)}
                                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${!showWrongOnly
                                    ? 'bg-[#141414] text-white shadow-md'
                                    : 'bg-[#E4E4E8] text-[#8B8B92]'
                                    }`}
                            >
                                Tất cả
                            </button>
                            <button
                                onClick={() => setShowWrongOnly(true)}
                                className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${showWrongOnly
                                    ? 'bg-[#141414] text-white shadow-md'
                                    : 'bg-[#E4E4E8] text-[#8B8B92]'
                                    }`}
                            >
                                Chỉ câu sai
                            </button>
                            <button
                                onClick={goBackToIdle}
                                className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#E4E4E8] text-[#8B8B92] text-[13px] font-semibold hover:text-[#17171B] transition-all"
                            >
                                <ArrowLeft size={14} /> Làm lại
                            </button>
                        </div>

                        {/* Review cards */}
                        <div className="space-y-3">
                            {displayQuestions.map(q => {
                                const userAns = userAnswers[q.shuffledId]
                                const isCorrect = userAns === q.answer
                                return (
                                    <div
                                        key={q.shuffledId}
                                        className={`bg-white/80 backdrop-blur-xl rounded-[20px] p-5 sm:p-6 shadow-[0_20px_40px_rgba(20,20,30,0.06)] border ${isCorrect
                                            ? 'border-[#CFF23A]/30'
                                            : 'border-red-200/50 bg-red-50/40'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3 mb-3">
                                            <span
                                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold ${isCorrect
                                                    ? 'bg-[#CFF23A] text-[#141414]'
                                                    : 'bg-red-100 text-red-600'
                                                    }`}
                                            >
                                                {isCorrect ? <Check size={14} /> : <X size={14} />}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[14px] font-semibold text-[#17171B] leading-relaxed mb-3">
                                                    {q.question}
                                                </p>

                                                {/* Options */}
                                                <div className="space-y-1.5">
                                                    {q.shuffledSelection.map((opt, optIdx) => {
                                                        const isUserAns = userAns === opt
                                                        const isCorrectAns = q.answer === opt
                                                        return (
                                                            <div
                                                                key={optIdx}
                                                                className={`flex items-center gap-3 px-4 py-2.5 rounded-[14px] ${isCorrectAns && isUserAns
                                                                    ? 'bg-[#CFF23A]/15 border border-[#CFF23A]/30'
                                                                    : isCorrectAns
                                                                        ? 'bg-[#CFF23A]/15 border border-[#CFF23A]/30'
                                                                        : isUserAns
                                                                            ? 'bg-red-50 border border-red-200/50'
                                                                            : 'border border-transparent'
                                                                    }`}
                                                            >
                                                                <div
                                                                    className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${isCorrectAns
                                                                        ? 'border-[#CFF23A] bg-[#CFF23A]'
                                                                        : isUserAns
                                                                            ? 'border-red-300 bg-red-100'
                                                                            : 'border-[#DADADE]'
                                                                        }`}
                                                                >
                                                                    {isCorrectAns && (
                                                                        <Check
                                                                            size={12}
                                                                            className="text-[#141414]"
                                                                        />
                                                                    )}
                                                                    {isUserAns && !isCorrectAns && (
                                                                        <X size={12} className="text-red-500" />
                                                                    )}
                                                                </div>
                                                                <span
                                                                    className={`text-[12px] font-bold w-5 flex-shrink-0 ${isCorrectAns
                                                                        ? 'text-[#141414]'
                                                                        : isUserAns
                                                                            ? 'text-red-600'
                                                                            : 'text-[#8B8B92]'
                                                                        }`}
                                                                >
                                                                    {QUIZ_LABELS[optIdx]}
                                                                </span>
                                                                <span
                                                                    className={`text-[13px] flex-1 ${isCorrectAns
                                                                        ? 'text-[#17171B] font-medium'
                                                                        : 'text-[#17171B]/70'
                                                                        }`}
                                                                >
                                                                    {opt}
                                                                </span>
                                                                {isCorrectAns && (
                                                                    <span className="text-[10px] font-bold text-[#CFF23A] bg-[#141414] px-2 py-0.5 rounded-full flex-shrink-0">
                                                                        Đáp án
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </div>

                                                {/* Wrong answer correction line */}
                                                {!isCorrect && q.answer && (
                                                    <div className="mt-3 flex items-center gap-1.5 text-[12px] text-[#CFF23A] bg-[#141414] px-3 py-1.5 rounded-full w-fit">
                                                        <Check size={12} /> Đáp án đúng: {q.answer}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
