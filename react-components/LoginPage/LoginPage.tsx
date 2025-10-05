import { useState, type FormEvent } from 'react';
import './LoginPage.css';
import type { Theme, Language, AppTranslations } from '../types';

interface LoginPageProps {
  theme: Theme;
  language: Language;
  translations: AppTranslations;
  logoIcon: string;
  logoColor: 'blue' | 'purple';
  onLogin: (username: string, password: string) => Promise<void>;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
  loading?: boolean;
  error?: string;
}

export const LoginPage = ({
  theme,
  language,
  translations: t,
  logoIcon,
  logoColor,
  onLogin,
  onToggleTheme,
  onToggleLanguage,
  loading = false,
  error = '',
}: LoginPageProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className="login-page" dir={language === 'he' ? 'rtl' : 'ltr'}>
      <header className="login-header">
        <h1 className="login-header-title">{t.headerTitle as string}</h1>
        <div className="login-header-controls">
          <button onClick={onToggleLanguage} className="control-btn lang-btn">
            <span>{t.langBtn as string}</span>
          </button>
          <button onClick={onToggleTheme} className="control-btn theme-btn">
            <span>{typeof t.themeBtn === 'function' ? t.themeBtn(theme) : t.themeBtn}</span>
          </button>
        </div>
      </header>

      <main className="login-main">
        <div className={`login-card color-${logoColor}`}>
          <div className="logo-container">
            <div className="logo-icon">{logoIcon}</div>
          </div>
          <h1 className="login-title">{t.loginTitle as string}</h1>
          {error && <div className="error-message">{error}</div>}
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">{t.email as string}</label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">{t.password as string}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? '...' : (t.loginBtn as string)}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};
