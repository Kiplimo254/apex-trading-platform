import { useState, useEffect } from 'react';
import { Plus, TrendingUp, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Trade {
    id: string;
    type: string;
    symbol: string;
    name: string;
    amount: number;
    price: number;
    total: number;
    fee: number;
    exchange?: string;
    notes?: string;
    tradeDate: string;
}

interface TradeStats {
    totalTrades: number;
    buyTrades: number;
    sellTrades: number;
    totalBought: number;
    totalSold: number;
    totalFees: number;
    netProfit: number;
    winRate: number;
}

const TradeJournal = () => {
    const [trades, setTrades] = useState<Trade[]>([]);
    const [stats, setStats] = useState<TradeStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchTrades();
        fetchStats();
    }, []);

    const fetchTrades = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/trades', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setTrades(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch trades:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/trades/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this trade?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/trades/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                toast({ title: 'Success', description: 'Trade deleted successfully' });
                fetchTrades();
                fetchStats();
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete trade', variant: 'destructive' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Trade Journal</h1>
                        <p className="text-gray-600 mt-1">Log and analyze your trading activity</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Log Trade
                    </button>
                </div>

                {/* Stats Cards */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Trades</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.totalTrades}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Win Rate</p>
                            <p className="text-2xl font-bold text-green-600">{stats.winRate.toFixed(1)}%</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Net Profit</p>
                            <p className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${stats.netProfit.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Fees</p>
                            <p className="text-2xl font-bold text-gray-900">${stats.totalFees.toFixed(2)}</p>
                        </div>
                    </div>
                )}

                {/* Trades Table */}
                {trades.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">📝</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Trades Logged</h2>
                        <p className="text-gray-600 mb-6">Start tracking your trading performance by logging your first trade</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Log Your First Trade
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exchange</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {trades.map((trade) => (
                                        <tr key={trade.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {new Date(trade.tradeDate).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded ${trade.type === 'BUY'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {trade.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{trade.name}</div>
                                                    <div className="text-sm text-gray-500">{trade.symbol.toUpperCase()}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">
                                                {trade.amount.toFixed(8)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">
                                                ${trade.price.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                ${trade.total.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {trade.exchange || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleDelete(trade.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Upgrade CTA */}
                <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg shadow-lg p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">Automate Your Trade Logging</h3>
                    <p className="text-purple-100 mb-4">Connect your exchange to automatically import all trades</p>
                    <button className="px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                        Contact Admin to Upgrade
                    </button>
                </div>
            </div>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Log Trade</h2>
                        <p className="text-gray-600 mb-4">
                            Feature coming soon! Use the API directly for now.
                        </p>
                        <button
                            onClick={() => setShowAddModal(false)}
                            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TradeJournal;
