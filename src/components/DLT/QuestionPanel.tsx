import { useState } from 'react';
import type { Question, UserAnswer } from '../../types/appTypes';
import { ChevronRight, ChevronLeft, Send, Sparkles } from 'lucide-react';

interface QuestionPanelProps {
    questions: Question[];
    documentName: string;
    onSubmit: (answers: UserAnswer[]) => void;
    isLoading: boolean;
}

export const QuestionPanel = ({ questions, documentName, onSubmit, isLoading }: QuestionPanelProps) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
    };

    const handleSubmit = () => {
        const userAnswers: UserAnswer[] = questions.map(q => ({
            questionId: q.id,
            answer: answers[q.id] || '',
        }));
        onSubmit(userAnswers);
    };

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    if (isLoading) {
        return (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', borderRadius: '24px' }}>
                <Sparkles className="animate-pulse-glow mx-auto mb-4" size={48} color="var(--accent)" />
                <h2 className="text-2xl font-bold mb-2">Grading Protocol Active</h2>
                <p className="text-secondary">AI is evaluating your responses against the source material...</p>
            </div>
        );
    }

    return (
        <div className="fade-enter max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <p className="text-secondary text-sm uppercase tracking-wider mb-1">Active Session</p>
                    <h2 className="font-bold text-lg">{documentName}</h2>
                </div>
                <div className="text-right">
                    <p className="text-accent font-mono text-xl">{currentIndex + 1} <span className="text-secondary text-sm">/ {questions.length}</span></p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-glass-border rounded-full mb-8 overflow-hidden">
                <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
            </div>

            {/* Question Card */}
            <div className="glass-panel p-8 rounded-3xl mb-8 relative overflow-hidden">
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
                    background: currentIndex % 2 === 0 ? 'var(--aurora-1)' : 'var(--aurora-3)'
                }} />

                <div className="flex gap-4 mb-6">
                    <span className="px-3 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-widest border border-white/10">
                        {currentQuestion.type}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-secondary border border-white/5">
                        {currentQuestion.difficulty}
                    </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-regular leading-tight mb-8">
                    {currentQuestion.text}
                </h3>

                <textarea
                    className="input-field"
                    placeholder="Enter your analysis here..."
                    value={answers[currentQuestion.id] || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
                    style={{ minHeight: '200px', resize: 'none', fontSize: '1.1rem' }}
                />
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="btn-glass px-6 py-3 rounded-xl disabled:opacity-30"
                >
                    <ChevronLeft size={20} />
                </button>

                {currentIndex === questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        className="btn-accent px-8 py-3 rounded-xl flex items-center gap-2"
                    >
                        Submit for Review <Send size={18} />
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="btn-new glass-card px-8 py-3 flex items-center gap-2 hover:bg-white/10"
                    >
                        Next Question <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};
