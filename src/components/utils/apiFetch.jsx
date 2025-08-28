export const apiFetch = async (url, options = {}) => {
    try {
        const response = await fetch(url, options);

        if (response.status === 429) {
            // Rate limit hit
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