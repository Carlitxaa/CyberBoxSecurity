// URL base da API — usa variável de ambiente em produção (Render)
// ou localhost em desenvolvimento local
export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://cyberboxsecurity-2.onrender.com";
