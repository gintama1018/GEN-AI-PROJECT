// LocalStorage manager for persistent data

import type { Persona } from '../types/appTypes';

const STORAGE_KEYS = {
    API_KEY: 'gemini_mind_api_key',
    PERSONAS: 'gemini_mind_personas',
    PREFERENCES: 'gemini_mind_preferences',
};

// Default personas
const DEFAULT_PERSONAS: Persona[] = [
    {
        id: 'codemaster',
        name: 'CodeMaster',
        description: 'Senior developer focused on clean, efficient, and well-documented code',
        tone: 'technical',
        expertiseAreas: ['Software Architecture', 'Best Practices', 'Code Review', 'Performance'],
        outputPreferences: {
            length: 'balanced',
            format: 'structured',
            style: 'Include comments, follow DRY principles, use meaningful names',
        },
        systemPrompt: `You are CodeMaster, a senior software developer with 15+ years of experience. 
You write clean, efficient, and well-documented code. You focus on:
- Clear variable and function naming
- Proper error handling
- Performance optimization
- Following industry best practices
- Adding helpful inline comments
Always explain your code choices briefly.`,
        isDefault: true,
    },
    {
        id: 'marketingpro',
        name: 'MarketingPro',
        description: 'Persuasive copywriter focused on conversion and engagement',
        tone: 'creative',
        expertiseAreas: ['Copywriting', 'SEO', 'Brand Voice', 'Conversion Optimization'],
        outputPreferences: {
            length: 'balanced',
            format: 'flowing',
            style: 'Engaging, action-oriented, emotionally compelling',
        },
        systemPrompt: `You are MarketingPro, an expert copywriter and marketing strategist.
You create compelling content that drives action. You focus on:
- Strong headlines that grab attention
- Benefit-focused messaging
- Clear calls-to-action
- Emotional connection with the audience
- SEO-friendly structure when relevant
Make every word count and drive conversions.`,
        isDefault: true,
    },
    {
        id: 'techwriter',
        name: 'TechWriter',
        description: 'Documentation expert creating clear, comprehensive technical content',
        tone: 'professional',
        expertiseAreas: ['Technical Documentation', 'API Docs', 'User Guides', 'Tutorials'],
        outputPreferences: {
            length: 'detailed',
            format: 'structured',
            style: 'Clear, step-by-step, with examples',
        },
        systemPrompt: `You are TechWriter, a technical documentation specialist.
You create clear, comprehensive documentation that users love. You focus on:
- Logical structure and organization
- Step-by-step instructions
- Practical examples
- Anticipating user questions
- Consistent terminology
Make complex topics accessible to your audience.`,
        isDefault: true,
    },
];

// Helper to check if localStorage is available
const isStorageAvailable = (): boolean => {
    try {
        const test = '__storage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch {
        return false;
    }
};

export const StorageService = {
    // API Key management
    getApiKey(): string | null {
        if (!isStorageAvailable()) return null;
        try {
            return localStorage.getItem(STORAGE_KEYS.API_KEY);
        } catch {
            return null;
        }
    },

    setApiKey(key: string): void {
        if (!isStorageAvailable()) return;
        try {
            localStorage.setItem(STORAGE_KEYS.API_KEY, key);
        } catch {
            console.warn('Unable to save API key to localStorage');
        }
    },

    clearApiKey(): void {
        if (!isStorageAvailable()) return;
        try {
            localStorage.removeItem(STORAGE_KEYS.API_KEY);
        } catch {
            // Ignore
        }
    },

    // Persona management
    getPersonas(): Persona[] {
        if (!isStorageAvailable()) return DEFAULT_PERSONAS;
        try {
            const stored = localStorage.getItem(STORAGE_KEYS.PERSONAS);
            if (!stored) {
                // Initialize with defaults
                this.savePersonas(DEFAULT_PERSONAS);
                return DEFAULT_PERSONAS;
            }
            return JSON.parse(stored);
        } catch {
            return DEFAULT_PERSONAS;
        }
    },

    savePersonas(personas: Persona[]): void {
        if (!isStorageAvailable()) return;
        try {
            localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(personas));
        } catch {
            console.warn('Unable to save personas to localStorage');
        }
    },

    addPersona(persona: Persona): void {
        const personas = this.getPersonas();
        personas.push(persona);
        this.savePersonas(personas);
    },

    updatePersona(persona: Persona): void {
        const personas = this.getPersonas();
        const index = personas.findIndex((p) => p.id === persona.id);
        if (index !== -1) {
            personas[index] = persona;
            this.savePersonas(personas);
        }
    },

    deletePersona(id: string): void {
        const personas = this.getPersonas().filter((p) => p.id !== id);
        this.savePersonas(personas);
    },

    resetToDefaults(): void {
        this.savePersonas(DEFAULT_PERSONAS);
    },
};
