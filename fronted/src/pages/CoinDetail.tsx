import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    ExternalLink,
    Star,
} from "lucide-react";
import { marketAPI } from "@/lib/marketAPI";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: { large: string };
    market_data: {
        current_price: { usd: number };
        price_change_percentage_24h: number;
        price_change_percentage_7d: number;
        price_change_percentage_30d: number;
        market_cap: { usd: number };
        total_volume: { usd: number };
        high_24h: { usd: number };
        low_24h: { usd: number };
        ath: { usd: number };
        atl: { usd: number };
        circulating_supply: number;
        total_supply: number;
    };
    description: { en: string };
    links: {
        homepage: string[];
        blockchain_site: string[];
    };
}

const CoinDetail = () => {
    const { coinId } = useParams<{ coinId: string }>();
    const [coin, setCoin] = useState<CoinData | null>(null);
    const [chartData, setChartData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chartDays, setChartDays] = useState(7);

    useEffect(() => {
        if (coinId) {
            fetchCoinData();
            fetchChartData();
        }
    }, [coinId, chartDays]);

    const fetchCoinData = async () => {
        try {
            const response = await marketAPI.getCoinDetails(coinId!);
            setCoin(response.data);
        } catch (error) {
            console.error("Error fetching coin details:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChartData = async () => {
        try {
            const response = await marketAPI.getCoinChart(coinId!, chartDays);
            const formatted = response.data.prices.map((item: [number, number]) => ({
                time: new Date(item[0]).toLocaleDateString(),
                price: item[1],
            }));
            setChartData(formatted);
        } catch (error) {
            console.error("Error fetching chart data:", error);
        }
    };

    const formatPrice = (price: number) => {
        if (price < 0.01) return `$${price.toFixed(6)}`;
        if (price < 1) return `$${price.toFixed(4)}`;
        return `$${price.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    const formatMarketCap = (marketCap: number) => {
        if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
        if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
        if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
        return `$${marketCap.toLocaleString()}`;
    };

    if (loading || !coin) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading coin data...</p>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const priceChange24h = coin.market_data.price_change_percentage_24h;
    const isPositive = priceChange24h >= 0;

    return (
        <DashboardLayout>
            <div className="space-y-6 animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <Link to="/dashboard/markets">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Markets
                        </Button>
                    </Link>
                    <Button variant="hero-outline" className="gap-2">
                        <Star className="w-4 h-4" />
                        Add to Watchlist
                    </Button>
                </div>

                {/* Coin Header */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <img
                                src={coin.image.large}
                                alt={coin.name}
                                className="w-16 h-16 rounded-full"
                            />
                            <div>
                                <h1 className="text-3xl font-display font-bold text-foreground">
                                    {coin.name}
                                </h1>
                                <p className="text-muted-foreground uppercase">{coin.symbol}</p>
                            </div>
                        </div>
                        {coin.links.homepage[0] && (
                            <a
                                href={coin.links.homepage[0]}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline flex items-center gap-2"
                            >
                                Website
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Price</p>
                            <p className="text-2xl font-bold text-foreground">
                                {formatPrice(coin.market_data.current_price.usd)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">24h Change</p>
                            <p
                                className={`text-2xl font-bold flex items-center gap-2 ${isPositive ? "text-success" : "text-destructive"
                                    }`}
                            >
                                {isPositive ? (
                                    <TrendingUp className="w-6 h-6" />
                                ) : (
                                    <TrendingDown className="w-6 h-6" />
                                )}
                                {Math.abs(priceChange24h).toFixed(2)}%
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
                            <p className="text-2xl font-bold text-foreground">
                                {formatMarketCap(coin.market_data.market_cap.usd)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Volume (24h)</p>
                            <p className="text-2xl font-bold text-foreground">
                                {formatMarketCap(coin.market_data.total_volume.usd)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Price Chart */}
                <div className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-display font-bold text-foreground">
                            Price Chart
                        </h2>
                        <div className="flex gap-2">
                            {[
                                { label: "7D", value: 7 },
                                { label: "30D", value: 30 },
                                { label: "90D", value: 90 },
                                { label: "1Y", value: 365 },
                            ].map((period) => (
                                <Button
                                    key={period.value}
                                    variant={chartDays === period.value ? "hero" : "ghost"}
                                    size="sm"
                                    onClick={() => setChartDays(period.value)}
                                >
                                    {period.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis
                                    dataKey="time"
                                    stroke="#888"
                                    tick={{ fontSize: 12 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    stroke="#888"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1a1a1a",
                                        border: "1px solid #333",
                                        borderRadius: "8px",
                                    }}
                                    formatter={(value: number) => [formatPrice(value), "Price"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="price"
                                    stroke={isPositive ? "#10b981" : "#ef4444"}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Market Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass rounded-xl p-6">
                        <h3 className="text-lg font-display font-bold text-foreground mb-4">
                            Market Stats
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">24h High</span>
                                <span className="font-medium text-foreground">
                                    {formatPrice(coin.market_data.high_24h.usd)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">24h Low</span>
                                <span className="font-medium text-foreground">
                                    {formatPrice(coin.market_data.low_24h.usd)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">All-Time High</span>
                                <span className="font-medium text-foreground">
                                    {formatPrice(coin.market_data.ath.usd)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">All-Time Low</span>
                                <span className="font-medium text-foreground">
                                    {formatPrice(coin.market_data.atl.usd)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">7d Change</span>
                                <span
                                    className={`font-medium ${coin.market_data.price_change_percentage_7d >= 0
                                            ? "text-success"
                                            : "text-destructive"
                                        }`}
                                >
                                    {coin.market_data.price_change_percentage_7d?.toFixed(2)}%
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">30d Change</span>
                                <span
                                    className={`font-medium ${coin.market_data.price_change_percentage_30d >= 0
                                            ? "text-success"
                                            : "text-destructive"
                                        }`}
                                >
                                    {coin.market_data.price_change_percentage_30d?.toFixed(2)}%
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-xl p-6">
                        <h3 className="text-lg font-display font-bold text-foreground mb-4">
                            Supply Information
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Circulating Supply</span>
                                <span className="font-medium text-foreground">
                                    {coin.market_data.circulating_supply?.toLocaleString() || "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Supply</span>
                                <span className="font-medium text-foreground">
                                    {coin.market_data.total_supply?.toLocaleString() || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Description */}
                {coin.description.en && (
                    <div className="glass rounded-xl p-6">
                        <h3 className="text-lg font-display font-bold text-foreground mb-4">
                            About {coin.name}
                        </h3>
                        <div
                            className="text-muted-foreground prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{
                                __html: coin.description.en.split(". ").slice(0, 3).join(". ") + ".",
                            }}
                        />
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CoinDetail;
