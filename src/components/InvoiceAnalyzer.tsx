"use client";

import { useState, useRef } from 'react';

interface AnalysisResult {
  gptAnswer: string;
  logId?: number;
}

const InvoiceAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) { // 20MB limit
        setError('Filen er for stor. Maksimal filstørrelse er 20MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setAnalysisResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Vennligst velg en fil først.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('consent', consent.toString());

      const response = await fetch('/api/gpt-ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Kunne ikke analysere filen');
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'En feil oppstod under analysen');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.size > 20 * 1024 * 1024) {
        setError('Filen er for stor. Maksimal filstørrelse er 20MB.');
        return;
      }
      setFile(droppedFile);
      setError(null);
      setAnalysisResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const resetForm = () => {
    setFile(null);
    setAnalysisResult(null);
    setError(null);
    setConsent(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* File Upload Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Last opp strømfaktura
        </h2>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {file ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg font-medium text-gray-800">{file.name}</span>
              </div>
              <p className="text-sm text-gray-600">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                onClick={resetForm}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Velg annen fil
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <svg className="w-12 h-12 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div>
                <p className="text-lg font-medium text-gray-800 mb-2">
                  Dra og slipp strømfakturaen her
                </p>
                <p className="text-gray-600 mb-4">
                  eller klikk for å velge fil
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Velg fil
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Støtter PNG og JPG (maks 20MB)
              </p>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Consent Checkbox */}
        <div className="mt-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">
              Jeg samtykker til at strømfakturaen kan lagres for å forbedre analysen. 
              Fakturaen lagres sikkert og brukes kun til dette formålet.
            </span>
          </label>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {file && (
          <div className="mt-6">
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyserer faktura...
                </div>
              ) : (
                'Analyser strømfaktura'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Analysis Result */}
      {analysisResult && (
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">
            Analyse av strømfaktura
          </h3>
          
          <div className="prose max-w-none">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
              <h4 className="text-lg font-semibold mb-3 text-blue-800">
                Resultat av analysen:
              </h4>
              <div className="whitespace-pre-wrap text-gray-800">
                {analysisResult.gptAnswer}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={resetForm}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              Analyser en ny faktura
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceAnalyzer;
