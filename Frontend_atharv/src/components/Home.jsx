import { motion } from 'framer-motion';
import { Sparkles, BarChart3, Languages, FileText, ArrowRight, Zap, Target, Globe } from 'lucide-react';

const features = [
    {
        title: 'Sentiment Analysis',
        description: 'Uncover the emotional tone and underlying bias in global news reports.',
        icon: <BarChart3 className="text-primary" size={24} />,
        color: 'bg-primary/10'
    },
    {
        title: 'Keyword Extraction',
        description: 'Instantly identify core topics, entities, and shifting narratives.',
        icon: <Target className="text-secondary" size={24} />,
        iconColor: 'text-indigo-600',
        color: 'bg-indigo-50'
    },
    {
        title: 'AI Summarization',
        description: 'Condense long-form journalism into punchy, actionable insights.',
        icon: <FileText className="text-success" size={24} />,
        color: 'bg-success/10'
    },
    {
        title: 'Global Translation',
        description: 'Break language barriers with high-fidelity multi-language support.',
        icon: <Globe className="text-purple-600" size={24} />,
        color: 'bg-purple-50'
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
                    <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 inline-block">
                        <Sparkles className="inline-block mr-2" size={16} />
                        The Future of News Intelligence
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8 leading-tight">
                        Master the News Flow with <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">
                            InsightPoint AI
                        </span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed mb-12">
                        Revolutionize how you consume news. Our AI suite offers real-time sentiment analysis,
                        intelligent summarization, and seamless translation across multiple languages.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={onGetStarted}
                            className="btn-primary py-4 px-8 text-lg flex items-center gap-2 group shadow-xl shadow-primary/25"
                        >
                            Get Started for Free
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 text-lg font-semibold text-gray-600 hover:text-gray-900 transition-colors">
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
                className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 border-y border-gray-100 py-12"
            >
                {[
                    { label: 'Articles Analyzed', value: '2M+' },
                    { label: 'Languages', value: '45+' },
                    { label: 'Accuracy Rate', value: '99.2%' },
                    { label: 'Active Users', value: '150k' }
                ].map((stat, i) => (
                    <div key={i} className="text-center">
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-400 font-medium uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </motion.div>

            {/* Features Grid */}
            <section className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Powerful Features for Deep Insights</h2>
                    <p className="text-gray-500">Everything you need to stay ahead of the curve.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-3xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 group"
                        >
                            <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                            <p className="text-gray-500 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
