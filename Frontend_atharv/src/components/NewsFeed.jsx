import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Globe,
    Trophy,
    Film,
    Cpu,
    TrendingUp,
    Clock,
    ExternalLink,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Newspaper,
    Loader2,
    AlertCircle,
    RefreshCw,
    Filter,
    X,
    MapPin,
    Languages
} from 'lucide-react';
import { api } from '../services/api';

const CATEGORIES = [
    { id: 'all', label: 'All News', icon: <Newspaper size={16} /> },
    { id: 'sports', label: 'Sports', icon: <Trophy size={16} /> },
    { id: 'entertainment', label: 'Entertainment', icon: <Film size={16} /> },
    { id: 'technology', label: 'Technology', icon: <Cpu size={16} /> },
    { id: 'disaster', label: 'Disaster', icon: <AlertCircle size={16} /> },
    { id: 'terror', label: 'Terror', icon: <TrendingUp size={16} /> },
];

const HIERARCHICAL_FILTERS = {
    continents: [
        { code: 'all', name: 'All Continents', icon: '🌍' },
        { code: 'asia', name: 'Asia', icon: '🌏' },
        { code: 'europe', name: 'Europe', icon: '🇪🇺' },
        { code: 'americas', name: 'Americas', icon: '🌎' },
        { code: 'global', name: 'Global', icon: '🌐' },
    ],
    countries: {
        all: [
            { code: 'all', name: 'All Countries' },
            { code: 'india', name: 'India' },
            { code: 'china', name: 'China' },
            { code: 'netherlands', name: 'Netherlands' },
            { code: 'indonesia', name: 'Indonesia' },
            { code: 'middle_east', name: 'Middle East' },
            { code: 'europe', name: 'Europe' },
            { code: 'americas', name: 'Americas' },
            { code: 'global', name: 'Global' },
        ],
        asia: [
            { code: 'all', name: 'All countries in Asia' },
            { code: 'india', name: 'India' },
            { code: 'china', name: 'China' },
            { code: 'indonesia', name: 'Indonesia' },
            { code: 'middle_east', name: 'Middle East' },
        ],
        europe: [
            { code: 'all', name: 'All countries in Europe' },
            { code: 'netherlands', name: 'Netherlands' },
            { code: 'europe', name: 'Other Europe' },
        ],
        americas: [
            { code: 'all', name: 'All countries in Americas' },
            { code: 'americas', name: 'Americas (Region)' },
        ],
        global: [
            { code: 'all', name: 'All Global Sources' },
            { code: 'global', name: 'Global' },
        ],
    },
    languages: {
        all: [
            { code: 'all', name: 'All Languages' },
            { code: 'en', name: 'English' },
            { code: 'hi', name: 'Hindi (हिन्दी)' },
            { code: 'zh', name: 'Chinese (中文)' },
            { code: 'ar', name: 'Arabic (العربية)' },
            { code: 'fr', name: 'French (Français)' },
            { code: 'es', name: 'Spanish (Español)' },
            { code: 'nl', name: 'Dutch (Nederlands)' },
            { code: 'id', name: 'Indonesian (Bahasa)' },
        ],
        india: [
            { code: 'all', name: 'All Languages (India)' },
            { code: 'en', name: 'English' },
            { code: 'hi', name: 'Hindi (हिन्दी)' },
        ],
        china: [
            { code: 'all', name: 'All Languages (China)' },
            { code: 'zh', name: 'Chinese (中文)' },
            { code: 'en', name: 'English' },
        ],
        indonesia: [
            { code: 'all', name: 'All Languages (Indonesia)' },
            { code: 'id', name: 'Indonesian (Bahasa)' },
            { code: 'en', name: 'English' },
        ],
        netherlands: [
            { code: 'all', name: 'All Languages (Netherlands)' },
            { code: 'nl', name: 'Dutch (Nederlands)' },
            { code: 'en', name: 'English' },
        ],
        middle_east: [
            { code: 'all', name: 'All Languages (Middle East)' },
            { code: 'ar', name: 'Arabic (العربية)' },
            { code: 'en', name: 'English' },
        ],
    },
    sources: {
        all: [
            { code: 'all', name: 'All Sources' },
            { code: 'BBC India (English)', name: 'BBC India (English)' },
            { code: 'BBC Hindi', name: 'BBC Hindi' },
            { code: 'BBC Chinese', name: 'BBC Chinese' },
            { code: 'BBC Arabic', name: 'BBC Arabic' },
            { code: 'BBC Middle East (English)', name: 'BBC Middle East' },
            { code: 'BBC Afrique (French)', name: 'BBC Afrique' },
            { code: 'BBC Europe (English)', name: 'BBC Europe' },
            { code: 'BBC Mundo', name: 'BBC Mundo (Spanish)' },
            { code: 'BBC Americas (English)', name: 'BBC Americas' },
            { code: 'BBC Indonesia', name: 'BBC Indonesia' },
            { code: 'BBC World News (English)', name: 'BBC World News' },
        ],
        hi: [
            { code: 'all', name: 'All Hindi Sources' },
            { code: 'BBC Hindi', name: 'BBC India (Hindi)' },
        ],
        zh: [
            { code: 'all', name: 'All Chinese Sources' },
            { code: 'BBC Chinese', name: 'BBC Chinese' },
        ],
        en: {
            india: [
                { code: 'all', name: 'All English Sources (India)' },
                { code: 'BBC India (English)', name: 'BBC India (English)' },
            ],
            europe: [
                { code: 'all', name: 'All English Sources (Europe)' },
                { code: 'BBC Europe (English)', name: 'BBC Europe' },
            ],
            americas: [
                { code: 'all', name: 'All English Sources (Americas)' },
                { code: 'BBC Americas (English)', name: 'BBC Americas' },
            ],
            global: [
                { code: 'all', name: 'All English Sources (Global)' },
                { code: 'BBC World News (English)', name: 'BBC World News' },
            ],
            'middle_east': [
                { code: 'all', name: 'All English Sources (Middle East)' },
                { code: 'BBC Middle East (English)', name: 'BBC Middle East' },
            ]
        }
    }
};

