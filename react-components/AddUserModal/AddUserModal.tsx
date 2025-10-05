import { useState, type FormEvent } from 'react';
import './AddUserModal.css';

interface AddUserModalProps {
  onClose: () => void;
  onAdd: (userData: {
    username: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) => Promise<void>;
  language: 'he' | 'en';
}

const translations = {
  he: {
    title: 'הוספת משתמש חדש',
    username: 'שם משתמש',
    email: 'אימייל',
    password: 'סיסמה',
    phone: 'טלפון',
    role: 'תפקיד',
    user: 'משתמש',
    admin: 'מנהל',
    cancel: 'ביטול',
    add: 'הוסף',
    adding: 'מוסיף...',
    required: 'שדה חובה',
    passwordTooShort: 'הסיסמה חייבת להכיל לפחות 6 תווים',
    invalidEmail: 'כתובת אימייל לא תקינה'
  },
  en: {
    title: 'Add New User',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    phone: 'Phone',
    role: 'Role',
    user: 'User',
    admin: 'Admin',
    cancel: 'Cancel',
    add: 'Add',
    adding: 'Adding...',
    required: 'Required field',
    passwordTooShort: 'Password must be at least 6 characters',
    invalidEmail: 'Invalid email address'
  }
};

export const AddUserModal = ({ onClose, onAdd, language }: AddUserModalProps) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const t = translations[language];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!username || !email || !password) {
      setError(t.required);
      return;
    }

    if (password.length < 6) {
      setError(t.passwordTooShort);
      return;
    }

    if (!email.includes('@')) {
      setError(t.invalidEmail);
      return;
    }

    setLoading(true);
    try {
      await onAdd({ username, email, password, phone, role });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content add-user-modal" 
        dir={language === 'he' ? 'rtl' : 'ltr'}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{t.title}</h2>
          <button className="modal-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="username">{t.username} *</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">{t.email} *</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">{t.password} *</label>
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
                  title={showPassword ? 'Hide' : 'Show'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t.phone}</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
                placeholder="+972-xx-xxx-xxxx"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">{t.role}</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={loading}
              >
                <option value="user">{t.user}</option>
                <option value="admin">{t.admin}</option>
              </select>
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              disabled={loading}
              className="btn-add"
            >
              {loading ? t.adding : t.add}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-cancel"
            >
              {t.cancel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
