import { useState } from 'react';
import { Key, Sparkles, Loader2 } from 'lucide-react';
import { validateApiKey } from '../../services/gemini';
import { StorageService } from '../../services/storage';

interface ApiKeyModalProps {
    onKeySet: (key: string) => void;
}

export const ApiKeyModal = ({ onKeySet }: ApiKeyModalProps) => {
    const [apiKey, setApiKey] = useState('');
    const [isValidating, setIsValidating] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey.trim()) return;
        setIsValidating(true);
        const result = await validateApiKey(apiKey.trim());
        if (result === true) {
            StorageService.setApiKey(apiKey.trim());
            onKeySet(apiKey.trim());
        } else {
            alert(`Validation Failed: ${result}`);
        }
        setIsValidating(false);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div className="glass-panel p-8 rounded-3xl max-w-md w-full m-4 animate-float">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-aurora-1 to-aurora-2 flex items-center justify-center">
                        <Sparkles className="text-white" size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Initialize System</h2>
                </div>

                <p className="text-secondary mb-6">
                    Enter your Gemini API key to unlock the neural capabilities of GeminiMind.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="relative mb-6">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                        <input
                            type="password"
                            className="input-field pl-10"
                            placeholder="AIza..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-accent w-full justify-center"
                        disabled={!apiKey.trim() || isValidating}
                    >
                        {isValidating ? <Loader2 className="animate-spin" /> : 'Connect to Neural Net'}
                    </button>
                </form>
            </div>
        </div>
    );
};
