import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import {
    Mail,
    Lock,
    Phone,
    ArrowRight,
    Github,
    Chrome,
    ShieldCheck,
    ChevronLeft,
    Loader2
} from 'lucide-react';

export default function Login({ onLogin, onSwitchToRegister }) {
    const [method, setMethod] = useState('email'); // 'email', 'phone'
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const response = await api.login(formData.username, formData.password);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setIsLoading(false);
            onLogin();
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F9FAFB] relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-lg bg-white rounded-[48px] shadow-2xl shadow-indigo-500/10 border border-gray-100 p-10 md:p-12 z-10 relative overflow-hidden"
            >
                {/* Progress Bar for loading */}
                {isLoading && (
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        className="absolute top-0 left-0 h-1 bg-primary z-20"
                    />
                )}

                <div className="text-center mb-10">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-6 shadow-xl border-4 border-white">
                        <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h1>
                    <p className="text-gray-500 font-medium">Please enter your details to continue</p>
                </div>

                {/* Auth Methods */}
                <div className="flex p-1.5 bg-gray-50 rounded-2xl mb-8">
                    <button
                        onClick={() => setMethod('email')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${method === 'email' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Email Access
                    </button>
                    <button
                        onClick={() => setMethod('phone')}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${method === 'phone' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        Phone Number
                    </button>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <AnimatePresence mode="wait">
                        {method === 'email' ? (
                            <motion.div
                                key="email"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            placeholder="johndoe"
                                            required
                                            value={formData.username}
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-900"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Password</label>
                                        <button type="button" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Forgot?</button>
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-900"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl border border-red-100 italic">
                                        ⚠️ {error}
                                    </p>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="phone"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-2"
                            >
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3 mr-3 text-gray-500 font-bold">
                                        <img src="https://flagcdn.com/w20/in.png" alt="IN" className="w-5 rounded-sm" />
                                        +91
                                    </div>
                                    <input
                                        type="tel"
                                        placeholder="98765-43210"
                                        required
                                        className="w-full pl-28 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-900"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4 disabled:opacity-70"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                {/* Divider */}
                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-300">
                        <span className="bg-white px-4">Or continue with</span>
                    </div>
                </div>

                {/* Social Auth */}
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={onLogin}
                        className="w-full flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all group"
                    >
                        <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
                        Continue with Google
                    </button>
                    <button
                        type="button"
                        onClick={onLogin}
                        className="w-full flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all group"
                    >
                        <Github size={20} className="group-hover:scale-110 transition-transform" />
                        Continue with GitHub
                    </button>
                </div>

                <p className="text-center mt-10 text-sm font-medium text-gray-500">
                    Don't have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToRegister}
                        className="text-primary font-black hover:underline"
                    >
                        Create Account
                    </button>
                </p>
            </motion.div>

            {/* Footer Info */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-xs font-bold text-gray-300 uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-gray-200" />
                    Enterprise Grade Security Protocol
                </p>
            </div>
        </div>
    );
}
