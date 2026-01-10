import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, FileText, Upload, Sparkles, Loader2, FileCheck, AlertCircle, X } from 'lucide-react';
import { api } from '../services/api';

export default function AnalysisCard({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('upload');
    const [isUploading, setIsUploading] = useState(false);
    const [text, setText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
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
                await api.uploadText(text);
                setSuccess('Document saved successfully!');
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
            <div className="card overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                    <button
                        onClick={() => setActiveTab('upload')}
                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${activeTab === 'upload'
                                ? 'bg-white text-primary border-b-2 border-primary'
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <CloudUpload size={20} />
                        Upload File
                    </button>
                    <button
                        onClick={() => setActiveTab('paste')}
                        className={`flex-1 py-4 px-6 flex items-center justify-center gap-2 font-semibold transition-all ${activeTab === 'paste'
                                ? 'bg-white text-primary border-b-2 border-primary'
                                : 'text-gray-400 hover:text-gray-600'
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
                                    className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all group cursor-pointer ${
                                        isDragging ? 'border-primary bg-primary/5' : 'border-gray-200 bg-gray-50/30'
                                    } hover:border-primary/50`}
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
                                                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100 shadow-sm text-left group/file">
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                <FileText size={18} className="text-primary flex-shrink-0" />
                                                                <div className="flex flex-col min-w-0">
                                                                    <span className="truncate text-sm font-medium text-gray-700">{file.name}</span>
                                                                    <span className="text-[10px] text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                                                </div>
                                                            </div>
                                                            <button 
                                                                onClick={() => removeFile(idx)}
                                                                className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors opacity-0 group-hover/file:opacity-100"
                                                                title="Remove file"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <div className="flex justify-center">
                                                    <button 
                                                        className="btn-primary bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white" 
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                    >
                                                        + Add Another File
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div onClick={() => fileInputRef.current?.click()}>
                                                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                                    <Upload className="text-primary" size={32} />
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                                    Drag & drop your documents here
                                                </h3>
                                                <p className="text-gray-400 mb-6">
                                                    or click to browse your files
                                                </p>
                                                <button className="btn-primary" type="button">
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
                                        className="w-full h-64 p-6 bg-gray-50/30 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-700 resize-none transition-all"
                                    />
                                    <div className="absolute bottom-4 right-6 text-xs font-medium text-gray-400">
                                        {text.length} characters
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
                            className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${
                                error ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                            }`}
                        >
                            {error ? <AlertCircle size={20} /> : <FileCheck size={20} />}
                            <p className="text-sm font-semibold">{error || success}</p>
                        </motion.div>
                    )}

                    {/* Progress Bar (Visible when uploading) */}
                    <div className={`mt-8 transition-all duration-500 overflow-hidden ${isUploading ? 'h-1.5' : 'h-0'}`}>
                        <div className="w-full bg-gray-100 rounded-full h-full">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={isUploading ? { width: '100%' } : { width: 0 }}
                                transition={{ duration: 2 }} 
                                className="bg-primary h-full rounded-full"
                            />
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={handleAnalyze}
                            disabled={isUploading}
                            className="btn-success flex items-center gap-3 relative overflow-hidden group"
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
            <div className="mt-8 flex items-center justify-center gap-8 text-gray-400 grayscale opacity-50">
                <span className="text-sm font-bold tracking-widest uppercase">Trusted By</span>
                <div className="flex gap-6 items-center">
                    <div className="h-4 w-24 bg-gray-300 rounded" />
                    <div className="h-4 w-20 bg-gray-300 rounded" />
                    <div className="h-4 w-28 bg-gray-300 rounded" />
                </div>
            </div>
        </motion.div>
    );
}
