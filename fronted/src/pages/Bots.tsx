import { useState, useEffect } from 'react';
import { Bot, TrendingUp, Shield, Target, Zap, MessageCircle, Send } from 'lucide-react';

interface Strategy {
    id: string;
    name: string;
    description: string;
    howItWorks: string;
    bestFor: string;
    riskLevel: string;
    expectedReturn: string;
}

const ADMIN_WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || '+1234567890';
const ADMIN_TELEGRAM = import.meta.env.VITE_ADMIN_TELEGRAM || '@apex_admin';

const Bots = () => {
    const [strategies, setStrategies] = useState<Strategy[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStrategies();
    }, []);

    const fetchStrategies = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/bots/strategies');
            const data = await response.json();
            if (data.success) {
                setStrategies(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch strategies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleContactWhatsApp = (strategyName: string) => {
        const message = encodeURIComponent(
            `Hi! I'm interested in activating the ${strategyName}. Can you help me get started?`
        );
        window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, '_blank');
    };

    const handleContactTelegram = () => {
        window.open(`https://t.me/${ADMIN_TELEGRAM}`, '_blank');
    };

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'LOW': return 'text-green-600 bg-green-100';
            case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
            case 'HIGH': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getStrategyIcon = (id: string) => {
        switch (id) {
            case 'GRID': return <Target className="w-8 h-8" />;
            case 'DCA': return <TrendingUp className="w-8 h-8" />;
            case 'MOMENTUM': return <Zap className="w-8 h-8" />;
            case 'MEAN_REVERSION': return <Shield className="w-8 h-8" />;
            default: return <Bot className="w-8 h-8" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading strategies...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Bot className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-4xl font-bold mb-4">Automated Trading Bots</h1>
                        <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                            Let our advanced trading bots work for you 24/7. Choose from multiple strategies
                            designed to maximize returns while managing risk.
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Admin Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Ready to Get Started?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Contact our admin team to activate your trading bot
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleContactWhatsApp('a trading bot')}
                                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contact on WhatsApp
                            </button>
                            <button
                                onClick={handleContactTelegram}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Send className="w-5 h-5" />
                                Contact on Telegram
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Strategies Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Available Strategies</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {strategies.map((strategy) => (
                        <div
                            key={strategy.id}
                            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="text-blue-600">
                                        {getStrategyIcon(strategy.id)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            {strategy.name}
                                        </h3>
                                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${getRiskColor(strategy.riskLevel)}`}>
                                            {strategy.riskLevel} RISK
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-4">{strategy.description}</p>

                            <div className="space-y-3 mb-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">How it works:</h4>
                                    <p className="text-sm text-gray-600">{strategy.howItWorks}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Best for:</h4>
                                    <p className="text-sm text-gray-600">{strategy.bestFor}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 text-sm mb-1">Expected Return:</h4>
                                    <p className="text-sm font-semibold text-green-600">{strategy.expectedReturn}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleContactWhatsApp(strategy.name)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Request This Bot
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* How It Works Section */}
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How It Works</h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                1
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Choose Strategy</h3>
                            <p className="text-sm text-gray-600">Select the trading bot that matches your goals</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                2
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Contact Admin</h3>
                            <p className="text-sm text-gray-600">Reach out via WhatsApp or Telegram</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                3
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Get Approved</h3>
                            <p className="text-sm text-gray-600">Admin reviews and activates your bot</p>
                        </div>
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                                4
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Start Trading</h3>
                            <p className="text-sm text-gray-600">Your bot trades automatically 24/7</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>

                <div className="space-y-4 max-w-3xl mx-auto">
                    <details className="bg-white rounded-lg shadow p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            How do I get started with a trading bot?
                        </summary>
                        <p className="mt-2 text-gray-600">
                            Simply click "Request This Bot" on your preferred strategy and contact our admin team via WhatsApp or Telegram. They'll guide you through the setup process.
                        </p>
                    </details>

                    <details className="bg-white rounded-lg shadow p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            What's the minimum investment required?
                        </summary>
                        <p className="mt-2 text-gray-600">
                            The minimum investment varies by strategy. Contact our admin team to discuss your budget and find the best option for you.
                        </p>
                    </details>

                    <details className="bg-white rounded-lg shadow p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            Can I stop my bot at any time?
                        </summary>
                        <p className="mt-2 text-gray-600">
                            Yes! You can request to pause or stop your bot at any time by contacting the admin team.
                        </p>
                    </details>

                    <details className="bg-white rounded-lg shadow p-4">
                        <summary className="font-semibold text-gray-900 cursor-pointer">
                            Are the returns guaranteed?
                        </summary>
                        <p className="mt-2 text-gray-600">
                            No. All trading involves risk, and past performance doesn't guarantee future results. The expected returns shown are estimates based on historical data.
                        </p>
                    </details>
                </div>
            </div>
        </div>
    );
};

export default Bots;
