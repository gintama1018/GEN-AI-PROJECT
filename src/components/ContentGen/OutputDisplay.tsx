import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, RefreshCw, Terminal } from 'lucide-react';

interface OutputDisplayProps {
    content: string;
    contentType: string;
    personaName: string;
    onRegenerate: () => void;
    isLoading: boolean;
}

export const OutputDisplay = ({
    content,
    contentType,
    personaName,
    onRegenerate,
    isLoading
}: OutputDisplayProps) => {
    const handleCopy = () => navigator.clipboard.writeText(content);

    return (
        <div className="fade-enter">
            <div className="flex items-center justify-between mb-4 border-b border-glass-border pb-4">
                <div className="flex items-center gap-3">
                    <Terminal className="text-accent" />
                    <span className="font-mono text-sm text-secondary">OUTPUT_STREAM [{contentType.toUpperCase()}] :: {personaName.toUpperCase()}</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleCopy} className="btn-glass p-2 rounded-lg hover:text-white"><Copy size={16} /></button>
                    <button onClick={onRegenerate} disabled={isLoading} className="btn-glass p-2 rounded-lg hover:text-white"><RefreshCw size={16} /></button>
                </div>
            </div>

            <div className="font-mono text-sm leading-relaxed max-h-[600px] overflow-auto custom-scrollbar">
                <ReactMarkdown
                    components={{
                        code({ node, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !match ? (
                                <code className="bg-white/10 px-1 py-0.5 rounded text-accent" {...props}>{children}</code>
                            ) : (
                                <SyntaxHighlighter
                                    style={vscDarkPlus}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', margin: '1rem 0' }}
                                >
                                    {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                            );
                        }
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </div>
    );
};
