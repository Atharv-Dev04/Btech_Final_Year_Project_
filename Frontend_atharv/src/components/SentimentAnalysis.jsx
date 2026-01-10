import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CloudUpload, FileText, Sparkles, ChevronDown, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function SentimentAnalysis() {
    const [documents, setDocuments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [pastedText, setPastedText] = useState('');
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);
    
    // Analysis State
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    
    const resultsRef = useRef(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.listDocuments();
                if (response.status === 'success') {
                    setDocuments(response.data.documents || []);
                }
            } catch (err) {
                console.error('Failed to load documents:', err);
            } finally {
                setIsLoadingDocs(false);
            }
        };
        fetchDocuments();
    }, []);

    const scrollToResults = () => {
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const handleAnalyzeDocument = async () => {
        if (!selectedDoc) return;
        setIsAnalyzing(true);
        setResult(null);
        try {
            const response = await api.analyzeSentiment(selectedDoc);
            if (response.status === 'success') {
                setResult(response.data);
                scrollToResults();
            }
        } catch (err) {
            console.error('Analysis failed:', err);
            alert('Analysis failed: ' + (err.message || 'Unknown error'));
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleAnalyzeText = async () => {
        if (!pastedText.trim()) return;
        setIsAnalyzing(true);
        setResult(null);
        try {
            // 1. Upload text first
            const uploadResponse = await api.uploadText(pastedText);
            if (uploadResponse.status !== 'success') throw new Error('Text upload failed');
            
            const docId = uploadResponse.data.document_id;

            // 2. Analyze the new document
            const analyzeResponse = await api.analyzeSentiment(docId);
            if (analyzeResponse.status === 'success') {
                setResult(analyzeResponse.data);
                scrollToResults();
            }
        } catch (err) {
            console.error('Text analysis failed:', err);
            alert('Analysis failed: ' + (err.message || 'Unknown error'));
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Global Loader Overlay */}
            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm rounded-3xl flex items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-3 p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
                            <Loader2 size={40} className="animate-spin text-primary" />
                            <p className="font-bold text-gray-900">Running Sentiment Analysis...</p>
                            <p className="text-xs text-gray-500">Processing language semantics</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Sentiment Analysis</h2>
                <p className="text-gray-500">Pass an uploaded document (or pasted text) to compute overall verdict, polarity score, and confidence for accuracy.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Select Document */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Select Document</h3>
                            <p className="text-xs text-gray-400">Choose a document to run sentiment analysis</p>
                        </div>
                    </div>

                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Document</label>
                    <div className="relative">
                        <select 
                            value={selectedDoc}
                            onChange={(e) => setSelectedDoc(e.target.value)}
                            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700 disabled:opacity-50"
                            disabled={isLoadingDocs || isAnalyzing}
                        >
                            <option value="">-- Select a document --</option>
                            {documents.map(doc => (
                                <option key={doc.document_id} value={doc.document_id}>
                                    {doc.filename}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
                    </div>

                    {isLoadingDocs && <p className="text-xs text-gray-400 mt-2 ml-1">Loading documents...</p>}

                    <div className="flex justify-end mt-auto pt-6">
                        <button 
                            disabled={!selectedDoc || isAnalyzing}
                            onClick={handleAnalyzeDocument}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                        >
                            Run Analysis
                        </button>
                    </div>
                </div>

                {/* Or Paste Text */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Or paste text</h3>
                            <p className="text-xs text-gray-400">Analyze inline text content</p>
                        </div>
                    </div>

                    <div className="relative mb-6">
                        <textarea
                            value={pastedText}
                            onChange={(e) => setPastedText(e.target.value)}
                            placeholder="Paste or type text here..."
                            className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none text-gray-700"
                            disabled={isAnalyzing}
                        />
                    </div>

                    <div className="flex justify-end mt-auto pt-6">
                        <button 
                            disabled={!pastedText.trim() || isAnalyzing}
                            onClick={handleAnalyzeText}
                            className="bg-primary text-white px-8 py-3 rounded-xl font-bold transition-all hover:brightness-110 active:scale-95 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none"
                        >
                            Run Analysis
                        </button>
                    </div>
                </div>
            </div>

            {/* Analysis Result */}
            <div ref={resultsRef} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm scroll-mt-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                            <BarChart3 size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Analysis Result</h3>
                            <p className="text-xs text-gray-400">Overall verdict, polarity score, and confidence (accuracy).</p>
                        </div>
                    </div>
                    {result && (
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border ${
                            result.sentiment === 'positive' ? 'bg-green-50 text-green-500 border-green-100' :
                            result.sentiment === 'negative' ? 'bg-red-50 text-red-500 border-red-100' :
                            'bg-gray-50 text-gray-500 border-gray-100'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${
                                result.sentiment === 'positive' ? 'bg-green-500' :
                                result.sentiment === 'negative' ? 'bg-red-500' :
                                'bg-gray-500'
                            }`} /> 
                            {result.sentiment?.charAt(0).toUpperCase() + result.sentiment?.slice(1)}
                        </span>
                    )}
                </div>

                {result ? (
                    <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
                        <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 flex flex-col justify-center">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Verdict & Confidence</p>
                            <p className="text-3xl font-black text-gray-900 capitalize mb-2">{result.sentiment}</p>
                            <p className="text-sm font-bold text-gray-500">{(result.confidence * 100).toFixed(1)}% Confidence</p>
                        </div>

                        <div className="col-span-2 p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Score Breakdown</p>
                             <div className="space-y-4">
                                {/* Positive */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-1">
                                        <span className="text-green-600">Positive</span>
                                        <span className="text-gray-900">{(result.scores?.positive * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-green-500 rounded-full transition-all duration-1000" 
                                            style={{ width: `${(result.scores?.positive || 0) * 100}%` }} 
                                        />
                                    </div>
                                </div>

                                {/* Neutral */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-1">
                                        <span className="text-gray-500">Neutral</span>
                                        <span className="text-gray-900">{(result.scores?.neutral * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gray-400 rounded-full transition-all duration-1000" 
                                            style={{ width: `${(result.scores?.neutral || 0) * 100}%` }} 
                                        />
                                    </div>
                                </div>

                                {/* Negative */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-1">
                                        <span className="text-red-500">Negative</span>
                                        <span className="text-gray-900">{(result.scores?.negative * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-red-500 rounded-full transition-all duration-1000" 
                                            style={{ width: `${(result.scores?.negative || 0) * 100}%` }} 
                                        />
                                    </div>
                                </div>
                             </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30 rounded-2xl border border-dashed border-gray-200">
                        <BarChart3 size={32} className="mb-3 opacity-20" />
                        <p className="text-sm">Select a document or paste text to see results</p>
                    </div>
                )}
            </div>
        </div>
    );
}