export default function NewsFeed() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        itemsPerPage: 25,
        totalLoaded: 0,
        hasMore: false,
        cursor: null,
        cursorHistory: [] // Track cursors for backward navigation
    });
    const fetchingRef = useRef(false);
    const hasFetchedRef = useRef(false);

    // Filter states
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        continent: 'all',
        country: 'all',
        language: 'all',
        source: 'all',
        analyzedOnly: false
    });
    // Temporary filter state (before Apply is clicked)
    const [tempFilters, setTempFilters] = useState({
        continent: 'all',
        country: 'all',
        language: 'all',
        source: 'all',
        analyzedOnly: false
    });

    const handleArticleClick = (article) => {
        navigate(`/article/${article._id}`);
    };

    // Fetch news from backend
    const fetchNews = async (cursor = null, isNext = true, overrideLimit = null) => {
        // Prevent duplicate calls
        if (fetchingRef.current) {
            console.log('Fetch already in progress, skipping...');
            return;
        }

        fetchingRef.current = true;
        setLoading(true);
        setError(null);

        // Clear news when paginating to avoid showing stale content
        if (cursor !== null) {
            setNews([]);
        }

        try {
            // Helper to expand 'all' selection into explicit options
            const getExpandedOptions = (key) => {
                if (filters[key] !== 'all') return [filters[key]];

                // Get all available options based on current parent selections
                if (key === 'continent') {
                    return HIERARCHICAL_FILTERS.continents.filter(c => c.code !== 'all').map(c => c.code);
                }
                if (key === 'country') {
                    const available = HIERARCHICAL_FILTERS.countries[filters.continent] || HIERARCHICAL_FILTERS.countries.all;
                    return available.filter(c => c.code !== 'all').map(c => c.code);
                }
                if (key === 'language') {
                    const available = HIERARCHICAL_FILTERS.languages[filters.country] || HIERARCHICAL_FILTERS.languages.all;
                    return available.filter(l => l.code !== 'all').map(l => l.code);
                }
                if (key === 'source') {
                    // Similar to the inline helper in the render method
                    const getAvailableSources = () => {
                        let baseSources = HIERARCHICAL_FILTERS.sources.all;
                        if (filters.language !== 'all') {
                            const langSources = HIERARCHICAL_FILTERS.sources[filters.language];
                            if (filters.language === 'en' && typeof langSources === 'object' && !Array.isArray(langSources)) {
                                baseSources = langSources[filters.country] || langSources.global || HIERARCHICAL_FILTERS.sources.all;
                            } else {
                                baseSources = langSources || HIERARCHICAL_FILTERS.sources.all;
                            }
                        } else if (filters.country !== 'all') {
                            const countryLangs = HIERARCHICAL_FILTERS.languages[filters.country] || [];
                            const sources = new Set();
                            countryLangs.forEach(l => {
                                if (l.code === 'all') return;
                                const langSources = HIERARCHICAL_FILTERS.sources[l.code];
                                if (l.code === 'en' && typeof langSources === 'object') {
                                    (langSources[filters.country] || []).forEach(s => sources.add(s.code));
                                } else {
                                    (langSources || []).forEach(s => sources.add(s.code));
                                }
                            });
                            baseSources = HIERARCHICAL_FILTERS.sources.all.filter(s => sources.has(s.code));
                        }
                        return baseSources;
                    };
                    return getAvailableSources().filter(s => s.code !== 'all').map(s => s.code);
                }
                return [];
            };

            const params = {
                limit: overrideLimit || pagination.itemsPerPage,
                continent: getExpandedOptions('continent'),
                country: getExpandedOptions('country'),
                language: getExpandedOptions('language'),
                source: getExpandedOptions('source')
            };

            // Add category filter if not 'all'
            if (activeCategory !== 'all') {
                params.category = activeCategory;
            }

            // Add analyzed only filter
            if (filters.analyzedOnly) {
                params.analyzed = 'true';
            }

            // Add cursor for pagination
            if (cursor) {
                params.cursor = cursor;
            }

            const response = await api.listNews(params);

            if (response.status === 'success') {
                setNews(response.articles || []);

                // Update pagination with cursor tracking
                setPagination(prev => {
                    const nextItems = response.articles?.length || 0;
                    const isInitialFetch = cursor === null;
                    const total = response.total || (isInitialFetch ? nextItems : prev.totalLoaded + nextItems);

                    return {
                        ...prev,
                        cursor: response.next_cursor || null,
                        hasMore: response.has_more || false,
                        totalLoaded: total,
                        currentPage: isInitialFetch ? 1 : (isNext ? prev.currentPage + 1 : Math.max(1, prev.currentPage - 1)),
                        cursorHistory: isNext
                            ? (isInitialFetch ? [] : [...prev.cursorHistory, cursor])
                            : prev.cursorHistory.slice(0, -1)
                    };
                });
            }
        } catch (err) {
            console.error('Failed to fetch news:', err);
            setError(err.message || 'Failed to load news');
            setNews([]);
        } finally {
            setLoading(false);
            fetchingRef.current = false;
        }
    };

    // Fetch news on component mount and when category changes
    useEffect(() => {
        // Only fetch once on mount
        if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchNews(null);
        }
    }, []);

    // Fetch when category changes
    useEffect(() => {
        // Skip initial render
        if (hasFetchedRef.current) {
            // Reset pagination when category changes
            setPagination(prev => ({
                ...prev,
                currentPage: 1,
                totalLoaded: 0,
                cursorHistory: [],
                cursor: null
            }));
            fetchNews(null, true);
        }
    }, [activeCategory]);

    // Fetch when filters change
    useEffect(() => {
        // Skip initial render
        if (hasFetchedRef.current) {
            // Reset pagination when filters change
            setPagination(prev => ({
                ...prev,
                currentPage: 1,
                totalLoaded: 0,
                cursorHistory: [],
                cursor: null
            }));
            fetchNews(null, true);
        }
    }, [filters]);

    // Filter news based on search query (client-side)
    const filteredNews = useMemo(() => {
        if (!searchQuery) return news;

        return news.filter(article => {
            const title = article.title?.toLowerCase() || '';
            const summary = article.summary?.toLowerCase() || '';
            const query = searchQuery.toLowerCase();

            return title.includes(query) || summary.includes(query);
        });
    }, [news, searchQuery]);

    // Format date/time
    const formatTime = (dateString) => {
        if (!dateString) return 'Recently';

        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 60) return `${diffMins} minutes ago`;
            if (diffHours < 24) return `${diffHours} hours ago`;
            if (diffDays < 7) return `${diffDays} days ago`;

            return date.toLocaleDateString();
        } catch {
            return 'Recently';
        }
    };

    // Get image URL with fallback
    const getImageUrl = (article) => {
        // Use image_url from API if available
        if (article.image_url) {
            return article.image_url;
        }

        // Fallback to category-based placeholder
        const images = {
            world: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
            sports: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800',
            technology: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
            entertainment: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
        };
        return images[article.category] || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800';
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (pagination.hasMore && pagination.cursor) {
            fetchNews(pagination.cursor, true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePreviousPage = () => {
        if (pagination.currentPage > 1) {
            const previousCursor = pagination.cursorHistory[pagination.cursorHistory.length - 2] || null;
            fetchNews(previousCursor, false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleItemsPerPageChange = (newLimit) => {
        setPagination(prev => ({
            ...prev,
            itemsPerPage: newLimit,
            currentPage: 1,
            totalLoaded: 0,
            cursorHistory: []
        }));
        fetchNews(null, true, newLimit);
    };

    const handleRefreshPage = () => {
        setPagination(prev => ({
            ...prev,
            currentPage: 1,
            totalLoaded: 0,
            cursorHistory: []
        }));
        fetchNews(null, true);
    };

    const featuredNews = filteredNews[0];

    return (
        <div className="space-y-12 pb-20 animate-fade-in pt-10">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-red-100 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Live News
                        </span>
                    </div>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">Real-Time News Feed</h2>
                    <p className="text-gray-500 max-w-lg">Stay updated with the latest headlines from around the globe, curated just for you.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search news, topics..."
                            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all shadow-sm"
                        />
                    </div>

                    <button
                        onClick={() => fetchNews(null)}
                        disabled={loading}
                        className="p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all disabled:opacity-50"
                        title="Refresh news"
                    >
                        <RefreshCw size={20} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex items-center gap-2 flex-1 overflow-x-auto">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            disabled={loading}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap border ${activeCategory === cat.id
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105'
                                : 'bg-white border-gray-100 text-gray-500 hover:border-primary/30 hover:text-gray-700'
                                } disabled:opacity-50`}
                        >
                            {cat.icon}
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Filter Toggle Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap border ${showFilters || filters.continent !== 'all' || filters.country !== 'all' || filters.language !== 'all' || filters.source !== 'all' || filters.analyzedOnly
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                >
                    <Filter size={16} />
                    Filters
                    {(filters.continent !== 'all' || filters.country !== 'all' || filters.language !== 'all' || filters.source !== 'all' || filters.analyzedOnly) && (
                        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                    )}
                </button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-indigo-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                                    <Filter size={20} className="text-indigo-600" />
                                    Advanced Filters
                                </h3>
                                <button
                                    onClick={() => {
                                        const clearedFilters = { continent: 'all', country: 'all', language: 'all', source: 'all', analyzedOnly: false };
                                        setTempFilters(clearedFilters);
                                        setFilters(clearedFilters);
                                        setShowFilters(false);
                                    }}
                                    className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>

                            {/* Hierarchical Filter Logic Helpers */}
                            {(() => {
                                const getAvailableCountries = () => HIERARCHICAL_FILTERS.countries[tempFilters.continent] || HIERARCHICAL_FILTERS.countries.all;

                                const getAvailableLanguages = () => {
                                    if (tempFilters.country !== 'all') {
                                        return HIERARCHICAL_FILTERS.languages[tempFilters.country] || HIERARCHICAL_FILTERS.languages.all;
                                    }
                                    if (tempFilters.continent !== 'all') {
                                        // If country is 'all', but continent is selected, show all languages for that continent
                                        const countriesInContinent = HIERARCHICAL_FILTERS.countries[tempFilters.continent] || [];
                                        const languages = new Set(['all']);
                                        countriesInContinent.forEach(c => {
                                            if (c.code === 'all') return;
                                            (HIERARCHICAL_FILTERS.languages[c.code] || []).forEach(l => languages.add(l.code));
                                        });
                                        return HIERARCHICAL_FILTERS.languages.all.filter(l => languages.has(l.code));
                                    }
                                    return HIERARCHICAL_FILTERS.languages.all;
                                };

                                const getAvailableSources = () => {
                                    let baseSources = HIERARCHICAL_FILTERS.sources.all;

                                    if (tempFilters.language !== 'all') {
                                        const langSources = HIERARCHICAL_FILTERS.sources[tempFilters.language];
                                        if (tempFilters.language === 'en' && typeof langSources === 'object' && !Array.isArray(langSources)) {
                                            baseSources = langSources[tempFilters.country] || langSources.global || HIERARCHICAL_FILTERS.sources.all;
                                        } else {
                                            baseSources = langSources || HIERARCHICAL_FILTERS.sources.all;
                                        }
                                    } else if (tempFilters.country !== 'all') {
                                        // Filter by country if language is 'all'
                                        const countryLangs = HIERARCHICAL_FILTERS.languages[tempFilters.country] || [];
                                        const sources = new Set(['all']);
                                        countryLangs.forEach(l => {
                                            if (l.code === 'all') return;
                                            const langSources = HIERARCHICAL_FILTERS.sources[l.code];
                                            if (l.code === 'en' && typeof langSources === 'object') {
                                                (langSources[tempFilters.country] || []).forEach(s => sources.add(s.code));
                                            } else {
                                                (langSources || []).forEach(s => sources.add(s.code));
                                            }
                                        });
                                        baseSources = HIERARCHICAL_FILTERS.sources.all.filter(s => sources.has(s.code));
                                    } else if (tempFilters.continent !== 'all') {
                                        // Filter by continent if country and language are 'all'
                                        const countriesInContinent = HIERARCHICAL_FILTERS.countries[tempFilters.continent] || [];
                                        const sources = new Set(['all']);
                                        countriesInContinent.forEach(c => {
                                            if (c.code === 'all') return;
                                            const countryLangs = HIERARCHICAL_FILTERS.languages[c.code] || [];
                                            countryLangs.forEach(l => {
                                                if (l.code === 'all') return;
                                                const langSources = HIERARCHICAL_FILTERS.sources[l.code];
                                                if (l.code === 'en' && typeof langSources === 'object') {
                                                    (langSources[c.code] || []).forEach(s => sources.add(s.code));
                                                } else {
                                                    (langSources || []).forEach(s => sources.add(s.code));
                                                }
                                            });
                                        });
                                        baseSources = HIERARCHICAL_FILTERS.sources.all.filter(s => sources.has(s.code));
                                    }

                                    return baseSources;
                                };

                                const availableCountries = getAvailableCountries();
                                const availableLanguages = getAvailableLanguages();
                                const availableSources = getAvailableSources();

                                return (
                                    <div className="grid md:grid-cols-3 gap-6">
                                        {/* Continent Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                                <Globe size={14} />
                                                Continent
                                            </label>
                                            <select
                                                value={tempFilters.continent}
                                                onChange={(e) => setTempFilters({
                                                    ...tempFilters,
                                                    continent: e.target.value,
                                                    country: 'all',
                                                    language: 'all',
                                                    source: 'all'
                                                })}
                                                className="w-full p-4 bg-white border border-indigo-100 rounded-xl font-bold text-gray-700 outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                                            >
                                                {HIERARCHICAL_FILTERS.continents.map((continent) => (
                                                    <option key={continent.code} value={continent.code}>
                                                        {continent.icon} {continent.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Country Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                                <MapPin size={14} />
                                                Country/Region
                                            </label>
                                            <select
                                                value={tempFilters.country}
                                                onChange={(e) => {
                                                    const country = e.target.value;
                                                    let continent = tempFilters.continent;

                                                    // Upward inference: Country -> Continent
                                                    if (country === 'india' || country === 'china' || country === 'indonesia') continent = 'asia';
                                                    else if (country === 'netherlands' || country === 'europe') continent = 'europe';
                                                    else if (country === 'americas') continent = 'americas';
                                                    else if (country === 'middle_east') continent = 'asia'; // Middle East mapped to Asia for now
                                                    else if (country === 'global') continent = 'global';

                                                    setTempFilters({
                                                        ...tempFilters,
                                                        continent: continent,
                                                        country: country,
                                                        language: 'all',
                                                        source: 'all'
                                                    });
                                                }}
                                                className="w-full p-4 bg-white border border-indigo-100 rounded-xl font-bold text-gray-700 outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                                            >
                                                {availableCountries.map((country) => (
                                                    <option key={country.code} value={country.code}>
                                                        {country.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Language Filter */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                                <Languages size={14} />
                                                Language
                                            </label>
                                            <select
                                                value={tempFilters.language}
                                                onChange={(e) => {
                                                    const lang = e.target.value;
                                                    let country = tempFilters.country;
                                                    let continent = tempFilters.continent;

                                                    // Upward inference: Language -> Country -> Continent
                                                    if (lang === 'hi') {
                                                        country = 'india';
                                                        continent = 'asia';
                                                    } else if (lang === 'zh') {
                                                        country = 'china';
                                                        continent = 'asia';
                                                    } else if (lang === 'nl') {
                                                        country = 'netherlands';
                                                        continent = 'europe';
                                                    } else if (lang === 'id') {
                                                        country = 'indonesia';
                                                        continent = 'asia';
                                                    } else if (lang === 'ar') {
                                                        country = 'middle_east';
                                                        continent = 'asia';
                                                    }

                                                    setTempFilters({
                                                        ...tempFilters,
                                                        continent: continent,
                                                        country: country,
                                                        language: lang,
                                                        source: 'all'
                                                    });
                                                }}
                                                className="w-full p-4 bg-white border border-indigo-100 rounded-xl font-bold text-gray-700 outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                                            >
                                                {availableLanguages.map((lang) => (
                                                    <option key={lang.code} value={lang.code}>
                                                        {lang.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Source Filter */}
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                                <Newspaper size={14} />
                                                News Source
                                            </label>
                                            <select
                                                value={tempFilters.source}
                                                onChange={(e) => {
                                                    const source = e.target.value;
                                                    let lang = tempFilters.language;
                                                    let country = tempFilters.country;
                                                    let continent = tempFilters.continent;

                                                    // Upward inference: Source -> Language -> Country -> Continent
                                                    if (source === 'BBC Hindi') {
                                                        lang = 'hi';
                                                        country = 'india';
                                                        continent = 'asia';
                                                    } else if (source === 'BBC India (English)') {
                                                        lang = 'en';
                                                        country = 'india';
                                                        continent = 'asia';
                                                    } else if (source === 'BBC Chinese') {
                                                        lang = 'zh';
                                                        country = 'china';
                                                        continent = 'asia';
                                                    } else if (source === 'BBC Indonesia') {
                                                        lang = 'id';
                                                        country = 'indonesia';
                                                        continent = 'asia';
                                                    } else if (source === 'BBC Arabic') {
                                                        lang = 'ar';
                                                        country = 'middle_east';
                                                        continent = 'asia';
                                                    } else if (source === 'BBC Middle East (English)') {
                                                        lang = 'en';
                                                        country = 'middle_east';
                                                        continent = 'asia';
                                                    } else if (source === 'BBC Europe (English)') {
                                                        lang = 'en';
                                                        country = 'europe';
                                                        continent = 'europe';
                                                    } else if (source === 'BBC Americas (English)') {
                                                        lang = 'en';
                                                        country = 'americas';
                                                        continent = 'americas';
                                                    } else if (source === 'BBC World News (English)') {
                                                        lang = 'en';
                                                        country = 'global';
                                                        continent = 'global';
                                                    }

                                                    setTempFilters({
                                                        ...tempFilters,
                                                        continent: continent,
                                                        country: country,
                                                        language: lang,
                                                        source: source
                                                    });
                                                }}
                                                className="w-full p-4 bg-white border border-indigo-100 rounded-xl font-bold text-gray-700 outline-none focus:ring-4 focus:ring-indigo-200 transition-all"
                                            >
                                                {availableSources.map((source) => (
                                                    <option key={source.code} value={source.code}>
                                                        {source.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Analyzed Only Toggle */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-600 uppercase tracking-widest flex items-center gap-2">
                                                <TrendingUp size={14} />
                                                Article Status
                                            </label>
                                            <button
                                                onClick={() => setTempFilters({ ...tempFilters, analyzedOnly: !tempFilters.analyzedOnly })}
                                                className={`w-full p-4 rounded-xl font-bold transition-all flex items-center justify-between ${tempFilters.analyzedOnly
                                                    ? 'bg-green-50 border-2 border-green-500 text-green-700'
                                                    : 'bg-white border border-indigo-100 text-gray-500'
                                                    }`}
                                            >
                                                <span className="flex items-center gap-2">
                                                    {tempFilters.analyzedOnly ? '✓' : '○'} Analyzed
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Apply and Cancel Buttons */}
                            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-indigo-200">
                                <button
                                    onClick={() => {
                                        setFilters(tempFilters);
                                        setShowFilters(false);
                                    }}
                                    className="flex-1 px-6 py-4 bg-primary text-white rounded-2xl font-black hover:brightness-110 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    <Filter size={18} />
                                    Apply Filters
                                </button>
                                <button
                                    onClick={() => {
                                        setTempFilters(filters);
                                        setShowFilters(false);
                                    }}
                                    className="px-6 py-4 bg-white text-gray-700 border border-gray-200 rounded-2xl font-bold hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* Active Filters Display */}
                            {(filters.continent !== 'all' || filters.country !== 'all' || filters.language !== 'all' || filters.source !== 'all' || filters.analyzedOnly) && (
                                <div className="mt-6 pt-6 border-t border-indigo-200">
                                    <p className="text-xs font-bold text-gray-500 mb-3">Currently Active Filters:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {filters.continent !== 'all' && (
                                            <span className="px-3 py-1.5 bg-white rounded-lg text-sm font-bold text-indigo-700 flex items-center gap-2 border border-indigo-200">
                                                <Globe size={14} />
                                                {HIERARCHICAL_FILTERS.continents.find(c => c.code === filters.continent)?.name}
                                            </span>
                                        )}
                                        {filters.country !== 'all' && (
                                            <span className="px-3 py-1.5 bg-white rounded-lg text-sm font-bold text-indigo-700 flex items-center gap-2 border border-indigo-200">
                                                <MapPin size={14} />
                                                {HIERARCHICAL_FILTERS.countries.all.find(c => c.code === filters.country)?.name}
                                            </span>
                                        )}
                                        {filters.language !== 'all' && (
                                            <span className="px-3 py-1.5 bg-white rounded-lg text-sm font-bold text-indigo-700 flex items-center gap-2 border border-indigo-200">
                                                <Languages size={14} />
                                                {HIERARCHICAL_FILTERS.languages.all.find(l => l.code === filters.language)?.name}
                                            </span>
                                        )}
                                        {filters.source !== 'all' && (
                                            <span className="px-3 py-1.5 bg-white rounded-lg text-sm font-bold text-indigo-700 flex items-center gap-2 border border-indigo-200">
                                                <Newspaper size={14} />
                                                {HIERARCHICAL_FILTERS.sources.all.find(s => s.code === filters.source)?.name}
                                            </span>
                                        )}
                                        {filters.analyzedOnly && (
                                            <span className="px-3 py-1.5 bg-green-50 rounded-lg text-sm font-bold text-green-700 flex items-center gap-2 border border-green-200">
                                                <TrendingUp size={14} />
                                                Analyzed Only
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Message */}
            {error && (
                <div className="p-6 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 font-bold animate-fade-in border border-red-100">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                    <button
                        onClick={() => fetchNews(null)}
                        className="ml-auto px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Loading State */}
            {loading && news.length === 0 && (
                <div className="py-20 text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-500 font-bold">Loading news...</p>
                </div>
            )}

            {/* Breaking News Hero */}
            {featuredNews && !loading && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleArticleClick(featuredNews)}
                    className="relative h-[450px] rounded-[40px] overflow-hidden group cursor-pointer shadow-2xl shadow-indigo-500/10 mb-12"
                >
                    <img
                        src={getImageUrl(featuredNews)}
                        alt={featuredNews.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute bottom-0 left-0 p-12 w-full max-w-4xl space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em]">Analyzed</span>
                            <span className="text-white/70 text-sm font-bold flex items-center gap-2">
                                <Clock size={16} /> {formatTime(featuredNews.published_date)}
                            </span>
                        </div>
                        <h3 className="text-5xl font-black text-white leading-tight">{featuredNews.title}</h3>
                        <p className="text-white/80 text-lg leading-relaxed">{featuredNews.summary || 'Click to read the full article and view AI-powered analysis.'}</p>
                        <button className="bg-white text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-gray-100 transition-colors shadow-xl">
                            Read Full Article <ExternalLink size={18} />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* News Grid */}
            {!loading && filteredNews.length > 0 && (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredNews.slice(featuredNews ? 1 : 0).map((article, i) => (
                                <motion.div
                                    layout
                                    key={article._id || article.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3, delay: i * 0.05 }}
                                    onClick={() => handleArticleClick(article)}
                                    className="bg-white rounded-[32px] border border-gray-100 overflow-hidden group hover:shadow-2xl hover:shadow-primary/10 transition-all flex flex-col cursor-pointer"
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={getImageUrl(article)}
                                            alt={article.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-primary border border-white">
                                            {article.category || 'News'}
                                        </span>
                                        {article.analyzed && (
                                            <span className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white">
                                                ✓ Analyzed
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-8 flex-1 flex flex-col">
                                        <div className="flex items-center gap-3 text-gray-400 text-xs font-bold mb-4">
                                            <span className="hover:text-primary transition-colors cursor-pointer">{article.source || 'Unknown Source'}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span>{formatTime(article.published_date)}</span>
                                        </div>

                                        <h4 className="text-xl font-bold text-gray-900 mb-4 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                                            {article.title}
                                        </h4>

                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {article.summary || 'Click to read the full article and view detailed analysis.'}
                                        </p>

                                        <div className="mt-auto pt-6 border-t border-gray-50 flex items-center justify-between group/btn">
                                            <span className="text-sm font-black text-gray-900 group-hover/btn:translate-x-1 transition-transform flex items-center gap-2">
                                                {article.analyzed ? 'View Analysis' : 'Analyze Article'} <ChevronRight size={16} className="text-primary" />
                                            </span>
                                            <div className="p-2 bg-gray-50 rounded-xl text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <ExternalLink size={16} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-center gap-4 pt-8 pb-4">
                        {/* Items per page dropdown */}
                        <div className="relative">
                            <select
                                value={pagination.itemsPerPage}
                                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                                className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-200 rounded-lg font-bold text-gray-700 cursor-pointer hover:border-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" size={16} />
                        </div>

                        {/* Page indicator */}
                        <div className="text-sm font-bold text-gray-600">
                            {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalLoaded)} of {pagination.totalLoaded}
                        </div>

                        {/* Refresh button */}
                        <button
                            onClick={handleRefreshPage}
                            disabled={loading}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            title="Refresh"
                        >
                            <RefreshCw size={18} className={`text-gray-600 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        {/* Previous button */}
                        <button
                            onClick={handlePreviousPage}
                            disabled={pagination.currentPage === 1 || loading}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Previous page"
                        >
                            <ChevronLeft size={20} className="text-gray-600" />
                        </button>

                        {/* Next button */}
                        <button
                            onClick={handleNextPage}
                            disabled={!pagination.hasMore || loading}
                            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            title="Next page"
                        >
                            <ChevronRight size={20} className="text-gray-600" />
                        </button>
                    </div>
                </>
            )}

            {/* Empty State */}
            {!loading && filteredNews.length === 0 && !error && (
                <div className="py-20 text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Search size={40} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No news found</h3>
                    <p className="text-gray-500">Try adjusting your search or category filters.</p>
                </div>
            )}
        </div>
    );
}
