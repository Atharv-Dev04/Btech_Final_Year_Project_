import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    ExternalLink,
    Loader2,
    AlertCircle,
    TrendingUp,
    CheckCircle,
    Clock,
    Sparkles
} from 'lucide-react';
import { api } from '../services/api';

export default function ArticleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [error, setError] = useState(null);
    const [pipelineStage, setPipelineStage] = useState(0);
    const [showEnglish, setShowEnglish] = useState(true); // Toggle for English/Original language
    const [expandedGroups, setExpandedGroups] = useState({}); // Track which entity groups are expanded

    // Fetch article details on mount
    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        setLoading(true);
        try {
            const response = await api.getArticle(id);
            if (response.status === 'success') {
                setArticle(response.article);
                
                // Check if already analyzed
                if (response.article?.analyzed) {
                    fetchAnalysis();
                }
            } else {
                setError('Article not found');
            }
        } catch (err) {
            console.error('Failed to fetch article:', err);
            setError('Failed to load article');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalysis = async () => {
        try {
            const response = await api.getAnalysis(id);
            if (response.status === 'success') {
                console.log('📊 Existing Analysis Response:', response);
                
                // Merge summary and translation from root if they exist
                const fullAnalysis = {
                    ...response.analysis,
                    summary: response.summary || response.analysis?.summary,
                    analysis_translated: response.analysis_translated || response.translated
                };
                
                console.log('✅ Full Existing Analysis:', fullAnalysis);
                setAnalysisResults(fullAnalysis);
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
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            // Call analysis API
            const response = await api.analyzeArticle(id);
            
            if (response.status === 'success') {
                console.log('📊 Analysis Response:', response);
                
                // Summary is at root level, not inside analysis
                // Merge summary into analysis object for easier access
                const fullAnalysis = {
                    ...response.analysis,
                    summary: response.summary,
                    analysis_translated: response.analysis_translated || response.translated
                };
                
                console.log('✅ Full Analysis:', fullAnalysis);
                setAnalysisResults(fullAnalysis);
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Article Not Found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:brightness-110 transition-all"
                    >
                        Back to News Feed
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
            {/* Header with Back Button */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors font-bold"
                    >
                        <ArrowLeft size={20} />
                        Back to News Feed
                    </button>
                </div>
            </div>

            {/* Article Content */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Hero Image */}
                {article.image_url && (
                    <div className="relative h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl">
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-gray-500 font-bold mb-6">
                    <span className="flex items-center gap-2">
                        📰 {article.source}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-2">
                        <Clock size={16} />
                        {formatDate(article.published_date)}
                    </span>
                    {article.category && (
                        <>
                            <span>•</span>
                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-black uppercase">
                                {article.category}
                            </span>
                        </>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-5xl font-black text-gray-900 mb-8 leading-tight">
                    {article.title}
                </h1>

                {/* Summary */}
                {article.summary && (
                    <p className="text-xl text-gray-600 mb-12 leading-relaxed">
                        {article.summary}
                    </p>
                )}

                {/* Analysis Section */}
                {!article.analyzed && !analyzing && !analysisResults && (
                    <div className="mb-12 p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl border border-indigo-100">
                        <div className="flex items-start gap-6">
                            <div className="p-4 bg-white rounded-2xl shadow-sm">
                                <Sparkles size={32} className="text-indigo-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-black text-gray-900 mb-3">
                                    Get AI-Powered Insights
                                </h3>
                                <p className="text-gray-600 mb-6 text-lg">
                                    Analyze this article with our advanced AI to get sentiment analysis, key entities, summary, and more.
                                </p>
                                <button
                                    onClick={startAnalysis}
                                    className="px-8 py-4 bg-primary text-white rounded-2xl font-black hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center gap-3"
                                >
                                    <Sparkles size={20} />
                                    Analyze This Article
                                    <span className="text-sm font-normal opacity-80">~60 seconds</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pipeline Visualization */}
                {analyzing && (
                    <div className="mb-12 p-8 bg-white rounded-3xl border-2 border-indigo-200 shadow-xl">
                        <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                            <Loader2 className="animate-spin text-indigo-600" size={28} />
                            Analyzing Article...
                        </h3>
                        
                        <div className="space-y-4">
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
                                        className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                                            isComplete ? 'bg-green-50 border-2 border-green-200' :
                                            isActive ? 'bg-blue-50 border-2 border-blue-200' :
                                            'bg-gray-50 border-2 border-gray-200'
                                        }`}
                                    >
                                        <div className="text-3xl">{stage.icon}</div>
                                        <div className="flex-1">
                                            <p className={`font-bold text-lg ${
                                                isComplete ? 'text-green-700' :
                                                isActive ? 'text-blue-700' :
                                                'text-gray-400'
                                            }`}>
                                                {stage.name}
                                            </p>
                                        </div>
                                        {isComplete && <CheckCircle size={24} className="text-green-600" />}
                                        {isActive && <Loader2 size={24} className="animate-spin text-blue-600" />}
                                        {isPending && <Clock size={24} className="text-gray-300" />}
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="mt-6 text-center text-gray-500 font-bold">
                            Stage {pipelineStage} of 8
                        </div>
                    </div>
                )}

                {/* Analysis Results */}
                {analysisResults && (
                    <div className="mb-12 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                                <TrendingUp className="text-indigo-600" size={32} />
                                Analysis Results
                            </h3>
                            
                            {/* Language Toggle */}
                            {(analysisResults.analysis_translated || analysisResults.translated) && (
                                <button
                                    onClick={() => setShowEnglish(!showEnglish)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-indigo-200 rounded-2xl font-bold text-gray-700 hover:bg-indigo-50 transition-all shadow-sm"
                                >
                                    <span className="text-2xl">{showEnglish ? '🇬🇧' : '🌍'}</span>
                                    <span>{showEnglish ? 'English' : 'Original'}</span>
                                    <svg className={`w-4 h-4 transition-transform duration-300 ${!showEnglish ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Sentiment */}
                        {analysisResults.sentiment && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl border border-purple-100"
                            >
                                <h4 className="text-2xl font-black text-gray-900 mb-6">😊 Sentiment Analysis</h4>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-gray-700 text-lg">Overall Sentiment</span>
                                        <span className="text-2xl font-black text-purple-600 capitalize">
                                            {analysisResults.sentiment.label || 'Neutral'}
                                        </span>
                                    </div>
                                    
                                    {/* Sentiment Scores */}
                                    {analysisResults.sentiment.scores && (
                                        <div className="space-y-3">
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-bold text-green-700">Positive</span>
                                                    <span className="text-sm font-bold text-green-700">
                                                        {(analysisResults.sentiment.scores.positive * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all"
                                                        style={{ width: `${analysisResults.sentiment.scores.positive * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-bold text-gray-700">Neutral</span>
                                                    <span className="text-sm font-bold text-gray-700">
                                                        {(analysisResults.sentiment.scores.neutral * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-gray-400 to-gray-600 h-3 rounded-full transition-all"
                                                        style={{ width: `${analysisResults.sentiment.scores.neutral * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <div className="flex justify-between mb-1">
                                                    <span className="text-sm font-bold text-red-700">Negative</span>
                                                    <span className="text-sm font-bold text-red-700">
                                                        {(analysisResults.sentiment.scores.negative * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-3">
                                                    <div
                                                        className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all"
                                                        style={{ width: `${analysisResults.sentiment.scores.negative * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-purple-200">
                                        <span>Confidence: {(analysisResults.sentiment.confidence * 100).toFixed(1)}%</span>
                                        <span>Method: {analysisResults.sentiment.method}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Summary */}
                        {analysisResults.summary && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl border border-blue-100"
                            >
                                <h4 className="text-2xl font-black text-gray-900 mb-6">📝 AI Summary</h4>
                                
                                {/* Display summary based on language toggle */}
                                {(() => {
                                    let summaryText = '';
                                    const translatedObj = analysisResults.analysis_translated || analysisResults.translated;
                                    const targetLang = translatedObj ? Object.keys(translatedObj)[0] : null;
                                    
                                    // Check if we have translated analysis
                                    if (translatedObj && targetLang) {
                                        if (showEnglish) {
                                            // Show English summary
                                            summaryText = analysisResults.summary?.text || analysisResults.summary;
                                        } else {
                                            // Show original language summary from translated object
                                            const transSummary = translatedObj[targetLang]?.summary;
                                            summaryText = transSummary?.text || transSummary || (analysisResults.summary?.text || analysisResults.summary);
                                        }
                                    } else {
                                        // No translation, just show the summary
                                        summaryText = analysisResults.summary?.text || analysisResults.summary;
                                    }
                                    
                                    return (
                                        <>
                                            <p className="text-gray-700 leading-relaxed text-lg mb-4">
                                                {summaryText}
                                            </p>
                                            {analysisResults.summary?.sentences && (
                                                <div className="text-sm text-gray-500">
                                                    Condensed to {analysisResults.summary.sentences} key sentences
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </motion.div>
                        )}

                        {/* Keywords */}
                        {(() => {
                            const translatedObj = analysisResults.analysis_translated || analysisResults.translated;
                            const targetLang = translatedObj ? Object.keys(translatedObj)[0] : null;
                            const keywords = (!showEnglish && translatedObj && targetLang) 
                                ? (translatedObj[targetLang]?.keywords || analysisResults.keywords)
                                : analysisResults.keywords;

                            if (!keywords || keywords.length === 0) return null;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border border-amber-100"
                                >
                                    <h4 className="text-2xl font-black text-gray-900 mb-6">🔑 Key Topics</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {keywords.slice(0, 10).map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-white rounded-xl text-sm font-bold text-gray-700 border border-amber-200 hover:bg-amber-100 transition-colors shadow-sm"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })()}

                        {/* Entities */}
                        {(() => {
                            const translatedObj = analysisResults.analysis_translated || analysisResults.translated;
                            const targetLang = translatedObj ? Object.keys(translatedObj)[0] : null;
                            const entities = (!showEnglish && translatedObj && targetLang)
                                ? (translatedObj[targetLang]?.entities || analysisResults.entities)
                                : analysisResults.entities;

                            if (!entities || entities.length === 0) return null;

                            // Group entities by type
                            const entityGroups = entities.reduce((groups, entity) => {
                                const label = entity.label;
                                if (!groups[label]) groups[label] = [];
                                groups[label].push(entity.text);
                                return groups;
                            }, {});

                            const labelIcons = {
                                'PERSON': '👤',
                                'GPE': '🌍',
                                'ORG': '🏢',
                                'DATE': '📅',
                                'CARDINAL': '🔢',
                                'NORP': '👥',
                                'FAC': '🏛️',
                                'LOC': '📍',
                                'EVENT': '🎯'
                            };

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl border border-emerald-100"
                                >
                                    <h4 className="text-2xl font-black text-gray-900 mb-6">👥 Named Entities</h4>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {Object.entries(entityGroups).slice(0, 8).map(([label, entities]) => {
                                            const uniqueEntities = [...new Set(entities)];
                                            const isExpanded = expandedGroups[label];
                                            const displayEntities = isExpanded ? uniqueEntities : uniqueEntities.slice(0, 5);
                                            const hasMore = uniqueEntities.length > 5;

                                            return (
                                                <div 
                                                    key={label} 
                                                    className={`bg-white rounded-2xl p-4 border transition-all ${
                                                        isExpanded ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500/20' : 'border-emerald-200 shadow-sm'
                                                    }`}
                                                >
                                                    <div 
                                                        className="flex items-center gap-2 mb-3 cursor-pointer group"
                                                        onClick={() => setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }))}
                                                    >
                                                        <span className="text-2xl">{labelIcons[label] || '📌'}</span>
                                                        <h5 className="font-black text-gray-900 group-hover:text-emerald-600 transition-colors">{label}</h5>
                                                        <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                                                            {uniqueEntities.length}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {displayEntities.map((entity, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 bg-emerald-50 rounded-lg text-xs font-bold text-gray-700 hover:bg-emerald-100 transition-colors cursor-default"
                                                            >
                                                                {entity}
                                                            </span>
                                                        ))}
                                                        {hasMore && (
                                                            <button 
                                                                onClick={() => setExpandedGroups(prev => ({ ...prev, [label]: !prev[label] }))}
                                                                className={`px-3 py-1 text-xs font-black rounded-lg transition-all ${
                                                                    isExpanded 
                                                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                                                        : 'text-emerald-600 hover:bg-emerald-50'
                                                                }`}
                                                            >
                                                                {isExpanded ? 'Show Less' : `+${uniqueEntities.length - 5} more`}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            );
                        })()}

                        {/* Event Classification */}
                        {analysisResults.event && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="p-8 bg-gradient-to-br from-rose-50 to-red-50 rounded-3xl border border-rose-100"
                            >
                                <h4 className="text-2xl font-black text-gray-900 mb-6">🎯 Event Classification</h4>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-2xl p-6 border border-rose-200">
                                        <div className="text-sm font-bold text-gray-500 mb-2">Event Type</div>
                                        <div className="text-2xl font-black text-gray-900 capitalize">
                                            {analysisResults.event.type}
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-2xl p-6 border border-rose-200">
                                        <div className="text-sm font-bold text-gray-500 mb-2">Confidence</div>
                                        <div className="text-2xl font-black text-gray-900">
                                            {(analysisResults.event.confidence * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Location */}
                        {(() => {
                            const translatedObj = analysisResults.analysis_translated || analysisResults.translated;
                            const targetLang = translatedObj ? Object.keys(translatedObj)[0] : null;
                            const location = (!showEnglish && translatedObj && targetLang)
                                ? (translatedObj[targetLang]?.location || analysisResults.location)
                                : analysisResults.location;

                            if (!location || location.status === 'not_detected') return null;

                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                    className="p-8 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-3xl border border-indigo-100"
                                >
                                    <h4 className="text-2xl font-black text-gray-900 mb-6">📍 Location Analysis</h4>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-sm">
                                            <div className="text-sm font-bold text-gray-500 mb-2">Country</div>
                                            <div className="text-xl font-black text-gray-900">
                                                {location.country}
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-sm">
                                            <div className="text-sm font-bold text-gray-500 mb-2">City</div>
                                            <div className="text-xl font-black text-gray-900">
                                                {location.city}
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-sm">
                                            <div className="text-sm font-bold text-gray-500 mb-2">Confidence</div>
                                            <div className="text-xl font-black text-gray-900">
                                                {(location.confidence * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })()}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="mb-12 p-8 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4">
                        <AlertCircle size={32} className="text-red-600 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="font-black text-red-900 text-xl mb-3">Analysis Failed</h4>
                            <p className="text-red-700 mb-6">{error}</p>
                            <button
                                onClick={startAnalysis}
                                className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {/* Read Original Article */}
                <div className="pt-8 border-t border-gray-200">
                    <a
                        href={article.original_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                    >
                        <ExternalLink size={20} />
                        Read Original Article
                    </a>
                </div>
            </div>
        </div>
    );
}
