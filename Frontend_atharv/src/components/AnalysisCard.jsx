import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, FileText, Upload, Sparkles, Loader2, FileCheck, AlertCircle, X, Type, Edit3, ChevronDown } from 'lucide-react';
import { api } from '../services/api';

export default function AnalysisCard({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('upload');
    const [isUploading, setIsUploading] = useState(false);
    const [text, setText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [saveAsFileName, setSaveAsFileName] = useState('');
    const [saveAsFormat, setSaveAsFormat] = useState('txt');
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);
            setError('');
            // Reset input to allow selecting the same file again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault(); // Prevent flicker
        if (e.currentTarget.contains(e.relatedTarget)) return; // Only leave if leaving the component
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setSelectedFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]);
            setError('');
        }
    };

    const removeFile = (indexToRemove) => {
        setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setError('');
        setSuccess('');
    };


    const handleAnalyze = async () => {
        setIsUploading(true);
        setError('');
        setSuccess('');

        try {
            if (activeTab === 'upload') {
                if (selectedFiles.length === 0) throw new Error('Please select at least one file');

                let successCount = 0;
                for (const file of selectedFiles) {
                    await api.uploadDocument(file);
                    successCount++;
                }
                setSuccess(`Successfully uploaded ${successCount} document${successCount !== 1 ? 's' : ''}!`);
            } else {
                if (!text.trim()) throw new Error('Please paste some text first');

                // Create a virtual file to upload so it has a name and extension
                const fileName = saveAsFileName.trim() || 'pasted-document';
                const file = new File([text], `${fileName}.${saveAsFormat}`, {
                    type: saveAsFormat === 'txt' ? 'text/plain' :
                        saveAsFormat === 'pdf' ? 'application/pdf' :
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
                });

                await api.uploadDocument(file);
                setSuccess(`Document saved as ${fileName}.${saveAsFormat} successfully!`);
            }

            // Redirect to Document List after short delay
            if (onNavigate) {
                setTimeout(() => onNavigate('documents'), 1500);
            }
        } catch (err) {
            setError(err.message || 'Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto mb-20"
        >
            <div className="bg-[#0f172a]/40 backdrop-blur-xl rounded-[40px] border border-white/10 overflow-hidden shadow-2xl">
                {/* Tabs */}
                <div className="flex border-b border-white/5 bg-white/5">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${activeTab === 'upload'
                            ? 'bg-white/5 text-indigo-400 border-b-2 border-indigo-500 shadow-[inset_0_-2px_0_0_#6366f1]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <CloudUpload size={20} />
                        Upload File
                    </button>
                    <button
                        onClick={() => setActiveTab('paste')}
                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${activeTab === 'paste'
                            ? 'bg-white/5 text-indigo-400 border-b-2 border-indigo-500 shadow-[inset_0_-2px_0_0_#6366f1]'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <FileText size={20} />
                        Paste Text
                    </button>
                </div>

                {/* Content */}
                <div className="p-10">
                    <AnimatePresence mode="wait">
                        {activeTab === 'upload' ? (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="space-y-6"
                            >
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all group cursor-pointer ${isDragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 bg-white/5'
                                        } hover:border-indigo-500/50`}
                                >
                                    <div className="w-full">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                            accept=".pdf,.docx,.txt"
                                            multiple
                                        />

                                        {selectedFiles.length > 0 ? (
                                            <div onClick={(e) => e.stopPropagation()}>
                                                <div className="flex flex-col gap-2 mb-6 max-h-60 overflow-y-auto pr-2">
                                                    {selectedFiles.map((file, idx) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 shadow-sm text-left group/file">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <FileText size={18} className="text-indigo-400 flex-shrink-0" />
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="truncate text-sm font-medium text-white">{file.name}</span>
                                                                    <span className="text-[10px] text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={() => removeFile(idx)}
                                                                className="p-1.5 hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors opacity-0 group-hover/file:opacity-100"
                                                                title="Remove file"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="flex justify-center">
                                                    <button
                                                        className="px-6 py-2.5 rounded-xl text-indigo-400 border-2 border-indigo-500/50 hover:bg-indigo-500 hover:text-white font-bold transition-all"
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        + Add Another File
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div onClick={() => fileInputRef.current?.click()}>
                                                <div className="w-16 h-16 bg-white/5 rounded-2xl shadow-sm border border-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <Upload className="text-indigo-400" size={32} />
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-2">
                                                    Drag & drop your documents here
                                                </h3>
                                                <p className="text-gray-400 mb-6">
                                                    or click to browse your files
                                                </p>
                                                <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 transition-all" type="button">
                                                    Choose Files
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-xs text-gray-400 mt-8">Supported formats: PDF, DOCX, TXT (Max 10MB)</p>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="paste"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="space-y-4"
                            >
                                <div className="relative">
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder="Paste your news article text here..."
                                        className="w-full h-64 p-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-white resize-none transition-all placeholder:text-gray-600"
                                    />
                                    <div className="absolute bottom-4 right-6 text-xs font-medium text-gray-400">
                                        {text.length} characters
                                    </div>
                                </div>

                                {/* Save As Settings */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Edit3 size={12} className="text-indigo-400" />
                                            Document Name
                                        </label>
                                        <input
                                            type="text"
                                            value={saveAsFileName}
                                            onChange={(e) => setSaveAsFileName(e.target.value)}
                                            placeholder="e.g. my-morning-report"
                                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-white shadow-sm transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Type size={12} className="text-indigo-400" />
                                            Save Format
                                        </label>
                                        <div className="relative">
                                            <select
                                                value={saveAsFormat}
                                                onChange={(e) => setSaveAsFormat(e.target.value)}
                                                className="w-full p-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-bold text-white shadow-sm transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="txt" className="bg-[#0f172a]">Plain Text (.txt)</option>
                                                <option value="pdf" className="bg-[#0f172a]">PDF Document (.pdf)</option>
                                                <option value="docx" className="bg-[#0f172a]">Word Document (.docx)</option>
                                            </select>
                                            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Status Messages */}
                    {(error || success) && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${error ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                }`}
                        >
                            {error ? <AlertCircle size={20} /> : <FileCheck size={20} />}
                            <p className="text-sm font-semibold">{error || success}</p>
                        </motion.div>
                    )}

                    {/* Progress Bar (Visible when uploading) */}
                    <div className={`mt-8 transition-all duration-500 overflow-hidden ${isUploading ? 'h-1.5' : 'h-0'}`}>
                        <div className="w-full bg-white/5 rounded-full h-full">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={isUploading ? { width: '100%' } : { width: 0 }}
                                transition={{ duration: 2 }}
                                className="bg-indigo-600 h-full rounded-full"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={handleAnalyze}
                            disabled={isUploading}
                            className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black text-xl flex items-center gap-3 relative overflow-hidden group shadow-xl shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 size={24} className="animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={24} />
                                    Upload Now
                                </>
                            )}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex items-center justify-center gap-8 text-gray-500 grayscale opacity-30">
                <span className="text-sm font-bold tracking-widest uppercase">Trusted By</span>
                <div className="flex gap-6 items-center">
                    <div className="h-4 w-24 bg-white/10 rounded" />
                    <div className="h-4 w-20 bg-white/10 rounded" />
                    <div className="h-4 w-28 bg-white/10 rounded" />
                </div>
            </div>
        </motion.div>
    );
}
