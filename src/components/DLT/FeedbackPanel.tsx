import type { Question, EvaluationResult, UserAnswer } from '../../types/appTypes';
import {
    Trophy,
    Target,
    CheckCircle,
    AlertCircle,
    RefreshCw,
    BarChart2
} from 'lucide-react';

interface FeedbackPanelProps {
    questions: Question[];
    answers: UserAnswer[];
    evaluation: EvaluationResult;
    onReset: () => void;
}

export const FeedbackPanel = ({ questions, answers, evaluation, onReset }: FeedbackPanelProps) => {
    return (
        <div className="fade-enter">
            {/* Hero Score */}
            <div className="glass-panel p-8 rounded-3xl mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), transparent)',
                    pointerEvents: 'none'
                }} />

                <div className="relative">
                    <svg width="160" height="160" viewBox="0 0 160 160">
                        <circle cx="80" cy="80" r="70" fill="none" stroke="var(--glass-border)" strokeWidth="10" />
                        <circle
                            cx="80" cy="80" r="70" fill="none" stroke="var(--success)" strokeWidth="10"
                            strokeDasharray={440}
                            strokeDashoffset={440 - (440 * evaluation.overallScore) / 100}
                            transform="rotate(-90 80 80)"
                            style={{ transition: 'all 1s ease' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-4xl font-bold">{evaluation.overallScore}%</span>
                        <span className="text-xs text-secondary uppercase tracking-widest">Efficiency</span>
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold mb-2">Analysis Complete</h2>
                    <p className="text-secondary mb-6 max-w-lg">{evaluation.summary}</p>

                    <div className="flex gap-4 flex-wrap justify-center md:justify-start">
                        <div className="glass-card px-4 py-2 flex items-center gap-2">
                            <Trophy size={16} className="text-warning" />
                            <span className="text-sm">Grade: {evaluation.overallScore >= 90 ? 'S' : evaluation.overallScore >= 80 ? 'A' : 'B'}</span>
                        </div>
                        <div className="glass-card px-4 py-2 flex items-center gap-2">
                            <BarChart2 size={16} className="text-accent" />
                            <span className="text-sm">5 Points Analyzed</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl border-l-4 border-success">
                    <h3 className="font-bold flex items-center gap-2 mb-4">
                        <CheckCircle className="text-success" /> Core Strengths
                    </h3>
                    <ul className="space-y-2">
                        {evaluation.strengthAreas.map((s, i) => (
                            <li key={i} className="text-sm text-secondary flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-success mt-1.5" /> {s}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="glass-panel p-6 rounded-2xl border-l-4 border-warning">
                    <h3 className="font-bold flex items-center gap-2 mb-4">
                        <Target className="text-warning" /> Optimization Needed
                    </h3>
                    <ul className="space-y-2">
                        {evaluation.improvementAreas.map((s, i) => (
                            <li key={i} className="text-sm text-secondary flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5" /> {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-6">Detailed Breakdown</h3>
            <div className="space-y-6">
                {evaluation.feedbacks.map((item, idx) => {
                    const question = questions.find(q => q.id === item.questionId);
                    return (
                        <div key={idx} className="glass-panel p-6 rounded-2xl">
                            <div className="flex justify-between mb-4">
                                <span className="text-xs font-mono text-accent">Q{idx + 1}</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${item.isCorrect ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                                    {item.score}% Match
                                </span>
                            </div>
                            <h4 className="font-medium mb-2">{question?.text}</h4>
                            <p className="text-secondary text-sm mb-4">
                                <span className="text-xs uppercase tracking-wider text-aurora-3 block mb-1">Your Answer:</span>
                                {answers.find(a => a.questionId === item.questionId)?.answer}
                            </p>
                            <p className="text-sm text-secondary bg-black/20 p-4 rounded-xl mb-4">
                                {item.feedback}
                            </p>
                            {item.suggestedImprovement && (
                                <div className="flex gap-2 text-sm text-aurora-2">
                                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                    {item.suggestedImprovement}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 text-center">
                <button onClick={onReset} className="btn-accent px-8 py-3 rounded-xl inline-flex items-center gap-2">
                    <RefreshCw size={18} /> Initialize New Session
                </button>
            </div>
        </div>
    );
};
