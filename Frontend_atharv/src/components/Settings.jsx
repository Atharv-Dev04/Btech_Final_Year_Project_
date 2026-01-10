import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Camera,
    ShieldCheck,
    Bell,
    CreditCard,
    Save,
    X,
    Lock,
    ChevronRight,
    Monitor
} from 'lucide-react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');

    const sidebarItems = [
        { id: 'profile', label: 'Profile Information', icon: <User size={18} /> },
        { id: 'security', label: 'Security & Password', icon: <Lock size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'billing', label: 'Billing & Plan', icon: <CreditCard size={18} /> },
        { id: 'appearance', label: 'Appearance', icon: <Monitor size={18} /> },
    ];

    return (
        <div className="py-20 animate-fade-in max-w-6xl mx-auto px-4">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Account Settings</h1>
                    <p className="text-gray-500 text-lg">Manage your profile, account preferences, and security.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 rounded-2xl bg-white border border-gray-100 font-bold text-gray-500 hover:bg-gray-50 transition-all">
                        Cancel
                    </button>
                    <button className="px-8 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-[300px,1fr] gap-12">
                {/* Navigation Sidebar */}
                <aside className="space-y-2">
                    <nav className="space-y-1">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-xl shadow-primary/15' : 'text-gray-500 hover:bg-white hover:text-gray-900'}`}
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    {item.label}
                                </div>
                                {activeTab === item.id && <ChevronRight size={16} />}
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Form Content */}
                <div className="space-y-8 min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.section
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm space-y-10"
                            >
                                <div className="flex flex-col md:flex-row gap-10">
                                    <div className="relative group mx-auto md:mx-0">
                                        <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-gray-50 shadow-md">
                                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=John" alt="Avatar" className="w-full h-full object-cover" />
                                        </div>
                                        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-white group-hover:scale-110 transition-transform">
                                            <Camera size={18} />
                                        </button>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h3 className="text-2xl font-black text-gray-900">Your Identity</h3>
                                        <p className="text-gray-400 text-sm font-medium">This information will be displayed on your generated news reports and analysis projects.</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Display Username</label>
                                        <div className="relative">
                                            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="text"
                                                defaultValue="John Doe"
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-bold text-gray-900"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input
                                                type="email"
                                                disabled
                                                defaultValue="john.doe@insightpoint.ai"
                                                className="w-full pl-12 pr-6 py-4 bg-gray-100 border border-gray-100 rounded-2xl outline-none text-gray-400 font-bold cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Professional Bio</label>
                                    <textarea
                                        placeholder="Tell us about yourself..."
                                        className="w-full p-6 bg-gray-50/50 border border-gray-100 rounded-[32px] outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all font-medium text-gray-700 h-32 resize-none"
                                        defaultValue="Senior News Analyst and Content Strategist specializing in AI-driven intelligence."
                                    />
                                </div>
                            </motion.section>
                        )}

                        {activeTab === 'security' && (
                            <motion.section
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white p-10 rounded-[48px] border border-gray-100 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Security & Authentication</h3>
                                            <p className="text-sm text-gray-400 font-medium">Protect your account with modern security measures.</p>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2.5 rounded-xl bg-gray-50 text-gray-500 font-bold hover:bg-gray-100 transition-all text-sm">
                                        Full Security Settings
                                    </button>
                                </div>

                                <div className="grid gap-4">
                                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                                                <Lock size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Account Password</p>
                                                <p className="text-xs text-gray-400">Last changed 3 months ago</p>
                                            </div>
                                        </div>
                                        <button className="text-primary font-black text-sm hover:underline">Change Password</button>
                                    </div>

                                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-success shadow-sm">
                                                <ShieldCheck size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900">Two-Factor Authentication</p>
                                                <p className="text-xs text-green-500 font-bold">Currently Enabled</p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 font-black text-sm hover:text-red-500 transition-colors">Disable</button>
                                    </div>
                                </div>
                            </motion.section>
                        )}

                        {['notifications', 'billing', 'appearance'].includes(activeTab) && (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white p-20 rounded-[48px] border border-gray-100 shadow-sm text-center"
                            >
                                <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-6 text-gray-300">
                                    {sidebarItems.find(i => i.id === activeTab)?.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{sidebarItems.find(i => i.id === activeTab)?.label}</h3>
                                <p className="text-gray-500">This section is coming soon. Stay tuned for updates!</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
