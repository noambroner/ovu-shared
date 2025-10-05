import { useState, useEffect, type FormEvent } from 'react';
import type { Language } from '../types';
import './EditUserModal.css';

interface EditUserModalProps {
  user: {
    id: number;
    username: string;
    email: string;
    phone?: string;
    role: string;
  };
  language: Language;
  onClose: () => void;
  onSave: (id: number, updates: { username: string; email: string; phone: string; role: string }) => Promise<void>;
}

const translations = {
  he: {
    title: 'עריכת משתמש',
    username: 'שם משתמש',
    email: 'אימייל',
    phone: 'טלפון',
    role: 'תפקיד',
    roles: {
      user: 'משתמש',
      admin: 'מנהל',
      super_admin: 'מנהל על'
    },
    save: 'שמור',
    cancel: 'ביטול',
    saving: 'שומר...'
  },
  en: {
    title: 'Edit User',
    username: 'Username',
    email: 'Email',
    phone: 'Phone',
    role: 'Role',
    roles: {
      user: 'User',
      admin: 'Admin',
      super_admin: 'Super Admin'
    },
    save: 'Save',
    cancel: 'Cancel',
    saving: 'Saving...'
  }
};

export const EditUserModal = ({ user, language, onClose, onSave }: EditUserModalProps) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [role, setRole] = useState(user.role);
  const [saving, setSaving] = useState(false);

  const t = translations[language];

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(user.id, { username, email, phone, role });
      onClose();
    } catch (error) {
      console.error('Failed to save user:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Don't close on backdrop click (as per requirements)
    e.stopPropagation();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{t.title}</h2>
          <button className="modal-close-btn" onClick={onClose} title={t.cancel}>
            ✕
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">{t.username}</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">{t.email}</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={saving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">{t.phone}</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={saving}
              placeholder="+972-xx-xxx-xxxx"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">{t.role}</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              disabled={saving}
            >
              <option value="user">{t.roles.user}</option>
              <option value="admin">{t.roles.admin}</option>
              <option value="super_admin">{t.roles.super_admin}</option>
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={onClose}
              disabled={saving}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="btn btn-save"
              disabled={saving}
            >
              {saving ? t.saving : t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
