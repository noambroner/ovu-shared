import { useState, useEffect, useMemo } from 'react';
import type { Language, Theme } from '../types';
import './UsersTable.css';
import { EditUserModal } from '../EditUserModal/EditUserModal';
import { ResetPasswordModal } from '../ResetPasswordModal/ResetPasswordModal';
import { AddUserModal } from '../AddUserModal/AddUserModal';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  phone?: string;
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
    loading: 'טוען...',
    error: 'שגיאה בטעינת המשתמשים',
    noUsers: 'אין משתמשים',
    search: 'חיפוש...',
    totalUsers: 'סה"כ משתמשים',
    columns: {
      id: 'מזהה',
      username: 'שם משתמש',
      email: 'אימייל',
      role: 'תפקיד',
      phone: 'טלפון',
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
    loading: 'Loading...',
    error: 'Error loading users',
    noUsers: 'No users found',
    search: 'Search...',
    totalUsers: 'Total Users',
    columns: {
      id: 'ID',
      username: 'Username',
      email: 'Email',
      role: 'Role',
      phone: 'Phone',
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
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordUserId, setResetPasswordUserId] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [closingMenuId, setClosingMenuId] = useState<number | null>(null);
  const [highlightingUserId, setHighlightingUserId] = useState<number | null>(null);
  const [updatedFields, setUpdatedFields] = useState<Set<string>>(new Set());
  const [activeFilterColumns, setActiveFilterColumns] = useState<Set<string>>(new Set());

  useEffect(() => {  }, [openMenuId, closingMenuId, menuPosition]);



  const t = translations[language];

  useEffect(() => {
    fetchUsers();
  }, [apiEndpoint, token]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiEndpoint}/api/v1/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      setError(null);
    } catch (err) {
      setError(t.error);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: keyof User) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleColumnFilter = (column: string, value: string) => {
    setColumnFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const hasActiveFilters = () => {
    return searchTerm !== '' || Object.values(columnFilters).some(value => value !== '');
  };

  const clearAllFilters = () => {
    setColumnFilters({
      id: '',
      username: '',
      email: '',
      role: '',
      created_at: ''
    });
    setSearchTerm('');
    setActiveFilterColumns(new Set());
  };

  const toggleFilterPopup = (column: string) => {
    setActiveFilterColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(column)) {
        newSet.delete(column);
      } else {
        newSet.add(column);
      }
      return newSet;
    });
  };

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...users];

    // Global search
    if (searchTerm) {
      result = result.filter(user =>
        Object.values(user).some(val =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Column filters
    Object.entries(columnFilters).forEach(([column, filterValue]) => {
      if (filterValue) {
        result = result.filter(user =>
          String(user[column as keyof User]).toLowerCase().includes(filterValue.toLowerCase())
        );
      }
    });

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (aVal === null) return 1;
        if (bVal === null) return -1;

        let comparison = 0;
        if (typeof aVal === 'string' && typeof bVal === 'string') {
          comparison = aVal.localeCompare(bVal);
        } else if (typeof aVal === 'number' && typeof bVal === 'number') {
          comparison = aVal - bVal;
        }

        return sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [users, searchTerm, columnFilters, sortField, sortDirection]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t.never;
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'super_admin': return 'role-badge role-super-admin';
      case 'admin': return 'role-badge role-admin';
      default: return 'role-badge role-user';
    }
  };

  const translateRole = (role: string) => {
    return t.roles[role as keyof typeof t.roles] || role;
  };


  const handleEdit = (user: User) => {
    setEditingUser(user);
    setOpenMenuId(null);
  };

  const handleSaveUser = async (id: number, updates: { username: string; email: string; role: string }) => {
    try {
      // Find original user to compare changes
      const originalUser = users.find(u => u.id === id);
      const changedFields = new Set<string>();
      
      if (originalUser) {
        if (originalUser.username !== updates.username) changedFields.add('username');
        if (originalUser.email !== updates.email) changedFields.add('email');
        if (originalUser.role !== updates.role) changedFields.add('role');
      }

      const response = await fetch(`${apiEndpoint}/api/v1/users/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      // Refresh users list
      await fetchUsers();
      
      // Trigger highlight animation
      setHighlightingUserId(id);
      setUpdatedFields(changedFields);
      
      // Remove highlight after animation
      setTimeout(() => {
        setHighlightingUserId(null);
        setUpdatedFields(new Set());
      }, 1500);
    } catch (err) {
      console.error('Error updating user:', err);
      throw err;
    }
  };

  const handleResetPassword = async (userId: number, newPassword: string) => {
    try {
      const response = await fetch(`${apiEndpoint}/users/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
      });

      if (!response.ok) {
        throw new Error('Failed to reset password');
      }

      console.log('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error);
      throw new Error('Failed to reset password');
    }
  };

  const handleAddUser = async (userData: {
    username: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) => {
    try {
      const response = await fetch(`${apiEndpoint}/api/v1/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to add user');
      }

      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const toggleMenu = (userId: number, event: React.MouseEvent<HTMLButtonElement>) => {    if (openMenuId === userId) {      closeMenu();
    } else {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };      setMenuPosition(position);      setOpenMenuId(userId);
    }
  };

  const closeMenu = () => {
    if (openMenuId) {
      setClosingMenuId(openMenuId);
      setTimeout(() => {
        setOpenMenuId(null);
        setClosingMenuId(null);
        setMenuPosition(null);
      }, 300); // Match animation duration
    }
  };

  const handleMenuAction = (action: () => void) => {
    action();
    closeMenu();
  };

  if (loading) {
    return <div className="users-loading">{t.loading}</div>;
  }

  if (error) {
    return <div className="users-error">{error}</div>;
  }

  return (
    <>
    <div className="users-table-container">
      <div className="users-header">
        <h2 className="users-title">{t.title}</h2>
        <div className="users-stats">
          <span className="total-count">{t.totalUsers}: {users.length}</span>
          <button 
            className="add-user-btn"
            onClick={() => setShowAddModal(true)}
            title={language === 'he' ? 'הוסף משתמש' : 'Add User'}
          >
            +
          </button>
        </div>
      </div>

      <div className="users-controls">
        <input
          type="text"
          className="global-search"
          placeholder={t.search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {hasActiveFilters() && (
          <button 
            className="reset-filters-btn"
            onClick={clearAllFilters}
            title="נקה כל החיפושים"
          >
            🔄 איפוס
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="users-table">
          <thead className={activeFilterColumns.size > 0 ? "has-active-filters" : ""}>
            <tr>
              <th className="actions-column"></th>
                                          

              



              <th>
                <div className="th-header-wrapper">
                  <div className="th-content" onClick={() => handleSort("id")}>
                    {t.columns.id}
                    {sortField === "id" && (
                      <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                    <button 
                      className={`filter-icon-btn${columnFilters.id ? " active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); toggleFilterPopup("id"); }}
                      title="חיפוש"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </button>
                  </div>
                  {activeFilterColumns.has("id") && (
                    <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          className="filter-popup-input"
                          placeholder="חיפוש..."
                          value={columnFilters.id || ""}
                          onChange={(e) => handleColumnFilter("id", e.target.value)}
                          autoFocus
                        />
                        {columnFilters.id && (
                          <button
                            className="clear-filter-btn"
                            onClick={() => { handleColumnFilter("id", ""); toggleFilterPopup("id"); }}
                            title="נקה"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </th>


                                          <th>
                <div className="th-header-wrapper">
                  <div className="th-content" onClick={() => handleSort("username")}>
                    {t.columns.username}
                    {sortField === "username" && (
                      <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                    <button 
                      className={`filter-icon-btn${columnFilters.username ? " active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); toggleFilterPopup("username"); }}
                      title="חיפוש"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </button>
                  </div>
                  {activeFilterColumns.has("username") && (
                    <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          className="filter-popup-input"
                          placeholder="חיפוש..."
                          value={columnFilters.username || ""}
                          onChange={(e) => handleColumnFilter("username", e.target.value)}
                          autoFocus
                        />
                        {columnFilters.username && (
                          <button
                            className="clear-filter-btn"
                            onClick={() => { handleColumnFilter("username", ""); toggleFilterPopup("username"); }}
                            title="נקה"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </th>


                                          <th>
                <div className="th-header-wrapper">
                  <div className="th-content" onClick={() => handleSort("email")}>
                    {t.columns.email}
                    {sortField === "email" && (
                      <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                    <button 
                      className={`filter-icon-btn${columnFilters.email ? " active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); toggleFilterPopup("email"); }}
                      title="חיפוש"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </button>
                  </div>
                  {activeFilterColumns.has("email") && (
                    <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          className="filter-popup-input"
                          placeholder="חיפוש..."
                          value={columnFilters.email || ""}
                          onChange={(e) => handleColumnFilter("email", e.target.value)}
                          autoFocus
                        />
                        {columnFilters.email && (
                          <button
                            className="clear-filter-btn"
                            onClick={() => { handleColumnFilter("email", ""); toggleFilterPopup("email"); }}
                            title="נקה"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </th>

              <th>
                <div className="th-header-wrapper">
                  <div className="th-content">
                    {t.columns.phone}
                  </div>
                </div>
              </th>


                                          <th>
                <div className="th-header-wrapper">
                  <div className="th-content" onClick={() => handleSort("role")}>
                    {t.columns.role}
                    {sortField === "role" && (
                      <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                    <button 
                      className={`filter-icon-btn${columnFilters.role ? " active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); toggleFilterPopup("role"); }}
                      title="חיפוש"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </button>
                  </div>
                  {activeFilterColumns.has("role") && (
                    <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          className="filter-popup-input"
                          placeholder="חיפוש..."
                          value={columnFilters.role || ""}
                          onChange={(e) => handleColumnFilter("role", e.target.value)}
                          autoFocus
                        />
                        {columnFilters.role && (
                          <button
                            className="clear-filter-btn"
                            onClick={() => { handleColumnFilter("role", ""); toggleFilterPopup("role"); }}
                            title="נקה"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </th>

              <th>
                <div className="th-header-wrapper">
                  <div className="th-content">
                    {t.columns.created_by}
                  </div>
                </div>
              </th>


                                          <th>
                <div className="th-header-wrapper">
                  <div className="th-content" onClick={() => handleSort("created_at")}>
                    {t.columns.created_at}
                    {sortField === "created_at" && (
                      <span className="sort-indicator">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                    <button 
                      className={`filter-icon-btn${columnFilters.created_at ? " active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); toggleFilterPopup("created_at"); }}
                      title="חיפוש"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                      </svg>
                    </button>
                  </div>
                  {activeFilterColumns.has("created_at") && (
                    <div className="filter-popup" onClick={(e) => e.stopPropagation()}>
                      <div className="input-wrapper">
                        <input
                          type="text"
                          className="filter-popup-input"
                          placeholder="חיפוש..."
                          value={columnFilters.created_at || ""}
                          onChange={(e) => handleColumnFilter("created_at", e.target.value)}
                          autoFocus
                        />
                        {columnFilters.created_at && (
                          <button
                            className="clear-filter-btn"
                            onClick={() => { handleColumnFilter("created_at", ""); toggleFilterPopup("created_at"); }}
                            title="נקה"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </th>


            </tr>
          </thead>
          <tbody>
            {filteredAndSortedUsers.length === 0 ? (
              <tr>
                <td colSpan={8} className="no-results">{t.noUsers}</td>
              </tr>
            ) : (
              filteredAndSortedUsers.map(user => (
                <tr 
                  key={user.id} 
                  className={`${
                    (openMenuId === user.id || closingMenuId === user.id || editingUser?.id === user.id) 
                      ? "row-selected" 
                      : ""
                  } ${
                    highlightingUserId === user.id 
                      ? "row-highlighting" 
                      : ""
                  }`.trim()}
                >
                  <td className="actions-cell">
                    <div className="actions-menu">
<button 
                        className={`menu-btn ${openMenuId === user.id ? "active" : ""}`}
                        onClick={(e) => toggleMenu(user.id, e)}
                        title={t.actions}
                      >
                        ⋮
                      </button>
                    </div>
                  </td>
                  <td>{user.id}</td>
                  <td className={`username-cell ${highlightingUserId === user.id && updatedFields.has("username") ? "field-updated" : ""}`.trim()}><span className="field-content">{user.username}</span></td>
                  <td className={`email-cell ${highlightingUserId === user.id && updatedFields.has("email") ? "field-updated" : ""}`.trim()}><span className="field-content">{user.email}</span></td>
                  <td className="phone-cell">{user.phone || '-'}</td>
                  <td className={`${highlightingUserId === user.id && updatedFields.has("role") ? "field-updated" : ""}`.trim()}>
                    <span className={`${getRoleBadgeClass(user.role)} field-content`}>
                      {translateRole(user.role)}
                    </span>
                  </td>
                  <td className="created-by-cell">{user.created_by_username || '-'}</td>
                  <td className="date-cell">{formatDate(user.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Animated Center Menu */}
      {(openMenuId || closingMenuId) && (
        <>
          <div 
            className="menu-backdrop" 
            onClick={closeMenu}
            style={{ 
              animation: closingMenuId ? 'backdropFadeOut 0.25s ease-out forwards' : 'backdropFadeIn 0.25s ease-out forwards'
            }}
          />
          <div 
            className={`center-dropdown-menu ${closingMenuId ? "closing" : ""}`}
            style={{
              "--start-x": menuPosition ? `${menuPosition.x}px` : "50%",
              "--start-y": menuPosition ? `${menuPosition.y}px` : "50%",
            } as React.CSSProperties}
          >
            <button 
              className="menu-item"
              onClick={() => handleMenuAction(() => handleEdit(
                filteredAndSortedUsers.find(u => u.id === (openMenuId || closingMenuId))!
              ))}
            >
              ✏️ {t.edit}
            </button>
            <button 
              className="menu-item"
              onClick={() => handleMenuAction(() => setResetPasswordUserId(openMenuId || closingMenuId))}
            >
              🔑 {language === 'he' ? 'איפוס סיסמה' : 'Reset Password'}
            </button>
          </div>
        </>
      )}

    {editingUser && (
        <EditUserModal
          user={editingUser}
          language={language}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}

      {resetPasswordUserId && (
        <ResetPasswordModal
          userId={resetPasswordUserId}
          username={users.find(u => u.id === resetPasswordUserId)?.username || ''}
          language={language}
          onClose={() => setResetPasswordUserId(null)}
          onReset={handleResetPassword}
        />
      )}

      {showAddModal && (
        <AddUserModal
          language={language}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddUser}
        />
      )}
  </>
  );
};
