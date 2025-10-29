const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class APIClient {
  private baseURL: string;
  private token: string | null;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
    this.token = null;

    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Auth
  async register(email: string, name: string, nativeLanguage: string, targetLanguage: string) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, name, nativeLanguage, targetLanguage }),
    });
  }

  async login(email: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getUser() {
    return this.request('/auth/me');
  }

  // Translation
  async translate(text: string, type: 'word' | 'phrase') {
    return this.request('/translate', {
      method: 'POST',
      body: JSON.stringify({ text, type }),
    });
  }

  // Conjugation
  async conjugate(verb: string) {
    return this.request('/conjugate', {
      method: 'POST',
      body: JSON.stringify({ verb }),
    });
  }

  // Words
  async getWords() {
    return this.request('/words');
  }

  async createWord(text: string, translation?: string, definitions?: any[]) {
    return this.request('/words', {
      method: 'POST',
      body: JSON.stringify({ text, translation, definitions }),
    });
  }

  async deleteWord(id: string) {
    return this.request(`/words/${id}`, {
      method: 'DELETE',
    });
  }

  // Phrases
  async getPhrases() {
    return this.request('/phrases');
  }

  async createPhrase(text: string, translation?: string) {
    return this.request('/phrases', {
      method: 'POST',
      body: JSON.stringify({ text, translation }),
    });
  }

  async deletePhrase(id: string) {
    return this.request(`/phrases/${id}`, {
      method: 'DELETE',
    });
  }

  // Exercises
  async generateExercises() {
    return this.request('/exercises', {
      method: 'POST',
    });
  }

  async getExercises() {
    return this.request('/exercises');
  }

  // OAuth URLs
  getGoogleOAuthURL() {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${this.baseURL}/auth/google/callback`;
    const scope = 'email profile';

    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  }

  getWeChatOAuthURL() {
    const appId = process.env.NEXT_PUBLIC_WECHAT_APP_ID;
    const redirectUri = encodeURIComponent(`${this.baseURL}/auth/wechat/callback`);

    return `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login`;
  }
}

export const api = new APIClient();
