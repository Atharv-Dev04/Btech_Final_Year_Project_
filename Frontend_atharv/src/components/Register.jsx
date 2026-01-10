import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import {
    Mail,
    Lock,
    User,
    ArrowRight,
    ArrowLeft,
    Chrome,
    Github,
    ShieldCheck,
    CheckCircle2,
    Phone,
    Briefcase
} from 'lucide-react';

export default function Register({ onRegister, onSwitchToLogin }) {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        fullName: '',
        phone: ''
    });
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        
        if (step < 2) {
            setStep(step + 1);
            return;
        }

        setIsLoading(true);
        try {
            await api.register(formData.username, formData.email, formData.password);
            // After register, we usually want to login automatically or redirect to login
            const loginRes = await api.login(formData.username, formData.password);
            localStorage.setItem('token', loginRes.data.token);
            localStorage.setItem('user', JSON.stringify(loginRes.data.user));
            setIsLoading(false);
            onRegister();
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F9FAFB] relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-xl bg-white rounded-[48px] shadow-2xl shadow-indigo-500/10 border border-gray-100 p-10 md:p-12 z-10 relative"
            >
                <div className="flex items-center justify-between mb-10">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg border-2 border-white">
                        <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                        {[1, 2].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'w-8 bg-primary' : 'w-4 bg-gray-100'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="mb-10">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">
                        {step === 1 ? 'Create your account' : 'Professional Profile'}
                    </h1>
                    <p className="text-gray-500 font-medium">
                        {step === 1 ? 'Join 10k+ analysts scaling their intelligence.' : 'Help us personalize your analysis experience.'}
                    </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Username</label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
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
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                            <input
                                                type="email"
                                                placeholder="name@company.com"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-900"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Create Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="password"
                                            placeholder="Min. 8 characters"
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
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Occupation / Role</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <select className="w-full pl-12 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-gray-900 appearance-none">
                                            <option>News Analyst</option>
                                            <option>Academic Researcher</option>
                                            <option>Content Creator</option>
                                            <option>Business Executive</option>
                                            <option>Student</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Interests</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Politics', 'Tech', 'Finance', 'Global News', 'Sports', 'Climate'].map((interest) => (
                                            <button
                                                key={interest}
                                                type="button"
                                                className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-500 hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all"
                                            >
                                                {interest}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-start gap-4 mt-6">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm shrink-0">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">Automated Intelligence</h4>
                                        <p className="text-xs text-indigo-600/80 font-medium">By completing registration, you'll gain access to our custom AI extraction models.</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="flex gap-4 mt-8">
                        {step > 1 && (
                            <button
                                type="button"
                                onClick={() => setStep(step - 1)}
                                className="w-20 py-4 border border-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-50 transition-all text-gray-400"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {isLoading ? 'Processing...' : (
                                <>
                                    {step === 1 ? 'Continue' : 'Complete Registration'}
                                    <ArrowRight size={step === 1 ? 20 : 0} />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* Divider */}
                <div className="relative my-10">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold text-gray-300">
                        <span className="bg-white px-4">Or sign up with</span>
                    </div>
                </div>

                {/* Social Register */}
                <div className="space-y-4">
                    <button
                        type="button"
                        onClick={onRegister}
                        className="w-full flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all group"
                    >
                        <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
                        Continue with Google
                    </button>
                    <button
                        type="button"
                        onClick={onRegister}
                        className="w-full flex items-center justify-center gap-3 py-4 border border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all group"
                    >
                        <Github size={20} className="group-hover:scale-110 transition-transform" />
                        Continue with GitHub
                    </button>
                </div>

                <p className="text-center mt-10 text-sm font-medium text-gray-500">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={onSwitchToLogin}
                        className="text-primary font-black hover:underline"
                    >
                        Sign In
                    </button>
                </p>
            </motion.div>

            <div className="absolute top-10 left-10 hidden lg:block">
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] [writing-mode:vertical-lr] rotate-180">
                    Secure Registration Portal
                </p>
            </div>
        </div>
    );
}
