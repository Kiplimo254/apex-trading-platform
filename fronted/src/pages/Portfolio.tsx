import { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, Edit2, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Holding {
    id: string;
    coinId: string;
    symbol: string;
    name: string;
    amount: number;
    averageBuyPrice: number;
    currentPrice: number;
    currentValue: number;
    investedValue: number;
    profitLoss: number;
    profitLossPercentage: number;
    notes?: string;
}

interface Summary {
    totalValue: number;
    totalInvested: number;
    totalProfitLoss: number;
    profitLossPercentage: number;
    holdingsCount: number;
}

const Portfolio = () => {
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingHolding, setEditingHolding] = useState<Holding | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        fetchPortfolio();
        fetchSummary();
    }, []);

    const fetchPortfolio = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/portfolio', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setHoldings(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch portfolio:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/portfolio/summary', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                setSummary(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this holding?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.success) {
                toast({ title: 'Success', description: 'Holding deleted successfully' });
                fetchPortfolio();
                fetchSummary();
            }
        } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete holding', variant: 'destructive' });
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
                        <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
                        <p className="text-gray-600 mt-1">Track your crypto holdings and performance</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add Holding
                    </button>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900">${summary.totalValue.toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total Invested</p>
                            <p className="text-2xl font-bold text-gray-900">${summary.totalInvested.toFixed(2)}</p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">Total P&L</p>
                            <p className={`text-2xl font-bold ${summary.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${summary.totalProfitLoss.toFixed(2)}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <p className="text-sm text-gray-600">P&L %</p>
                            <div className="flex items-center gap-2">
                                <p className={`text-2xl font-bold ${summary.profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {summary.profitLossPercentage.toFixed(2)}%
                                </p>
                                {summary.profitLossPercentage >= 0 ? (
                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                ) : (
                                    <TrendingDown className="w-5 h-5 text-red-600" />
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Holdings Table */}
                {holdings.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Holdings Yet</h2>
                        <p className="text-gray-600 mb-6">Start tracking your crypto portfolio by adding your first holding</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Your First Holding
                        </button>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asset</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg Buy Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Current Price</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Value</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">P&L</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {holdings.map((holding) => (
                                        <tr key={holding.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">{holding.name}</div>
                                                    <div className="text-sm text-gray-500">{holding.symbol.toUpperCase()}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">
                                                {holding.amount.toFixed(8)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">
                                                ${holding.averageBuyPrice.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-gray-900">
                                                ${holding.currentPrice.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                                                ${holding.currentValue.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className={`text-sm font-medium ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    ${holding.profitLoss.toFixed(2)}
                                                </div>
                                                <div className={`text-xs ${holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {holding.profitLossPercentage.toFixed(2)}%
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => setEditingHolding(holding)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(holding.id)}
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
                <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white">
                    <h3 className="text-2xl font-bold mb-2">Upgrade to Auto-Sync</h3>
                    <p className="text-blue-100 mb-4">Connect your exchange for automatic portfolio updates</p>
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                            <span className="text-green-300">✓</span> Automatic portfolio sync
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-300">✓</span> Real-time trade import
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-300">✓</span> Multi-exchange support
                        </li>
                    </ul>
                    <button className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
                        Contact Admin to Upgrade
                    </button>
                </div>
            </div>

            {/* Add/Edit Modal - Simplified for now */}
            {(showAddModal || editingHolding) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingHolding ? 'Edit Holding' : 'Add Holding'}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Feature coming soon! Use the API directly for now.
                        </p>
                        <button
                            onClick={() => {
                                setShowAddModal(false);
                                setEditingHolding(null);
                            }}
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

export default Portfolio;
