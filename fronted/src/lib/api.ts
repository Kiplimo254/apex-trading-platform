// API Base URL
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

// Auth API
export const authAPI = {
    login: async (email: string, password: string) => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        return handleResponse(response);
    },

    register: async (data: {
        email: string;
        password: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        referralCode?: string;
    }) => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
};

// User API
export const userAPI = {
    getProfile: async () => {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    updateProfile: async (data: any) => {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
};

// Dashboard API
export const dashboardAPI = {
    getStats: async () => {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};

// Investment API
export const investmentAPI = {
    getPlans: async () => {
        const response = await fetch(`${API_BASE_URL}/investments/plans`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    getUserInvestments: async () => {
        const response = await fetch(`${API_BASE_URL}/investments`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    createInvestment: async (data: { planId: string; amount: number }) => {
        const response = await fetch(`${API_BASE_URL}/investments`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
};

// Transaction API
export const transactionAPI = {
    getUserTransactions: async () => {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    createDeposit: async (data: { amount: number; method: string; walletAddress?: string }) => {
        const response = await fetch(`${API_BASE_URL}/transactions/deposit`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    createWithdrawal: async (data: { amount: number; method: string; walletAddress: string }) => {
        const response = await fetch(`${API_BASE_URL}/transactions/withdraw`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },
};

// Referral API
export const referralAPI = {
    getUserReferrals: async () => {
        const response = await fetch(`${API_BASE_URL}/referrals`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};

// Admin API
export const adminAPI = {
    // Stats
    getStats: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    // Users
    getAllUsers: async (params?: { page?: number; limit?: number; search?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);

        const response = await fetch(`${API_BASE_URL}/admin/users?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    getUserById: async (userId: string) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    updateUser: async (userId: string, data: any) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    },

    deactivateUser: async (userId: string) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    // Transactions
    getAllTransactions: async (params?: { page?: number; limit?: number; status?: string; type?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);
        if (params?.type) queryParams.append('type', params.type);

        const response = await fetch(`${API_BASE_URL}/admin/transactions?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    updateTransactionStatus: async (transactionId: string, status: string, notes?: string) => {
        const response = await fetch(`${API_BASE_URL}/admin/transactions/${transactionId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status, notes }),
        });
        return handleResponse(response);
    },

    // Investments
    getAllInvestments: async (params?: { page?: number; limit?: number; status?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.status) queryParams.append('status', params.status);

        const response = await fetch(`${API_BASE_URL}/admin/investments?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },

    // Referrals
    getAllReferrals: async (params?: { page?: number; limit?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const response = await fetch(`${API_BASE_URL}/admin/referrals?${queryParams}`, {
            headers: getAuthHeaders(),
        });
        return handleResponse(response);
    },
};

export default {
    auth: authAPI,
    user: userAPI,
    dashboard: dashboardAPI,
    investment: investmentAPI,
    transaction: transactionAPI,
    referral: referralAPI,
    admin: adminAPI,
};
