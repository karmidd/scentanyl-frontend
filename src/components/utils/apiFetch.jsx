let currentToken = null;
let tokenPromise = null;

const API_BASE_URL = import.meta.env.VITE_API_URL;

async function fetchToken() {
    // If already fetching, wait for that request
    if (tokenPromise) return tokenPromise;

    tokenPromise = fetch(`${API_BASE_URL}/api/token`)
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch token');
            return res.json();
        })
        .then(data => {
            currentToken = data.token;
            tokenPromise = null;
            return currentToken;
        })
        .catch(err => {
            tokenPromise = null;
            throw err;
        });

    return tokenPromise;
}

export const apiFetch = async (url, options = {}) => {
    // Get token if we don't have one
    if (!currentToken) {
        await fetchToken();
    }

    // Add Authorization header
    const makeRequest = async (token) => {
        const headers = {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        };
        return fetch(url, { ...options, headers });
    };

    try {
        let response = await makeRequest(currentToken);

        // If 401 (token expired), refresh and retry once
        if (response.status === 401) {
            currentToken = null;
            await fetchToken();
            response = await makeRequest(currentToken);
        }

        if (response.status === 429) {
            window.location.href = '/rate-limited';
            throw new Error('Rate limit exceeded');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
};