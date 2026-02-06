import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, TrendingUp, AlertCircle, MessageCircle } from 'lucide-react';

interface TradingBot {
    id: string;
    name: string;
    strategy: string;
    status: string;
    tradingPair: string;
    investmentAmount: number;
    totalProfit: number;
    totalTrades: number;
    createdAt: string;
    activatedAt?: string;
}

const ADMIN_WHATSAPP = import.meta.env.VITE_ADMIN_WHATSAPP || '+1234567890';

const MyBots = () => {
    const [bots, setBots] = useState<TradingBot[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchMyBots();
    }, []);

    const fetchMyBots = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/bots/my-bots', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setBots(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch bots:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PAUSED': return 'bg-blue-100 text-blue-800';
            case 'STOPPED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const handleContactAdmin = () => {
        const message = encodeURIComponent(
            `Hi! I need help with my trading bots.`
        );
        window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, '_blank');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your bots...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Trading Bots</h1>
                        <p className="text-gray-600 mt-1">Manage and monitor your automated trading bots</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/bots')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Browse Bots
                    </button>
                </div>

                {/* Empty State */}
                {bots.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Bots</h2>
                        <p className="text-gray-600 mb-6">
                            You don't have any trading bots yet. Browse available strategies and contact admin to get started.
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard/bots')}
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Browse Strategies
                            </button>
                            <button
                                onClick={handleContactAdmin}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                            >
                                <MessageCircle className="w-5 h-5" />
                                Contact Admin
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Bots</p>
                                        <p className="text-2xl font-bold text-gray-900">{bots.length}</p>
                                    </div>
                                    <Bot className="w-10 h-10 text-blue-600" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Active Bots</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {bots.filter(b => b.status === 'ACTIVE').length}
                                        </p>
                                    </div>
                                    <TrendingUp className="w-10 h-10 text-green-600" />
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Profit</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            ${bots.reduce((sum, b) => sum + b.totalProfit, 0).toFixed(2)}
                                        </p>
                                    </div>
                                    <div className="text-green-600 text-2xl">💰</div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Trades</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {bots.reduce((sum, b) => sum + b.totalTrades, 0)}
                                        </p>
                                    </div>
                                    <div className="text-blue-600 text-2xl">📊</div>
                                </div>
                            </div>
                        </div>

                        {/* Bots List */}
                        <div className="space-y-4">
                            {bots.map((bot) => (
                                <div key={bot.id} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-blue-100 rounded-lg">
                                                <Bot className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{bot.name}</h3>
                                                <p className="text-sm text-gray-600">{bot.strategy} • {bot.tradingPair}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(bot.status)}`}>
                                            {bot.status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-xs text-gray-600">Investment</p>
                                            <p className="text-sm font-semibold text-gray-900">${bot.investmentAmount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Total Profit</p>
                                            <p className={`text-sm font-semibold ${bot.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                ${bot.totalProfit.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">Total Trades</p>
                                            <p className="text-sm font-semibold text-gray-900">{bot.totalTrades}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-600">ROI</p>
                                            <p className={`text-sm font-semibold ${bot.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {bot.investmentAmount > 0 ? ((bot.totalProfit / bot.investmentAmount) * 100).toFixed(2) : '0.00'}%
                                            </p>
                                        </div>
                                    </div>

                                    {bot.status === 'PENDING' && (
                                        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                                            <p className="text-sm text-yellow-800">
                                                Bot is pending activation. Admin will contact you soon.
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={handleContactAdmin}
                                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Contact Admin
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyBots;
