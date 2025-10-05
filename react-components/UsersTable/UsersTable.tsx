import { useState, useEffect, useMemo } from 'react';
import type { Language, Theme } from '../types';
import './UsersTable.css';
import { EditUserModal } from '../EditUserModal/EditUserModal';
import { ResetPasswordModal } from '../ResetPasswordModal/ResetPasswordModal';
import { AddUserModal } from '../AddUserModal/AddUserModal';
import { DeactivateUserModal } from '../DeactivateUserModal/DeactivateUserModal';
import { UserActivityHistory } from '../UserActivityHistory/UserActivityHistory';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phone?: string;
  status?: string;
  current_joined_at?: string;
  scheduled_deactivation_at?: string;
  created_by_id?: number;
  created_by_username?: string;
  created_at: string;
}

interface UsersTableProps {
  language: Language;
  theme: Theme;
  apiEndpoint: string;
  token: string;
}

type SortField = keyof User | null;
type SortDirection = 'asc' | 'desc';

const translations = {
  he: {
    title: 'ניהול משתמשים',
    actions: 'פעולות',
    edit: 'עריכה',
    deactivate: 'השבת משתמש',
    reactivate: 'הפעל מחדש',
    cancelSchedule: 'בטל תזמון',
    viewHistory: 'היסטוריית פעילות',
    resetPassword: 'אפס סיסמה',
    loading: 'טוען...',
    error: 'שגיאה בטעינת המשתמשים',
    noUsers: 'אין משתמשים',
    search: 'חיפוש...',
    totalUsers: 'סה"כ משתמשים',
    status: 'סטטוס',
    statusActive: 'פעיל',
    statusInactive: 'לא פעיל',
    statusScheduled: 'מתוזמן להשבתה',
    columns: {
      id: 'מזהה',
      username: 'שם משתמש',
      email: 'אימייל',
      role: 'תפקיד',
      phone: 'טלפון',
      status: 'סטטוס',
      created_by: 'נוצר ע"י',
      created_at: 'תאריך יצירה',
    },
    roles: {
      user: 'משתמש',
      admin: 'מנהל',
      super_admin: 'מנהל על'
    },
    never: 'אף פעם'
  },
  en: {
    title: 'User Management',
    actions: 'Actions',
    edit: 'Edit',
    deactivate: 'Deactivate User',
    reactivate: 'Reactivate',
    cancelSchedule: 'Cancel Schedule',
    viewHistory: 'Activity History',
    resetPassword: 'Reset Password',
    loading: 'Loading...',
    error: 'Error loading users',
    noUsers: 'No users found',
    search: 'Search...',
    totalUsers: 'Total Users',
    status: 'Status',
    statusActive: 'Active',
    statusInactive: 'Inactive',
    statusScheduled: 'Scheduled for Deactivation',
    columns: {
      id: 'ID',
      username: 'Username',
      email: 'Email',
      role: 'Role',
      phone: 'Phone',
      status: 'Status',
      created_by: 'Created By',
      created_at: 'Created',
    },
    roles: {
      user: 'User',
      admin: 'Admin',
      super_admin: 'Super Admin'
    },
    never: 'Never'
  }
};

