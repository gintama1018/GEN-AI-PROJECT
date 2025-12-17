import { useState, useCallback } from 'react';
import { Upload, ScanLine, FileCheck } from 'lucide-react';
import { extractTextFromFile } from '../../utils/pdfParser';

interface DocumentUploadProps {
    onDocumentLoaded: (text: string, fileName: string) => void;
    isLoading: boolean;
}

export const DocumentUpload = ({ onDocumentLoaded, isLoading }: DocumentUploadProps) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [extracting, setExtracting] = useState(false);

    const handleFile = async (file: File) => {
        setExtracting(true);
        try {
            const text = await extractTextFromFile(file);
            onDocumentLoaded(text, file.name);
        } catch (err) {
            console.error(err);
            alert('Failed to read file');
        } finally {
            setExtracting(false);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    }, []);

    if (isLoading) {
        return (
            <div className="glass-panel" style={{
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '12px',
                border: '1px solid var(--border-active)'
            }}>
                <div className="animate-spin mb-6">
                    <ScanLine size={48} className="text-secondary" />
                </div>
                <h3 className="text-xl font-medium mb-2">Analyzing Document</h3>
                <p className="text-secondary text-center max-w-sm">
                    Extracting key concepts...
                </p>
            </div>
        );
    }

    return (
        <div className="fade-enter max-w-2xl mx-auto mt-12">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-semibold mb-3 tracking-tight">
                    Add Knowledge Source
                </h2>
                <p className="text-secondary">Upload a PDF or Markdown file to begin analysis.</p>
            </div>

            <label
                className={`glass-panel transition-all duration-300 ${isDragOver ? 'border-primary' : 'border-subtle'}`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragOver(false); }}
                style={{
                    height: '320px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: isDragOver ? '1px solid var(--text-primary)' : '1px dashed var(--border-active)',
                    background: isDragOver ? 'var(--bg-surface-hover)' : 'transparent'
                }}
            >
                <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    style={{ display: 'none' }}
                />

                <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '16px',
                    background: 'var(--bg-surface-hover)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.5rem',
                    color: 'var(--text-primary)'
                }}>
                    {extracting ? (
                        <FileCheck size={32} className="animate-pulse" />
                    ) : (
                        <Upload size={32} />
                    )}
                </div>

                <h3 className="text-lg font-medium mb-2">
                    {extracting ? 'Processing...' : 'Click or Drag File'}
                </h3>
                <p className="text-tertiary text-sm">PDF, TXT, MD up to 10MB</p>
            </label>
        </div>
    );
};
