import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ExternalLink,
    Loader2,
    AlertCircle,
    TrendingUp,
    CheckCircle,
    Clock,
    Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function ArticleModal({ isOpen, article, onClose }) {
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [error, setError] = useState(null);
    const [pipelineStage, setPipelineStage] = useState(0);

    // Reset state when modal opens with new article
    useEffect(() => {
        if (isOpen && article) {
            setAnalyzing(false);
            setError(null);
            setPipelineStage(0);
            
            // Check if article is already analyzed
            if (article.analyzed) {
                // Fetch existing analysis
                fetchAnalysis();
            } else {
                setAnalysisResults(null);
            }
        }
    }, [isOpen, article?._id]);

    const fetchAnalysis = async () => {
        try {
            const response = await api.getAnalysis(article._id);
            if (response.status === 'success') {
                setAnalysisResults(response.analysis);
            }
        } catch (err) {
            console.error('Failed to fetch analysis:', err);
        }
    };

    const startAnalysis = async () => {
        setAnalyzing(true);
        setError(null);
        setPipelineStage(0);

        try {
            // Simulate pipeline stages
            const stages = [
                'Content Extraction',
                'Translation',
                'Sentiment Analysis',
                'Entity Recognition',
                'Summarization',
                'Classification',
                'Bias Detection',
                'Fact Verification'
            ];

            // Progress through stages
            for (let i = 0; i < stages.length; i++) {
                setPipelineStage(i + 1);
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulate stage delay
            }

            // Call analysis API
            const response = await api.analyzeArticle(article._id);
            
            if (response.status === 'success') {
                setAnalysisResults(response.analysis);
            } else {
                throw new Error(response.message || 'Analysis failed');
            }
        } catch (err) {
            console.error('Analysis failed:', err);
            setError(err.message || 'Failed to analyze article');
        } finally {
            setAnalyzing(false);
        }
    };

    if (!isOpen || !article) return null;

    const formatDate = (dateString) => {
        if (!dateString) return 'Recently';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-all shadow-lg"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>

                    {/* Scrollable Content */}
                    <div className="overflow-y-auto max-h-[90vh]">
                        {/* Article Image */}
                        {article.image_url && (
                            <div className="relative h-80 overflow-hidden">
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-8">
                            {/* Meta Info */}
                            <div className="flex items-center gap-3 text-sm text-gray-500 font-bold mb-4">
                                <span className="flex items-center gap-1">
                                    📰 {article.source}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {formatDate(article.published_date)}
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl font-black text-gray-900 mb-4 leading-tight">
                                {article.title}
                            </h1>

                            {/* Summary */}
                            {article.summary && (
                                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                    {article.summary}
                                </p>
                            )}

                            {/* Analysis Section */}
                            {!article.analyzed && !analyzing && !analysisResults && (
                                <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm">
                                            <Sparkles size={24} className="text-indigo-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-black text-gray-900 mb-2">
                                                Get AI-Powered Insights
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                Analyze this article with our advanced AI to get sentiment analysis, key entities, summary, and more.
                                            </p>
                                            <button
                                                onClick={startAnalysis}
                                                className="px-6 py-3 bg-primary text-white rounded-xl font-black hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                                            >
                                                <Sparkles size={18} />
                                                Analyze This Article
                                                <span className="text-sm font-normal opacity-80">~60 seconds</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Pipeline Visualization */}
                            {analyzing && (
                                <div className="mt-8 p-6 bg-white rounded-2xl border-2 border-indigo-200">
                                    <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <Loader2 className="animate-spin text-indigo-600" size={20} />
                                        Analyzing Article...
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Content Extraction', icon: '📄' },
                                            { name: 'Translation', icon: '🌐' },
                                            { name: 'Sentiment Analysis', icon: '😊' },
                                            { name: 'Entity Recognition', icon: '👥' },
                                            { name: 'Summarization', icon: '📝' },
                                            { name: 'Classification', icon: '🏷️' },
                                            { name: 'Bias Detection', icon: '⚖️' },
                                            { name: 'Fact Verification', icon: '✓' }
                                        ].map((stage, index) => {
                                            const isComplete = index < pipelineStage;
                                            const isActive = index === pipelineStage - 1;
                                            const isPending = index >= pipelineStage;

                                            return (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                                                        isComplete ? 'bg-green-50' :
                                                        isActive ? 'bg-blue-50' :
                                                        'bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="text-2xl">{stage.icon}</div>
                                                    <div className="flex-1">
                                                        <p className={`font-bold ${
                                                            isComplete ? 'text-green-700' :
                                                            isActive ? 'text-blue-700' :
                                                            'text-gray-400'
                                                        }`}>
                                                            {stage.name}
                                                        </p>
                                                    </div>
                                                    {isComplete && <CheckCircle size={20} className="text-green-600" />}
                                                    {isActive && <Loader2 size={20} className="animate-spin text-blue-600" />}
                                                    {isPending && <Clock size={20} className="text-gray-300" />}
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    <div className="mt-4 text-center text-sm text-gray-500 font-bold">
                                        Stage {pipelineStage} of 8
                                    </div>
                                </div>
                            )}

                            {/* Analysis Results */}
                            {analysisResults && (
                                <div className="mt-8 space-y-6">
                                    <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                                        <TrendingUp className="text-indigo-600" size={24} />
                                        Analysis Results
                                    </h3>

                                    {/* Sentiment */}
                                    {analysisResults.sentiment && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100"
                                        >
                                            <h4 className="text-lg font-black text-gray-900 mb-4">😊 Sentiment Analysis</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-gray-700">Overall Sentiment</span>
                                                    <span className="text-lg font-black text-purple-600">
                                                        {analysisResults.sentiment.label || 'Neutral'}
                                                    </span>
                                                </div>
                                                {analysisResults.sentiment.score && (
                                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                                        <div
                                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                                                            style={{ width: `${analysisResults.sentiment.score * 100}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Summary */}
                                    {analysisResults.summary && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 }}
                                            className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100"
                                        >
                                            <h4 className="text-lg font-black text-gray-900 mb-4">📝 AI Summary</h4>
                                            <p className="text-gray-700 leading-relaxed">
                                                {analysisResults.summary}
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            )}

                            {/* Error State */}
                            {error && (
                                <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                                    <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
                                    <div className="flex-1">
                                        <h4 className="font-black text-red-900 mb-2">Analysis Failed</h4>
                                        <p className="text-red-700 mb-4">{error}</p>
                                        <button
                                            onClick={startAnalysis}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Read Original Article */}
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <a
                                    href={article.original_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    <ExternalLink size={18} />
                                    Read Original Article
                                </a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
