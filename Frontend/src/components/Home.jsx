import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Languages, FileText, ArrowRight, Zap, Target, Globe } from 'lucide-react';

const features = [
    {
        title: 'Sentiment Analysis',
        description: 'Uncover the emotional tone and underlying bias in global news reports.',
        icon: <BarChart3 className="text-indigo-400" size={24} />,
        color: 'bg-indigo-500/10'
    },
    {
        title: 'Keyword Extraction',
        description: 'Instantly identify core topics, entities, and shifting narratives.',
        icon: <Target className="text-pink-400" size={24} />,
        color: 'bg-pink-500/10'
    },
    {
        title: 'AI Summarization',
        description: 'Condense long-form journalism into punchy, actionable insights.',
        icon: <FileText className="text-emerald-400" size={24} />,
        color: 'bg-emerald-500/10'
    },
    {
        title: 'Global Translation',
        description: 'Break language barriers with high-fidelity multi-language support.',
        icon: <Globe className="text-purple-400" size={24} />,
        color: 'bg-purple-500/10'
    }
];

export default function Home({ onGetStarted }) {
    return (
        <div className="pt-32 pb-20 px-4">
            {/* Hero Section */}
            <section className="text-center mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-sm font-semibold mb-6 inline-block border border-indigo-500/20">
                        <Sparkles className="inline-block mr-2 text-indigo-400" size={16} />
                        The Future of News Intelligence
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-tight">
                        Master the News Flow with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
                            InsightPoint AI
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-12">
                        Revolutionize how you consume news. Our AI suite offers real-time sentiment analysis,
                        intelligent summarization, and seamless translation across multiple languages.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="btn-primary py-4 px-8 text-lg flex items-center gap-2 group shadow-xl shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all"
                        >
                            Get Started for Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 text-lg font-semibold text-gray-400 hover:text-white transition-colors">
                            How it Works
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Stats/Social Proof */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-y border-white/10 py-12"
            >
                {[
                    { label: 'Articles Analyzed', value: '2M+' },
                    { label: 'Languages', value: '45+' },
                    { label: 'Accuracy Rate', value: '99.2%' },
                    { label: 'Active Users', value: '150k' }
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </motion.div>

            {/* Features Grid */}
            <section className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features for Deep Insights</h2>
                    <p className="text-gray-400">Everything you need to stay ahead of the curve.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