export const UsersTable = ({ language, apiEndpoint, token }: UsersTableProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField] = useState<SortField>('created_at');
  const [sortDirection] = useState<SortDirection>('desc');
  const [columnFilters] = useState<Record<string, string>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deactivatingUserId, setDeactivatingUserId] = useState<number | null>(null);
  const [viewingHistoryUserId, setViewingHistoryUserId] = useState<number | null>(null);

  const t = translations[language] || translations.en;
  const isRTL = language === 'he';

  useEffect(() => {
    fetchUsers();
  }, [apiEndpoint, token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch users from API
      const response = await fetch(`${apiEndpoint}/api/v1/users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }
      
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (type: 'immediate' | 'scheduled', scheduledDate?: Date, reason?: string) => {
    if (!deactivatingUserId) return;
    
    try {
      // Call API endpoint
      const response = await fetch(`${apiEndpoint}/api/v1/users/${deactivatingUserId}/deactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deactivation_type: type,
          scheduled_date: scheduledDate?.toISOString(),
          reason,
        }),
      });

      if (response.ok) {
        await fetchUsers();
        setDeactivatingUserId(null);
      }
    } catch (error) {
      console.error('Failed to deactivate user:', error);
    }
  };

  const handleReactivate = async (userId: number) => {
    try {
      const response = await fetch(`${apiEndpoint}/api/v1/users/${userId}/reactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Reactivated by admin' }),
      });

      if (response.ok) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Failed to reactivate user:', error);
    }
  };

  const handleCancelSchedule = async (userId: number) => {
    try {
      const response = await fetch(`${apiEndpoint}/api/v1/users/${userId}/cancel-schedule`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Cancelled by admin' }),
      });

      if (response.ok) {
        await fetchUsers();
      }
    } catch (error) {
      console.error('Failed to cancel schedule:', error);
    }
  };

  const getStatusBadge = (user: User) => {
    const status = user.status || 'active';
    
    if (status === 'active') {
      return <span className="status-badge status-active">{t.statusActive}</span>;
    } else if (status === 'inactive') {
      return <span className="status-badge status-inactive">{t.statusInactive}</span>;
    } else if (status === 'scheduled_deactivation') {
      return <span className="status-badge status-scheduled">{t.statusScheduled}</span>;
    }
    return null;
  };

  const filteredAndSortedUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        (user.phone && user.phone.includes(searchTerm));

      const matchesFilters = Object.entries(columnFilters).every(([key, value]) => {
        if (!value) return true;
        const userValue = user[key as keyof User];
        return userValue && String(userValue).toLowerCase().includes(value.toLowerCase());
      });

      return matchesSearch && matchesFilters;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (aValue === undefined || bValue === undefined) return 0;
        
        let comparison = 0;
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          comparison = aValue.localeCompare(bValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          comparison = aValue - bValue;
        }
        
        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return filtered;
  }, [users, searchTerm, sortField, sortDirection, columnFilters]);

  if (loading) {
    return <div className="users-table-loading">{t.loading}</div>;
  }

  if (error) {
    return <div className="users-table-error">{t.error}: {error}</div>;
  }

  return (
    <div className={`users-table-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="users-table-header">
        <h2>{t.title}</h2>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          + {t.columns.username}
        </button>
      </div>

      <div className="users-table-controls">
        <input
          type="text"
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="users-count">
          {t.totalUsers}: {filteredAndSortedUsers.length}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>{t.columns.id}</th>
              <th>{t.columns.username}</th>
              <th>{t.columns.email}</th>
              <th>{t.columns.phone}</th>
              <th>{t.columns.role}</th>
              <th>{t.columns.status}</th>
              <th>{t.columns.created_at}</th>
              <th>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td><strong>{user.username}</strong></td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>{t.roles[user.role as keyof typeof t.roles] || user.role}</td>
                <td>{getStatusBadge(user)}</td>
                <td>{new Date(user.created_at).toLocaleDateString(language)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => setEditingUser(user)}
                      title={t.edit}
                    >
                      ✏️
                    </button>
                    
                    {user.status === 'active' && (
                      <button
                        className="btn-icon btn-danger"
                        onClick={() => setDeactivatingUserId(user.id)}
                        title={t.deactivate}
                      >
                        🚫
                      </button>
                    )}
                    
                    {user.status === 'inactive' && (
                      <button
                        className="btn-icon btn-success"
                        onClick={() => handleReactivate(user.id)}
                        title={t.reactivate}
                      >
                        ✅
                      </button>
                    )}
                    
                    {user.status === 'scheduled_deactivation' && (
                      <button
                        className="btn-icon btn-warning"
                        onClick={() => handleCancelSchedule(user.id)}
                        title={t.cancelSchedule}
                      >
                        ⏱️
                      </button>
                    )}
                    
                    <button
                      className="btn-icon"
                      onClick={() => setViewingHistoryUserId(user.id)}
                      title={t.viewHistory}
                    >
                      📊
                    </button>
                    
                    <button
                      className="btn-icon"
                      onClick={() => setResetPasswordUserId(user.id)}
                      title={t.resetPassword}
                    >
                      🔑
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <EditUserModal
          onClose={() => setEditingUser(null)}
          onSave={async (_userId: number, _updates: any) => {
            setEditingUser(null);
            await fetchUsers();
          }}
          user={editingUser}
          language={language}
        />
      )}

      {resetPasswordUserId && (
        <ResetPasswordModal
          onClose={() => setResetPasswordUserId(null)}
          onReset={async (_userId: number, _newPassword: string) => {
            setResetPasswordUserId(null);
          }}
          userId={resetPasswordUserId}
          username={users.find(u => u.id === resetPasswordUserId)?.username || ''}
          language={language}
        />
      )}

      {showAddModal && (
        <AddUserModal
          onClose={() => setShowAddModal(false)}
          onAdd={async (_newUser: any) => {
            setShowAddModal(false);
            await fetchUsers();
          }}
          language={language}
        />
      )}

      {deactivatingUserId && (
        <DeactivateUserModal
          isOpen={true}
          onClose={() => setDeactivatingUserId(null)}
          onConfirm={handleDeactivate}
          username={users.find(u => u.id === deactivatingUserId)?.username || ''}
          translations={{
            deactivateUser: t.deactivate,
            deactivateUserTitle: t.deactivate,
            deactivateImmediate: translations.he.statusActive, // Will be replaced with proper translations
            deactivateScheduled: t.statusScheduled,
            selectDeactivationType: 'בחר סוג השבתה',
            scheduledDate: 'תאריך ושעה',
            reason: 'סיבה',
            reasonPlaceholder: 'הזן סיבה (אופציונלי)',
            cancel: 'ביטול',
            confirm: 'אישור',
            scheduledDateRequired: 'נדרש תאריך',
            scheduledDateMustBeFuture: 'התאריך חייב להיות עתידי',
          }}
          preferredLanguage={language}
        />
      )}

      {viewingHistoryUserId && (
        <div className="modal-overlay" onClick={() => setViewingHistoryUserId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setViewingHistoryUserId(null)}>×</button>
            <UserActivityHistory
              userId={viewingHistoryUserId}
              apiBaseUrl={apiEndpoint}
              authToken={token}
              translations={{
                activityHistory: t.viewHistory,
                joinedAt: 'הצטרף ב',
                leftAt: 'עזב ב',
                scheduledAt: 'מתוזמן ל',
                actionType: 'סוג פעולה',
                performedBy: 'בוצע על ידי',
                reason: 'סיבה',
                duration: 'משך',
                days: 'ימים',
                active: t.statusActive,
                inactive: t.statusInactive,
                noHistory: 'אין היסטוריה',
                loading: t.loading,
                error: t.error,
                current: 'נוכחי',
              }}
              preferredLanguage={language}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
