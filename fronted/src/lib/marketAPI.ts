// Market API Client
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
    };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'An error occurred' }));
        throw new Error(error.error || error.message || 'Request failed');
    }
    return response.json();
};

export const marketAPI = {
    // Get list of markets (top coins)
    getMarkets: async (page: number = 1, perPage: number = 100) => {
        const response = await fetch(
            `${API_BASE_URL}/markets?page=${page}&per_page=${perPage}`,
            {
                headers: getAuthHeaders(),
            }
        );
        return handleResponse(response);
    },

    // Get trending coins
    getTrending: async () => {
        const response = await fetch(`${API_BASE_URL}/markets/trending`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    // Search coins
    searchCoins: async (query: string) => {
        const response = await fetch(
            `${API_BASE_URL}/markets/search?q=${encodeURIComponent(query)}`,
            {
                headers: getAuthHeaders(),
            }
        );
        return handleResponse(response);
    },

    // Get coin details
    getCoinDetails: async (coinId: string) => {
        const response = await fetch(`${API_BASE_URL}/markets/${coinId}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    // Get coin chart data
    getCoinChart: async (coinId: string, days: number = 7) => {
        const response = await fetch(
            `${API_BASE_URL}/markets/${coinId}/chart?days=${days}`,
            {
                headers: getAuthHeaders(),
            }
        );
        return handleResponse(response);
    },
};

// Watchlist API
export const watchlistAPI = {
    // Get user's watchlist
    getWatchlist: async () => {
        const response = await fetch(`${API_BASE_URL}/watchlist`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    // Add coin to watchlist
    addToWatchlist: async (coinId: string, symbol: string, name: string) => {
        const response = await fetch(`${API_BASE_URL}/watchlist`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ coinId, symbol, name }),
        });
        return handleResponse(response);
    },

    // Remove coin from watchlist
    removeFromWatchlist: async (coinId: string) => {
        const response = await fetch(`${API_BASE_URL}/watchlist/${coinId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    // Check if coin is in watchlist
    checkWatchlist: async (coinId: string) => {
        const response = await fetch(`${API_BASE_URL}/watchlist/check/${coinId}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};
