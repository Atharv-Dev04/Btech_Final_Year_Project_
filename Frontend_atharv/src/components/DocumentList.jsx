import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, ExternalLink, Search, Clock, Loader2, AlertCircle, AlertTriangle, X } from 'lucide-react';
import { api } from '../services/api';

export default function DocumentList() {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [docToDelete, setDocToDelete] = useState(null); // Document object to delete
    const fetchedRef = useRef(false);

    const fetchDocuments = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.listDocuments();
            if (response.status === 'success') {
                setDocuments(response.data.documents || []);
            } else {
                setError(response.message || 'Failed to fetch documents');
            }
        } catch (err) {
            console.error('Error fetching documents:', err);
            setError('Could not connect to the server. Please check if the backend is running.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        fetchDocuments();
    }, []);

    const handleDeleteClick = (doc) => {
        setDocToDelete(doc);
    };

    const confirmDelete = async () => {
        if (!docToDelete) return;
        
        setIsDeleting(true);
        try {
            await api.deleteDocument(docToDelete.document_id);
            // hard refresh effect by refetching
            await fetchDocuments();
            setDocToDelete(null);
        } catch (err) {
            console.error('Delete error:', err);
            alert('Failed to delete document: ' + err.message);
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredDocuments = documents.filter(doc => 
        doc.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.text_preview?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            {/* Custom Modern Deletion Modal */}
            <AnimatePresence>
                {docToDelete && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setDocToDelete(null)}
                            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 p-8"
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                                    <AlertTriangle size={40} className="text-red-500" />
                                </div>
                                
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Document?</h3>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    Are you sure you want to delete <span className="font-bold text-gray-700">"{docToDelete.filename || 'this document'}"</span>? This action cannot be undone.
                                </p>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <button
                                        disabled={isDeleting}
                                        onClick={() => setDocToDelete(null)}
                                        className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-2xl transition-all disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        disabled={isDeleting}
                                        onClick={confirmDelete}
                                        className="px-6 py-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete Now'
                                        )}
                                    </button>
                                </div>
                            </div>

                            <button 
                                onClick={() => !isDeleting && setDocToDelete(null)}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-all"
                            >
                                <X size={20} />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h2>
                    <p className="text-gray-500">Manage and browse your uploaded news articles and reports.</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full md:w-64 shadow-sm"
                    />
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p className="font-semibold">{error}</p>
                    <button onClick={fetchDocuments} className="ml-auto underline text-xs">Retry</button>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-50 bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Name</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Upload Date</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Sentiment</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Source</th>
                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <Loader2 size={40} className="animate-spin text-primary" />
                                            <p className="font-medium">Loading documents...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredDocuments.length > 0 ? (
                                filteredDocuments.map((doc, i) => (
                                    <motion.tr
                                        key={doc.document_id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="hover:bg-gray-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 line-clamp-1">{doc.filename || 'Untitled Text'}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">{doc.text_preview?.substring(0, 40)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-gray-500 font-medium whitespace-nowrap">
                                                <Clock size={16} />
                                                {formatDate(doc.timestamp)}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest border ${
                                                doc.sentiment === 'positive' ? 'bg-green-50 text-green-600 border-green-100' :
                                                doc.sentiment === 'negative' ? 'bg-red-50 text-red-600 border-red-100' :
                                                'bg-gray-100 text-gray-500 border-gray-200'
                                            }`}>
                                                {doc.sentiment || 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 font-semibold text-gray-400 uppercase text-[10px] tracking-wider">
                                            {doc.source}
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="View Analysis">
                                                    <ExternalLink size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(doc)}
                                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" 
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3 text-gray-400">
                                            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-2">
                                                <FileText size={32} />
                                            </div>
                                            <p className="font-bold text-gray-900">No documents found</p>
                                            <p className="text-sm max-w-[250px] mx-auto">Upload a file or paste text in the "Upload Document" tab to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
