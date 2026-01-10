import { motion } from 'framer-motion';
import {
    Instagram,
    Facebook,
    Twitter,
    Mail,
    Phone,
    MapPin,
    Users,
    ShieldCheck,
    Zap,
    Github
} from 'lucide-react';

const socialLinks = [
    { id: 'instagram', icon: <Instagram size={24} />, label: 'Instagram', color: 'hover:text-pink-500 hover:bg-pink-50', url: '#' },
    { id: 'facebook', icon: <Facebook size={24} />, label: 'Facebook', color: 'hover:text-blue-600 hover:bg-blue-50', url: '#' },
    { id: 'twitter', icon: <Twitter size={24} />, label: 'X (Twitter)', color: 'hover:text-gray-900 hover:bg-gray-100', url: '#' },
    { id: 'github', icon: <Github size={24} />, label: 'GitHub', color: 'hover:text-gray-900 hover:bg-gray-100', url: '#' },
];

const contactDetails = [
    { id: 'email', icon: <Mail className="text-primary" size={20} />, label: 'Email Us', value: 'hello@insightpoint.ai' },
    { id: 'phone', icon: <Phone className="text-success" size={20} />, label: 'Call Us', value: '+1 (555) 000-0000' },
    { id: 'location', icon: <MapPin className="text-orange-500" size={20} />, label: 'Headquarters', value: 'Silicon Valley, CA' },
];

export default function About() {
    return (
        <div className="py-20 animate-fade-in max-w-5xl mx-auto px-4">
            {/* Hero Section */}
            <section className="text-center mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold border border-primary/10 mb-6"
                >
                    <Users size={16} /> Our Story
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
                >
                    Redefining News Analysis <br /> with <span className="text-primary">Advanced AI</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed"
                >
                    InsightPoint is dedicated to providing high-fidelity, real-time news intelligence through cutting-edge natural language processing and hybrid algorithms.
                </motion.p>
            </section>

            {/* Grid Content */}
            <div className="grid md:grid-cols-2 gap-12 mb-20">
                {/* Contact & Socials */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8"
                >
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                        <div className="grid gap-4">
                            {contactDetails.map((contact) => (
                                <div key={contact.id} className="p-6 bg-white border border-gray-100 rounded-[32px] flex items-center gap-6 group hover:shadow-xl hover:shadow-primary/5 transition-all">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                        {contact.icon}
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{contact.label}</p>
                                        <p className="text-lg font-bold text-gray-900">{contact.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Follow Our Journey</h2>
                        <div className="flex flex-wrap gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.id}
                                    href={social.url}
                                    className={`flex items-center gap-3 px-6 py-4 bg-white border border-gray-100 rounded-2xl transition-all font-bold text-gray-600 ${social.color} hover:shadow-lg`}
                                >
                                    {social.icon}
                                    {social.label}
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Vision Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-primary/5 rounded-[48px] p-12 border border-primary/10 relative overflow-hidden"
                >
                    <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50" />
                    <div className="relative z-10 space-y-8">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-primary shadow-xl shadow-primary/10">
                            <ShieldCheck size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 leading-tight">Our Commitment to Accuracy</h2>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            We believe that in an era of information overload, clarity is power. Our platform uses multi-layered verification to ensure that every keyword, sentiment, and summary is grounded in the source text with over 95% measured confidence.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-6">
                            <div className="p-6 bg-white rounded-[32px] border border-primary/10">
                                <Zap className="text-primary mb-3" size={24} />
                                <p className="text-2xl font-black text-gray-900">0.07s</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg. Processing</p>
                            </div>
                            <div className="p-6 bg-white rounded-[32px] border border-primary/10">
                                <ShieldCheck className="text-success mb-3" size={24} />
                                <p className="text-2xl font-black text-gray-900">99.1%</p>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Confidence Score</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Team Footer */}
            <footer className="pt-20 border-t border-gray-100 text-center">
                <p className="text-gray-400 font-bold mb-4">&copy; 2025 InsightPoint AI. All rights reserved.</p>
                <div className="flex justify-center gap-8 text-sm font-bold text-gray-500">
                    <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
                </div>
            </footer>
        </div>
    );
}
