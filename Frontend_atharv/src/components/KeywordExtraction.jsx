import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Target, ChevronDown, Activity, Zap, Loader2, AlertCircle, Globe } from 'lucide-react';
import { api } from '../services/api';

export default function KeywordExtraction() {
    const [documents, setDocuments] = useState([]);
    const [selectedDocId, setSelectedDocId] = useState('');
    const [keywordData, setKeywordData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            fetchDocuments();
            hasFetched.current = true;
        }
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await api.listDocuments();
            if (response.status === 'success') {
                setDocuments(response.data.documents);
                if (response.data.documents.length > 0) {
                    setSelectedDocId(response.data.documents[0].document_id);
                }
            }
        } catch (err) {
            console.error("Failed to fetch documents:", err);
            setError("Could not load documents");
        }
    };

    const handleExtractKeywords = async () => {
        if (!selectedDocId) return;
        
        setLoading(true);
        setError(null);
        setKeywordData(null);
        
        try {
            const response = await api.extractKeywords(selectedDocId);
            if (response.status === 'success') {
                setKeywordData(response.data);
                // Set default language to English
                setSelectedLanguage('en');
            }
        } catch (err) {
            setError(err.message || "Keyword extraction failed");
        } finally {
            setLoading(false);
        }
    };

    // Helper to assign colors based on rank
    const getKeywordColor = (rank) => {
        if (rank <= 3) return 'bg-indigo-50 text-indigo-700 border-indigo-100';
        if (rank <= 7) return 'bg-blue-50 text-blue-700 border-blue-100';
        if (rank <= 10) return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        return 'bg-slate-50 text-slate-600 border-slate-100';
    };

    const getKeywordSize = (rank) => {
        if (rank <= 3) return 'text-2xl';
        if (rank <= 7) return 'text-xl';
        return 'text-lg';
    };

    // Get available languages from keyword data
    const availableLanguages = keywordData?.keywords ? Object.keys(keywordData.keywords) : [];
    const currentKeywords = keywordData?.keywords?.[selectedLanguage] || [];

    return (
        <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-12">
            <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Keyword Extraction</h2>
                <p className="text-gray-500 font-medium">Extract high-quality keywords using advanced RAKE algorithm.</p>
            </div>

            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-indigo-500/5">
                <div className="space-y-6 mb-12">
                    <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Select Document</label>
                        <div className="relative">
                            <select 
                                value={selectedDocId}
                                onChange={(e) => {
                                    setSelectedDocId(e.target.value);
                                    setKeywordData(null);
                                    setError(null);
                                }}
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl appearance-none outline-none focus:ring-4 focus:ring-primary/10 font-bold text-gray-700 cursor-pointer transition-all hover:bg-gray-100"
                            >
                                {documents.length === 0 && <option>No documents found</option>}
                                {documents.map(doc => (
                                    <option key={doc.document_id} value={doc.document_id}>
                                        {doc.filename}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                        </div>
                    </div>

                    <button 
                        onClick={handleExtractKeywords}
                        disabled={loading || !selectedDocId || documents.length === 0}
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
                        {loading ? 'Extracting...' : 'Extract Keywords'}
                    </button>
                    
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm animate-fade-in">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}
                </div>

                {keywordData && (
                    <div className="space-y-12 animate-fade-in">
                        {/* Language Toggle */}
                        {availableLanguages.length > 1 && (
                            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
                                <Globe className="text-indigo-600" size={20} />
                                <span className="text-sm font-bold text-gray-700">Language:</span>
                                <div className="flex gap-2">
                                    {availableLanguages.map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => setSelectedLanguage(lang)}
                                            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                                                selectedLanguage === lang
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'bg-white text-gray-600 hover:bg-gray-50'
                                            }`}
                                        >
                                            {lang.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Keyword Cloud */}
                        <div className="p-10 bg-gray-50/30 border border-gray-100 rounded-3xl">
                            <div className="flex items-center gap-3 mb-10">
                                <Activity className="text-primary" size={20} />
                                <h3 className="font-black text-gray-900 text-lg">Keyword Insights</h3>
                                <span className="ml-auto text-xs font-bold text-gray-400">
                                    {keywordData.stats.total_keywords} keywords • {keywordData.stats.time_taken}s
                                </span>
                            </div>

                            <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
                                {currentKeywords.map((kw, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`${getKeywordColor(kw.rank)} ${getKeywordSize(kw.rank)} px-8 py-4 rounded-full font-bold shadow-sm border transition-all cursor-default hover:scale-110`}
                                    >
                                        {kw.text}
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Relevance Scores */}
                        <div className="p-10 bg-gray-50/30 border border-gray-100 rounded-3xl">
                            <div className="flex items-center gap-3 mb-10">
                                <span className="text-primary font-bold text-xl">#</span>
                                <h3 className="font-black text-gray-900 text-lg">Keyword Relevance Scores</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-x-12 gap-y-6">
                                {currentKeywords.map((keyword, i) => (
                                    <motion.div
                                        key={keyword.rank}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-primary font-black text-sm">
                                            {keyword.rank}
                                        </div>
                                        <div className="flex-1 space-y-3">
                                            <div className="flex justify-between items-center px-1">
                                                <span className="font-bold text-gray-700">{keyword.text}</span>
                                                <span className="text-[10px] font-bold text-gray-400 tabular-nums">{keyword.score}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${keyword.score}%` }}
                                                    transition={{ duration: 1, delay: 0.5 + i * 0.05 }}
                                                    className="h-full bg-primary rounded-full"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
