import { useState } from 'react';
import type { Persona } from '../../types/appTypes';
import {
    Wand2,
    Code,
    FileText,
    Megaphone,
    BookOpen,
    Loader2
} from 'lucide-react';

interface PromptInterfaceProps {
    selectedPersona: Persona | null;
    onGenerate: (contentType: string, prompt: string) => void;
    isLoading: boolean;
}

const contentTypes = [
    { id: 'code', name: 'Code Engine', icon: Code, desc: 'Generate optimized algorithms' },
    { id: 'marketing', name: 'Copywriter', icon: Megaphone, desc: 'High-conversion text' },
    { id: 'documentation', name: 'Technical Docs', icon: FileText, desc: 'API & System definitions' },
    { id: 'creative', name: 'Creative Studio', icon: BookOpen, desc: 'Narrative generation' },
];

export const PromptInterface = ({ selectedPersona, onGenerate, isLoading }: PromptInterfaceProps) => {
    const [selectedType, setSelectedType] = useState('code');
    const [prompt, setPrompt] = useState('');

    if (!selectedPersona) return (
        <div className="text-center p-12 text-secondary border border-dashed border-glass-border rounded-2xl">
            Select a Neural Persona from the left to activate this module.
        </div>
    );

    return (
        <div className="fade-enter h-full flex flex-col">
            <div className="mb-6 grid grid-cols-2 gap-3">
                {contentTypes.map(type => {
                    const Icon = type.icon;
                    const isSel = selectedType === type.id;
                    return (
                        <div
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={`glass-card p-4 cursor-pointer flex items-center gap-3 transition-colors ${isSel ? 'bg-white/10 border-accent' : ''}`}
                        >
                            <div className={`p-2 rounded-lg ${isSel ? 'bg-accent text-black' : 'bg-white/5'}`}>
                                <Icon size={18} />
                            </div>
                            <div>
                                <p className={`font-bold text-sm ${isSel ? 'text-white' : 'text-gray-300'}`}>{type.name}</p>
                                <p className="text-xs text-secondary">{type.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex-1 flex flex-col">
                <textarea
                    className="input-field flex-1 mb-4 min-h-[150px] resize-none"
                    placeholder={`Describe the task for ${selectedPersona.name}...`}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                />

                <button
                    onClick={() => onGenerate(selectedType, prompt)}
                    disabled={!prompt.trim() || isLoading}
                    className="btn-accent w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold disabled:opacity-50"
                >
                    {isLoading ? (
                        <><Loader2 className="animate-spin" /> Processing Request...</>
                    ) : (
                        <><Wand2 size={18} /> Execute Generation</>
                    )}
                </button>
            </div>
        </div>
    );
};
