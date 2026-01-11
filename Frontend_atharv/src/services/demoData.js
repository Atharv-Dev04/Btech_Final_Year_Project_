export const DEMO_DOCUMENTS = [
    {
        document_id: 'doc_001',
        filename: 'Global Economy 2026 Forecast.pdf',
        text_preview: 'The global economy is expected to see a significant shift towards decentralized finance...',
        full_text: 'The global economy is expected to see a significant shift towards decentralized finance and blockchain-based infrastructure in 2026. Major financial institutions are increasingly adopting digital assets, leading to increased transparency and reduced transaction costs across international borders. However, regulatory frameworks vary significantly across regions, creating both opportunities and challenges for global trade and investment.',
        timestamp: '2026-01-10T14:30:00Z',
        sentiment: 'positive',
        source: 'manual_upload'
    },
    {
        document_id: 'doc_002',
        filename: 'AI Regulation Act Update.docx',
        text_preview: 'New regulations concerning the deployment of large language models in the EU...',
        full_text: 'The European Union (EU) has recently updated the AI Regulation Act, focusing on the safe deployment of large language models. These new rules mandate transparency in data usage and strict adherence to privacy guidelines for AI developers. Companies operating within the EU will need to provide detailed documentation on their models performance and risk mitigation strategies to avoid heavy penalties.',
        timestamp: '2026-01-09T10:15:00Z',
        sentiment: 'neutral',
        source: 'pasted_text'
    },
    {
        document_id: 'doc_003',
        filename: 'Tech Market Volatility.txt',
        text_preview: 'Recent swings in tech stocks have left investors questioning the longevity of the current bull run...',
        full_text: 'Recent swings in tech stocks have left investors questioning the longevity of the current bull run. Market analysts point to several factors, including fluctuating interest rates and global energy supply concerns, as drivers of this volatility. While some see this as a healthy correction, others fear it could signal a more profound shift in market sentiment towards cautiousness and risk aversion.',
        timestamp: '2026-01-08T18:45:00Z',
        sentiment: 'negative',
        source: 'manual_upload'
    },
    {
        document_id: 'doc_004',
        filename: 'Morning Insights Report.pdf',
        text_preview: 'A collection of the most significant news from the past 24 hours across multiple industries...',
        full_text: 'Welcome to this mornings Insights Report. In the last 24 hours, we have seen major breakthroughs in renewable energy technology and a surprising stabilization in global logistics costs. Our analysis suggests that these trends will likely persist throughout the quarter, offering a ray of hope for industries hit hard by previous supply chain disruptions and rising production costs.',
        timestamp: '2026-01-07T09:00:00Z',
        sentiment: 'positive',
        source: 'manual_upload'
    }
];

export const DEMO_SENTIMENT = {
    sentiment: 'positive',
    confidence: 0.942,
    scores: {
        positive: 0.88,
        neutral: 0.09,
        negative: 0.03
    }
};

export const DEMO_SUMMARY = {
    summary: {
        en: "The global economy is undergoing a major transformation in 2026, driven by a rapid shift toward decentralized finance and blockchain-based infrastructure. Major financial institutions are increasingly adopting digital assets, leading to increased transparency and reduced transaction costs. However, regulatory frameworks vary significantly across regions, creating both opportunities and challenges for international trade.",
        fr: "L'économie mondiale subit une transformation majeure en 2026, sous l'impulsion d'un passage rapide vers la finance décentralisée et l'infrastructure basée sur la blockchain. Les grandes institutions financières adoptent de plus en plus les actifs numériques, ce qui accroît la transparence et réduit les coûts de transaction."
    },
    stats: {
        reduction_percentage: 72,
        time_taken: 1.4
    }
};

export const DEMO_KEYWORDS = {
    keywords: {
        en: [
            { text: "Decentralized Finance", rank: 1, score: 98 },
            { text: "Blockchain Technology", rank: 2, score: 95 },
            { text: "Global Economy", rank: 3, score: 88 },
            { text: "Digital Assets", rank: 4, score: 82 },
            { text: "Transparency", rank: 5, score: 75 },
            { text: "Transaction Costs", rank: 6, score: 68 },
            { text: "Regulatory Frameworks", rank: 7, score: 62 },
            { text: "Economic Transformation", rank: 8, score: 55 },
            { text: "Financial Institutions", rank: 9, score: 48 },
            { text: "Market Volatility", rank: 10, score: 42 }
        ],
        fr: [
            { text: "Finance Décentralisée", rank: 1, score: 97 },
            { text: "Blockchain", rank: 2, score: 94 },
            { text: "Économie Mondiale", rank: 3, score: 85 }
        ]
    },
    stats: {
        total_keywords: 10,
        time_taken: 0.8
    }
};

export const DEMO_DISTRIBUTION = {
    positive: 45,
    neutral: 30,
    negative: 25
};

export const DEMO_TRENDS = [
    { time: '2026-01-04T00:00:00Z', positive: 40, neutral: 35, negative: 25 },
    { time: '2026-01-05T00:00:00Z', positive: 45, neutral: 30, negative: 25 },
    { time: '2026-01-06T00:00:00Z', positive: 35, neutral: 40, negative: 25 },
    { time: '2026-01-07T00:00:00Z', positive: 50, neutral: 25, negative: 25 },
    { time: '2026-01-08T00:00:00Z', positive: 55, neutral: 30, negative: 15 },
    { time: '2026-01-09T00:00:00Z', positive: 60, neutral: 25, negative: 15 },
    { time: '2026-01-10T00:00:00Z', positive: 45, neutral: 30, negative: 25 }
];

export const DEMO_ENGAGEMENT = [
    { id: 'summarization', label: 'Summarization', invocations: 1242, efficiency: 94, active_module: 'GPT-4o / BERT' },
    { id: 'translation', label: 'Linguistic Translation', invocations: 856, efficiency: 88, active_module: 'NLLB-200 / Neural Core' },
    { id: 'keywords', label: 'Keyword Extraction', invocations: 2104, efficiency: 98, active_module: 'RAKE-Pro / YAKE' },
    { id: 'sentiment', label: 'Sentiment Analysis', invocations: 3421, efficiency: 91, active_module: 'Zero-Shot / RoBERTa' }
];
