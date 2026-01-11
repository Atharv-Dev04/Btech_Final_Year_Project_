import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, CloudUpload, FileText, Sparkles, ChevronDown, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { DEMO_DOCUMENTS, DEMO_SENTIMENT } from '../services/demoData';

export default function SentimentAnalysis() {
    const [documents, setDocuments] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState('');
    const [pastedText, setPastedText] = useState('');
    const [isLoadingDocs, setIsLoadingDocs] = useState(true);

    // Analysis State
    const [activeTab, setActiveTab] = useState('document');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const resultsRef = useRef(null);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.listDocuments();
                if (response.status === 'success' && response.data.documents?.length > 0) {
                    setDocuments(response.data.documents);
                    setSelectedDoc(response.data.documents[0].document_id); // Set first document as selected
                } else {
                    setDocuments(DEMO_DOCUMENTS);
                    setSelectedDoc(DEMO_DOCUMENTS[0].document_id); // Set first demo document as selected
                }
            } catch (err) {
                console.error('Failed to load documents:', err);
                setDocuments(DEMO_DOCUMENTS);
                setSelectedDoc(DEMO_DOCUMENTS[0].document_id); // Set first demo document as selected on error
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
            } else { // Fallback to demo data if API response is not success
                setResult(DEMO_SENTIMENT);
                scrollToResults();
            }
        } catch (err) {
            console.error('Analysis failed:', err);
            // Fallback to demo data
            setResult(DEMO_SENTIMENT);
            scrollToResults();
            // alert('Analysis failed: ' + (err.message || 'Unknown error'));
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
            } else { // Fallback to demo data if API response is not success
                setResult(DEMO_SENTIMENT);
                scrollToResults();
            }
        } catch (err) {
            console.error('Text analysis failed:', err);
            // Fallback to demo data
            setResult(DEMO_SENTIMENT);
            scrollToResults();
            // alert('Analysis failed: ' + (err.message || 'Unknown error'));
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative max-w-6xl mx-auto">
            {/* Global Loader Overlay */}
            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-[#0f172a]/60 backdrop-blur-sm rounded-3xl flex items-center justify-center"
                    >
                        <div className="flex flex-col items-center gap-3 p-8 bg-[#0f172a] rounded-2xl shadow-xl border border-white/10">
                            <Loader2 size={40} className="animate-spin text-indigo-400" />
                            <p className="font-bold text-white">Running Sentiment Analysis...</p>
                            <p className="text-xs text-gray-500">Processing language semantics</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div>
                <h2 className="text-3xl font-bold text-white mb-2">Sentiment Analysis</h2>
                <p className="text-gray-400">Pass an uploaded document (or pasted text) to compute overall verdict, polarity score, and confidence for accuracy.</p>
            </div>

            <div className="bg-[#0f172a]/40 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                {/* Tabs */}
                <div className="flex border-b border-white/5 bg-white/5">
                    <button
                        onClick={() => setActiveTab('document')}
                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${activeTab === 'document'
                            ? 'bg-white/5 text-indigo-400 border-b-2 border-indigo-500 shadow-[inset_0_-2px_0_0_#6366f1]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <FileText size={20} />
                        Choose Document
                    </button>
                    <button
                        onClick={() => setActiveTab('paste')}
                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${activeTab === 'paste'
                            ? 'bg-white/5 text-indigo-400 border-b-2 border-indigo-500 shadow-[inset_0_-2px_0_0_#6366f1]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <Sparkles size={20} />
                        Paste Text
                    </button>
                </div>

                {/* Content */}
                <div className="p-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'document' ? (
                            <motion.div
                                key="document"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white uppercase tracking-wider text-xs">Select Document</h3>
                                            <p className="text-[10px] text-gray-500">Pick a previously uploaded file</p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <select
                                            value={selectedDoc}
                                            onChange={(e) => setSelectedDoc(e.target.value)}
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-white disabled:opacity-50"
                                            disabled={isLoadingDocs || isAnalyzing}
                                        >
                                            <option value="" className="bg-[#0f172a]">-- Select a document --</option>
                                            {documents.map(doc => (
                                                <option key={doc.document_id} value={doc.document_id} className="bg-[#0f172a]">
                                                    {doc.filename}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                                    </div>
                                    {isLoadingDocs && <p className="text-[10px] text-gray-500 ml-1">Loading documents...</p>}
                                </div>

                                <div className="flex justify-center pt-4">
                                    <button
                                        disabled={!selectedDoc || isAnalyzing}
                                        onClick={handleAnalyzeDocument}
                                        className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-indigo-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isAnalyzing ? <Loader2 className="animate-spin" size={24} /> : <BarChart3 size={24} />}
                                        Run Sentiment Analysis
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="paste"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-6"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                                            <Sparkles size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white uppercase tracking-wider text-xs">Analyze Inline Text</h3>
                                            <p className="text-[10px] text-gray-500">Paste your content directly</p>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <textarea
                                            value={pastedText}
                                            onChange={(e) => setPastedText(e.target.value)}
                                            placeholder="Paste or type text here..."
                                            className="w-full h-48 p-6 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none text-white placeholder:text-gray-600"
                                            disabled={isAnalyzing}
                                        />
                                        <div className="absolute bottom-4 right-6 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                            {pastedText.length} characters
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-center pt-4">
                                    <button
                                        disabled={!pastedText.trim() || isAnalyzing}
                                        onClick={handleAnalyzeText}
                                        className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-lg flex items-center gap-3 shadow-xl shadow-indigo-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                                    >
                                        {isAnalyzing ? <Loader2 className="animate-spin" size={24} /> : <BarChart3 size={24} />}
                                        Analyze Pasted Text
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Analysis Result */}
            <div ref={resultsRef} className="bg-[#0f172a]/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-sm scroll-mt-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 border border-purple-500/20">
                            <BarChart3 size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Analysis Result</h3>
                            <p className="text-xs text-gray-500">Overall verdict, polarity score, and confidence (accuracy). {result === DEMO_SENTIMENT && <span className="text-indigo-400 text-[10px] font-black uppercase ml-2 tracking-tighter bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">Demo</span>}</p>
                        </div>
                    </div>
                    {result && (
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border ${result.sentiment === 'positive' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            result.sentiment === 'negative' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                'bg-white/5 text-gray-400 border-white/10'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${result.sentiment === 'positive' ? 'bg-emerald-400' :
                                result.sentiment === 'negative' ? 'bg-red-400' :
                                    'bg-gray-400'
                                }`} />
                            {result.sentiment?.charAt(0).toUpperCase() + result.sentiment?.slice(1)}
                        </span>
                    )}
                </div>

                {result ? (
                    <div className="grid md:grid-cols-3 gap-6 animate-fade-in-up">
                        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex flex-col justify-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Verdict & Confidence</p>
                            <p className="text-3xl font-black text-white capitalize mb-2">{result.sentiment}</p>
                            <p className="text-sm font-bold text-gray-500">{(result.confidence * 100).toFixed(1)}% Confidence</p>
                        </div>

                        <div className="col-span-2 p-6 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">Score Breakdown</p>
                            <div className="space-y-4">
                                {/* Positive */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-1">
                                        <span className="text-emerald-400">Positive</span>
                                        <span className="text-white">{(result.scores?.positive * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(result.scores?.positive || 0) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Neutral */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-1">
                                        <span className="text-indigo-400">Neutral</span>
                                        <span className="text-white">{(result.scores?.neutral * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                                            style={{ width: `${(result.scores?.neutral || 0) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Negative */}
                                <div>
                                    <div className="flex justify-between text-sm font-bold mb-1">
                                        <span className="text-red-400">Negative</span>
                                        <span className="text-white">{(result.scores?.negative * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
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
                    <div className="h-40 flex flex-col items-center justify-center text-gray-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                        <BarChart3 size={32} className="mb-3 opacity-20" />
                        <p className="text-sm text-gray-500">Select a document or paste text to see results</p>
                    </div>
                )}
            </div>
        </div>
    );
}
