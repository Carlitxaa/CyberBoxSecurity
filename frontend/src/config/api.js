const renderApiUrl = "https://cyberboxsecurity-2.onrender.com";
const configuredApiUrl = import.meta.env.VITE_API_URL;

export const API_URL = configuredApiUrl || renderApiUrl;
