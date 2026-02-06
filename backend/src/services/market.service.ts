import axios from 'axios';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

class MarketService {
    private async fetchWithCache(key: string, fetchFn: () => Promise<any>) {
        const cached = cache.get(key);
        const now = Date.now();

        if (cached && now - cached.timestamp < CACHE_TTL) {
            return cached.data;
        }

        const data = await fetchFn();
        cache.set(key, { data, timestamp: now });
        return data;
    }

    async getMarkets(page: number = 1, perPage: number = 100) {
        const cacheKey = `markets_${page}_${perPage}`;

        return this.fetchWithCache(cacheKey, async () => {
            const response = await axios.get(`${COINGECKO_API}/coins/markets`, {
                params: {
                    vs_currency: 'usd',
                    order: 'market_cap_desc',
                    per_page: perPage,
                    page,
                    sparkline: true,
                    price_change_percentage: '1h,24h,7d,30d',
                },
            });
            return response.data;
        });
    }

    async getTrending() {
        return this.fetchWithCache('trending', async () => {
            const response = await axios.get(`${COINGECKO_API}/search/trending`);
            return response.data;
        });
    }

    async getCoinDetails(coinId: string) {
        const cacheKey = `coin_${coinId}`;

        return this.fetchWithCache(cacheKey, async () => {
            const response = await axios.get(`${COINGECKO_API}/coins/${coinId}`, {
                params: {
                    localization: false,
                    tickers: false,
                    community_data: false,
                    developer_data: false,
                },
            });
            return response.data;
        });
    }

    async getCoinChart(coinId: string, days: number = 7) {
        const cacheKey = `chart_${coinId}_${days}`;

        return this.fetchWithCache(cacheKey, async () => {
            const response = await axios.get(
                `${COINGECKO_API}/coins/${coinId}/market_chart`,
                {
                    params: {
                        vs_currency: 'usd',
                        days,
                    },
                }
            );
            return response.data;
        });
    }

    async searchCoins(query: string) {
        const response = await axios.get(`${COINGECKO_API}/search`, {
            params: { query },
        });
        return response.data;
    }
}

export default new MarketService();
