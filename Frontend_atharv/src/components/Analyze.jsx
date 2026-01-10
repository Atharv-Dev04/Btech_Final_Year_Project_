import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Languages,
    FileText,
    Target,
    ChevronRight,
    LayoutDashboard,
    FileSearch,
    PieChart,
    Globe
} from 'lucide-react';

import SentimentAnalysis from './SentimentAnalysis';
import Translation from './Translation';
import Summarization from './Summarization';
import KeywordExtraction from './KeywordExtraction';
import DocumentList from './DocumentList';
import AnalyticsReports from './AnalyticsReports';
import DetailedStats from './DetailedStats';
import AnalysisCard from './AnalysisCard';
import { Upload } from 'lucide-react';

const sidebarItems = [
    { id: 'upload', label: 'Upload Document', icon: <Upload size={20} />, component: (props) => <AnalysisCard {...props} /> },
    { id: 'documents', label: 'List of Documents', icon: <FileSearch size={20} />, component: (props) => <DocumentList {...props} /> },
    { id: 'sentiment', label: 'Sentiment Analysis', icon: <BarChart3 size={20} />, component: (props) => <SentimentAnalysis {...props} /> },
    { id: 'translation', label: 'Translation', icon: <Globe size={20} />, component: (props) => <Translation {...props} /> },
    { id: 'summary', label: 'Summary', icon: <FileText size={20} />, component: (props) => <Summarization {...props} /> },
    { id: 'keywords', label: 'Keyword Extraction', icon: <Target size={20} />, component: (props) => <KeywordExtraction {...props} /> },
    { id: 'analytics', label: 'Analytics Dashboard', icon: <PieChart size={20} />, component: (props) => <AnalyticsReports {...props} /> },
    { id: 'detailed-stats', label: 'Detailed Statistics', icon: <LayoutDashboard size={20} />, component: (props) => <DetailedStats {...props} /> },
];

export default function Analyze() {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('analyzeActiveTab') || 'upload';
    });

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        localStorage.setItem('analyzeActiveTab', tabId);
    };

    return (
        <div className="flex min-h-[calc(100vh-80px)] pt-20">
            {/* Sidebar */}
            <aside className="w-72 bg-white border-r border-gray-100 p-6 space-y-6 fixed h-full overflow-y-auto">
                <div className="px-4 pt-6 pb-2">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Analysis Dashboard</p>
                </div>

                <nav className="space-y-1">
                    {sidebarItems.slice(0, 6).map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleTabChange(item.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === item.id
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.icon}
                                {item.label}
                            </div>
                            {activeTab === item.id && <ChevronRight size={16} />}
                        </button>
                    ))}
                </nav>

                <div className="pt-8 mt-4 border-t border-gray-50 space-y-4">
                    <p className="px-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Other Reports</p>
                    <button
                        onClick={() => handleTabChange('analytics')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === 'analytics'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <PieChart size={20} />
                            Analytics
                        </div>
                        {activeTab === 'analytics' && <ChevronRight size={16} />}
                    </button>
                    <button
                        onClick={() => handleTabChange('detailed-stats')}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-semibold ${activeTab === 'detailed-stats'
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <LayoutDashboard size={20} />
                            Detailed Stats
                        </div>
                        {activeTab === 'detailed-stats' && <ChevronRight size={16} />}
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <main className="flex-1 ml-72 p-10 bg-[#F9FAFB]/50">
                <div className="max-w-6xl mx-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {sidebarItems.find(item => item.id === activeTab)?.component({ onNavigate: handleTabChange })}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
