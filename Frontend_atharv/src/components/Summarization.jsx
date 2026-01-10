import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, ChevronDown, Clock, Layers, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Summarization() {
    const [documents, setDocuments] = useState([]);
    const [selectedDocId, setSelectedDocId] = useState('');
    const [summaryData, setSummaryData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
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

    const handleGenerateSummary = async () => {
        if (!selectedDocId) return;
        
        setLoading(true);
        setError(null);
        setSummaryData(null);
        
        try {
            const response = await api.generateSummary(selectedDocId);
            if (response.status === 'success') {
                setSummaryData(response.data);
            }
        } catch (err) {
            setError(err.message || "Summarization failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl mx-auto mb-20">
            <div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Document Summary</h2>
                <p className="text-gray-500 font-medium">Generate AI-powered summaries of your documents instantly.</p>
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
                                    setSummaryData(null);
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
                        onClick={handleGenerateSummary}
                        disabled={loading || !selectedDocId || documents.length === 0}
                        className="bg-primary text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all w-full md:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                        {loading ? 'Generating...' : 'Generate Summary'}
                    </button>
                    
                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold text-sm animate-fade-in">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}
                </div>

                {summaryData && (
                    <div className="animate-fade-in space-y-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-primary border border-indigo-100">
                                    <FileText size={20} />
                                </div>
                                <h3 className="font-black text-gray-900 text-xl tracking-tight">Analysis Result</h3>
                            </div>

                            {/* English Summary */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">English Summary</span>
                                </div>
                                <div className="p-8 bg-slate-50/50 border border-slate-100 rounded-[32px] text-slate-700 leading-loose font-medium text-lg shadow-inner">
                                    {summaryData.summary.en}
                                </div>
                            </div>

                            {/* Translated Summary (if available) */}
                            {Object.keys(summaryData.summary).length > 1 && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                            Original Language Summary
                                        </span>
                                    </div>
                                    <div className="p-8 bg-blue-50/50 border border-blue-100 rounded-[32px] text-blue-900 leading-loose font-medium text-lg shadow-inner">
                                        {Object.entries(summaryData.summary)
                                            .filter(([lang]) => lang !== 'en')
                                            .map(([lang, text]) => text)[0]}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-[24px] bg-indigo-50 border border-indigo-100 shadow-sm relative overflow-hidden group">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3">Reduction</p>
                                <p className="text-4xl font-black text-indigo-600 tracking-tight">{summaryData.stats.reduction_percentage}%</p>
                                <Sparkles className="absolute bottom-[-10%] right-[-10%] w-24 h-24 text-indigo-200/50 opacity-100 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            <div className="p-6 rounded-[24px] bg-blue-50 border border-blue-100 shadow-sm relative overflow-hidden group">
                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Time Taken</p>
                                <p className="text-4xl font-black text-blue-600 tracking-tight">{summaryData.stats.time_taken}s</p>
                                <Clock className="absolute bottom-[-10%] right-[-10%] w-24 h-24 text-blue-200/50 opacity-100 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
