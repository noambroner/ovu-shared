import { useState, type FormEvent } from 'react';
import './ResetPasswordModal.css';

interface ResetPasswordModalProps {
  userId: number;
  username: string;
  onClose: () => void;
  onReset: (userId: number, newPassword: string) => Promise<void>;
  language: 'he' | 'en';
}

const translations = {
  he: {
    title: 'איפוס סיסמה',
    newPassword: 'סיסמה חדשה',
    confirmPassword: 'אימות סיסמה',
    cancel: 'ביטול',
    reset: 'איפוס',
    resetting: 'מאפס...',
    passwordMismatch: 'הסיסמאות לא תואמות',
    passwordTooShort: 'הסיסמה חייבת להכיל לפחות 6 תווים',
    successMessage: 'הסיסמה אופסה בהצלחה!'
  },
  en: {
    title: 'Reset Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
    cancel: 'Cancel',
    reset: 'Reset',
    resetting: 'Resetting...',
    passwordMismatch: 'Passwords do not match',
    passwordTooShort: 'Password must be at least 6 characters',
    successMessage: 'Password reset successfully!'
  }
};

export const ResetPasswordModal = ({ 
  userId, 
  username, 
  onClose, 
  onReset, 
  language 
}: ResetPasswordModalProps) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const t = translations[language];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (newPassword.length < 6) {
      setError(t.passwordTooShort);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t.passwordMismatch);
      return;
    }

    setLoading(true);
    try {
      await onReset(userId, newPassword);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content reset-password-modal" dir={language === 'he' ? 'rtl' : 'ltr'} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t.title}</h2>
          <button className="modal-close" onClick={onClose} title="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="user-info">
              {username}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">{t.newPassword}</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoFocus
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
              <label htmlFor="confirmPassword">{t.confirmPassword}</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                className="confirm-password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="modal-footer">
            <button
              type="submit"
              disabled={loading}
              className="btn-reset"
            >
              {loading ? t.resetting : t.reset}
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
