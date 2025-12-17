import { useState } from 'react';
import type { Persona } from '../../types/appTypes';
import { StorageService } from '../../services/storage';
import {
    Plus,
    Trash2,
    Zap,
    Bot
} from 'lucide-react';

interface PersonaManagerProps {
    personas: Persona[];
    selectedPersona: Persona | null;
    onSelectPersona: (persona: Persona) => void;
    onPersonasChange: () => void;
}

export const PersonaManager = ({
    personas,
    selectedPersona,
    onSelectPersona,
    onPersonasChange
}: PersonaManagerProps) => {
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState<Partial<Persona>>({});

    const handleCreate = () => {
        const newPersona: Persona = {
            id: `p_${Date.now()}`,
            name: formData.name || 'New Persona',
            description: formData.description || 'Custom AI Assistant',
            tone: (formData.tone as any) || 'professional',
            expertiseAreas: [],
            outputPreferences: { length: 'balanced', format: 'structured', style: '' },
            systemPrompt: formData.systemPrompt || '',
            isDefault: false
        };
        StorageService.addPersona(newPersona);
        onPersonasChange();
        setIsCreating(false);
    };

    return (
        <div className="fade-enter">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Neural Personas</h3>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-new glass-card text-sm"
                >
                    <Plus size={16} /> New Identity
                </button>
            </div>

            {isCreating && (
                <div className="glass-panel p-6 rounded-2xl mb-6 animate-float">
                    <input
                        className="input-field mb-4"
                        placeholder="Persona Name"
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    />
                    <textarea
                        className="input-field mb-4"
                        placeholder="System Instructions (You are...)"
                        style={{ minHeight: 100 }}
                        onChange={e => setFormData(p => ({ ...p, systemPrompt: e.target.value }))}
                    />
                    <div className="flex justify-end gap-2">
                        <button onClick={() => setIsCreating(false)} className="btn-glass px-4 py-2 rounded-lg">Cancel</button>
                        <button onClick={handleCreate} className="btn-accent px-4 py-2 rounded-lg">Initialize</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {personas.map(persona => {
                    const isSelected = selectedPersona?.id === persona.id;
                    return (
                        <div
                            key={persona.id}
                            onClick={() => onSelectPersona(persona)}
                            className={`glass-panel p-5 rounded-2xl cursor-pointer relative overflow-hidden group transition-all duration-300 ${isSelected ? 'border-accent' : ''}`}
                            style={{
                                borderColor: isSelected ? 'var(--aurora-2)' : 'var(--glass-border)',
                                transform: isSelected ? 'translateY(-4px)' : 'none',
                                boxShadow: isSelected ? 'var(--glow-md)' : 'none'
                            }}
                        >
                            {isSelected && (
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(45deg, rgba(124, 58, 237, 0.1), transparent)',
                                    pointerEvents: 'none'
                                }} />
                            )}

                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div style={{
                                    width: 48, height: 48,
                                    borderRadius: '12px',
                                    background: isSelected ? 'var(--aurora-2)' : 'rgba(255,255,255,0.05)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Bot size={24} color={isSelected ? 'white' : 'var(--text-secondary)'} />
                                </div>
                                {!persona.isDefault && (
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        StorageService.deletePersona(persona.id);
                                        onPersonasChange();
                                    }} className="text-secondary hover:text-error transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>

                            <h4 className="font-bold text-lg mb-1">{persona.name}</h4>
                            <p className="text-secondary text-sm line-clamp-2 mb-4 h-10">
                                {persona.description}
                            </p>

                            <div className="flex gap-2">
                                <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/5 text-secondary">
                                    {persona.tone}
                                </span>
                                {isSelected && (
                                    <span className="text-xs px-2 py-1 rounded-md bg-aurora-2/20 text-aurora-2 border border-aurora-2/20 flex items-center gap-1">
                                        <Zap size={10} /> Active
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
