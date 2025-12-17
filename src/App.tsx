import { useState, useEffect } from 'react';
import { Sidebar } from './components/common/Sidebar';
import { ApiKeyModal } from './components/common/ApiKeyModal';
import { DocumentUpload } from './components/DLT/DocumentUpload';
import { QuestionPanel } from './components/DLT/QuestionPanel';
import { FeedbackPanel } from './components/DLT/FeedbackPanel';
import { PersonaManager } from './components/ContentGen/PersonaManager';
import { PromptInterface } from './components/ContentGen/PromptInterface';
import { OutputDisplay } from './components/ContentGen/OutputDisplay';
import { StorageService } from './services/storage';
import {
  initializeGemini,
  generateQuestionsFromDocument,
  evaluateAnswers,
  generateContentWithPersona
} from './services/gemini';
import type {
  Question,
  UserAnswer,
  EvaluationResult,
  Persona
} from './types/appTypes';
import './index.css';

type AppTab = 'learning' | 'content';
type DLTState = 'upload' | 'questions' | 'feedback';

function App() {
  const [, setApiKey] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('learning');

  // DLT State
  const [dltState, setDltState] = useState<DLTState>('upload');
  const [documentText, setDocumentText] = useState<string>('');
  const [documentName, setDocumentName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [dltLoading, setDltLoading] = useState(false);

  // Content Gen State
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [lastContentType, setLastContentType] = useState<string>('');
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    setPersonas(StorageService.getPersonas());

    // Priority 1: Environment Variable
    const envKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envKey) {
      setApiKey(envKey);
      initializeGemini(envKey);
      return;
    }

    // Priority 2: Local Storage
    const storedKey = StorageService.getApiKey();
    if (storedKey) {
      setApiKey(storedKey);
      initializeGemini(storedKey);
    } else {
      setShowApiModal(true);
    }
  }, []);

  const handleDocumentLoaded = async (text: string, fileName: string) => {
    setDocumentText(text);
    setDocumentName(fileName);
    setDltLoading(true);
    try {
      const generatedQuestions = await generateQuestionsFromDocument(text);
      setQuestions(generatedQuestions);
      setDltState('questions');
    } catch (error) {
      alert('Analysis failed. Please check parameters.');
    } finally {
      setDltLoading(false);
    }
  };

  const handleAnswersSubmit = async (answers: UserAnswer[]) => {
    setUserAnswers(answers);
    setDltLoading(true);
    try {
      const result = await evaluateAnswers(documentText, questions, answers);
      setEvaluation(result);
      setDltState('feedback');
    } catch {
      alert('Evaluation failed.');
    } finally {
      setDltLoading(false);
    }
  };

  const handleGenerate = async (contentType: string, prompt: string) => {
    if (!selectedPersona) return;
    setContentLoading(true);
    setLastContentType(contentType);
    try {
      const content = await generateContentWithPersona(selectedPersona, contentType, prompt);
      setGeneratedContent(content);
    } finally {
      setContentLoading(false);
    }
  };

  return (
    <>
      {showApiModal && <ApiKeyModal onKeySet={(key) => { setApiKey(key); initializeGemini(key); setShowApiModal(false); }} />}

      <div className="layout-container">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSettingsClick={() => setShowApiModal(true)}
        />

        <main className="content-area">
          {activeTab === 'learning' ? (
            <div className="animate-fade-in max-w-5xl mx-auto">
              {dltState === 'upload' && <DocumentUpload onDocumentLoaded={handleDocumentLoaded} isLoading={dltLoading} />}
              {dltState === 'questions' && <QuestionPanel questions={questions} documentName={documentName} onSubmit={handleAnswersSubmit} isLoading={dltLoading} />}
              {dltState === 'feedback' && evaluation && <FeedbackPanel questions={questions} answers={userAnswers} evaluation={evaluation} onReset={() => setDltState('upload')} />}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 animate-fade-in">
              <div className="xl:col-span-4">
                <PersonaManager
                  personas={personas}
                  selectedPersona={selectedPersona}
                  onSelectPersona={setSelectedPersona}
                  onPersonasChange={() => setPersonas(StorageService.getPersonas())}
                />
              </div>

              <div className="xl:col-span-8 flex flex-col gap-6">
                {/* Re-using updated prompt interface (assume style update or existing works) */}
                <div className="glass-panel p-6 rounded-2xl">
                  <PromptInterface
                    selectedPersona={selectedPersona}
                    onGenerate={handleGenerate}
                    isLoading={contentLoading}
                  />
                </div>
                {generatedContent && (
                  <div className="glass-panel p-6 rounded-2xl">
                    <OutputDisplay
                      content={generatedContent}
                      contentType={lastContentType}
                      personaName={selectedPersona?.name || 'AI'}
                      onRegenerate={() => { }}
                      isLoading={contentLoading}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default App;
