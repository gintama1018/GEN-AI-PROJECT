// PDF Text Extraction Utility
import * as pdfjsLib from 'pdfjs-dist';

// Set up worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: unknown) => (item as { str: string }).str)
            .join(' ');
        fullText += pageText + '\n\n';
    }

    return fullText.trim();
};

export const extractTextFromFile = async (file: File): Promise<string> => {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
        return extractTextFromPDF(file);
    } else if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
        return await file.text();
    } else {
        throw new Error('Unsupported file type. Please upload a PDF, TXT, or MD file.');
    }
};
