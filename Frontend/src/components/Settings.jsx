import { useState, useRef, useEffect } from 'react';
import { api } from '../services/api';
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
    Monitor,
    Phone,
    FileText,
    Eye,
    EyeOff
} from 'lucide-react';

export default function Settings() {
    const [activeTab, setActiveTab] = useState('profile');
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        phone: '',
        bio: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.getMe();
                // Assuming response.data contains the user object or response itself is the user object
                // Adjust based on actual API structure. Usually it's response.data or response
                const user = response.data || response;
                setUserData({
                    username: user.username || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    bio: user.bio || ''
                });
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };
        fetchUserData();
    }, []);

    // Password change states
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwords, setPasswords] = useState({
        old: '',
        new: '',
        confirm: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const sidebarItems = [
        { id: 'profile', label: 'Profile Information', icon: <User size={18} /> },
        { id: 'security', label: 'Security & Password', icon: <Lock size={18} /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
        { id: 'billing', label: 'Billing & Plan', icon: <CreditCard size={18} /> },
        { id: 'appearance', label: 'Appearance', icon: <Monitor size={18} /> },
    ];

    const getInitials = (name) => {
        return name ? name.charAt(0).toUpperCase() : 'U';
    };



    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSaving, setIsSaving] = useState(false);

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setStatus({ type: '', message: '' });
        try {
            await api.updateUser(userData);
            setStatus({ type: 'success', message: 'Profile updated! Refreshing...' });

            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            console.error("Failed to update profile", error);
            setStatus({ type: 'error', message: error.message || 'Failed to update profile. Please check connection.' });
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-white pb-20 pt-32 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Account Settings</h1>
                        <p className="text-gray-400 text-lg">Manage your profile, account preferences, and security.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-8 py-3 rounded-2xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save size={18} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {status.message && (
                    <div className={`mb-8 p-4 rounded-2xl font-bold border ${status.type === 'success'
                        ? 'bg-green-500/10 border-green-500/20 text-green-400'
                        : 'bg-red-500/10 border-red-500/20 text-red-400'
                        }`}>
                        {status.message}
                    </div>
                )}

                <div className="grid lg:grid-cols-[280px,1fr] gap-12">
                    {/* Navigation Sidebar */}
                    <aside className="space-y-2">
                        <nav className="space-y-1">
                            {sidebarItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === item.id
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
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
                    </aside>

                    {/* Form Content */}
                    <div className="min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.section
                                    key="profile"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[48px] border border-white/10 shadow-2xl space-y-10"
                                >
                                    <div className="flex flex-col md:flex-row gap-10">
                                        <div className="relative group mx-auto md:mx-0">
                                            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white/10 bg-indigo-600 flex items-center justify-center text-5xl font-black text-white shadow-xl">
                                                {getInitials(userData.username)}
                                            </div>
                                            <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#0f172a] group-hover:scale-110 transition-transform">
                                                <Camera size={18} />
                                            </button>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <h3 className="text-2xl font-black text-white">Your Identity</h3>
                                            <p className="text-gray-400 text-sm font-medium">This information will be displayed on your generated news reports and analysis projects.</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Display Username</label>
                                            <div className="relative group">
                                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                                <input
                                                    type="text"
                                                    value={userData.username}
                                                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white/10 transition-all font-bold text-white placeholder-gray-600"
                                                    placeholder="Enter username"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Phone Number</label>
                                            <div className="relative group">
                                                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                                <input
                                                    type="tel"
                                                    value={userData.phone}
                                                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white/10 transition-all font-bold text-white placeholder-gray-600"
                                                    placeholder="Enter phone number"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3 md:col-span-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                                <input
                                                    type="email"
                                                    disabled
                                                    value={userData.email}
                                                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none text-gray-500 font-bold cursor-not-allowed opacity-50"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] px-1">Professional Bio</label>
                                        <div className="relative group">
                                            <FileText size={18} className="absolute left-4 top-6 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                            <textarea
                                                placeholder="Tell us about yourself..."
                                                value={userData.bio}
                                                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                                                className="w-full pl-12 pr-6 py-6 bg-white/5 border border-white/10 rounded-[32px] outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white/10 transition-all font-medium text-gray-300 h-32 resize-none"
                                            />
                                        </div>
                                    </div>
                                </motion.section>
                            )}

                            {activeTab === 'security' && (
                                <motion.section
                                    key="security"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[48px] border border-white/10 shadow-2xl space-y-8"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                                                <ShieldCheck size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Security & Authentication</h3>
                                                <p className="text-sm text-gray-400 font-medium">Protect your account with modern security measures.</p>
                                            </div>
                                        </div>
                                        <button className="px-5 py-2.5 rounded-xl bg-white/5 text-gray-400 font-bold hover:text-white hover:bg-white/10 transition-all text-sm border border-white/10">
                                            Full Security Settings
                                        </button>
                                    </div>

                                    <div className="grid gap-4">
                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all overflow-hidden group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center text-gray-400 shadow-inner group-hover:text-indigo-400 transition-colors">
                                                    <Lock size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">Account Password</p>
                                                    <p className="text-xs text-gray-500 font-medium">Last changed 3 months ago</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowPasswordModal(true)}
                                                className="text-indigo-400 font-black text-sm hover:underline"
                                            >
                                                Change Password
                                            </button>
                                        </div>

                                        <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between hover:bg-white/10 transition-all overflow-hidden group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-[#0f172a] rounded-xl flex items-center justify-center text-green-400 shadow-inner">
                                                    <ShieldCheck size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white">Two-Factor Authentication</p>
                                                    <p className="text-xs text-green-500 font-bold">Currently Enabled</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-500 font-black text-sm hover:text-red-500 transition-colors">Disable</button>
                                        </div>
                                    </div>
                                </motion.section>
                            )}

                            {['notifications', 'billing', 'appearance'].includes(activeTab) && (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white/5 backdrop-blur-md p-20 rounded-[48px] border border-white/10 shadow-2xl text-center"
                                >
                                    <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-8 text-gray-500 border border-white/10">
                                        {sidebarItems.find(i => i.id === activeTab)?.icon}
                                    </div>
                                    <h3 className="text-3xl font-black text-white mb-3">{sidebarItems.find(i => i.id === activeTab)?.label}</h3>
                                    <p className="text-gray-400 text-lg font-medium">This section is coming soon. Stay tuned for updates!</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Change Password Modal */}
                <AnimatePresence>
                    {showPasswordModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowPasswordModal(false)}
                                className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative w-full max-w-lg bg-[#1e293b] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-10 z-[101]"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h3 className="text-2xl font-black text-white">Change Password</h3>
                                        <p className="text-gray-400 text-sm font-medium">Update your account security credentials.</p>
                                    </div>
                                    <button
                                        onClick={() => setShowPasswordModal(false)}
                                        className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-400 hover:text-white transition-all border border-white/10"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { id: 'old', label: 'Old Password' },
                                        { id: 'new', label: 'New Password' },
                                        { id: 'confirm', label: 'Confirm Password' }
                                    ].map((field) => (
                                        <div key={field.id} className="space-y-2">
                                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">{field.label}</label>
                                            <div className="relative group">
                                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                                                <input
                                                    type={showPasswords[field.id] ? 'text' : 'password'}
                                                    value={passwords[field.id]}
                                                    onChange={(e) => setPasswords({ ...passwords, [field.id]: e.target.value })}
                                                    placeholder="min 8 characters"
                                                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:bg-white/10 transition-all font-bold text-white placeholder-gray-600"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => togglePasswordVisibility(field.id)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors p-1"
                                                >
                                                    {showPasswords[field.id] ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-4 mt-10">
                                    <button
                                        onClick={() => setShowPasswordModal(false)}
                                        className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white rounded-2xl font-black border border-white/10 hover:bg-white/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            console.log('Changing password...', passwords);
                                            setShowPasswordModal(false);
                                        }}
                                        className="w-full flex-1 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                                    >
                                        <ShieldCheck size={20} />
                                        Update Password
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
