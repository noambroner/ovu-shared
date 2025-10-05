import { useState } from 'react';
import './APIUIEndpoints.css';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  used: boolean;
}

interface PageEndpoints {
  page: string;
  route: string;
  icon: string;
  endpoints: Endpoint[];
}

interface APIUIEndpointsProps {
  language: 'he' | 'en' | 'ar';
  theme: 'light' | 'dark';
  appType: 'ulm' | 'aam';
}

export const APIUIEndpoints = ({ language, theme, appType }: APIUIEndpointsProps) => {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [expandedPages, setExpandedPages] = useState<string[]>([]);

  const t = {
    he: {
      title: 'UI Endpoints',
      subtitle: 'עץ היררכי של כל נקודות הקצה שה-UI משתמש בהן',
      selectPage: 'בחר דף לצפייה בנקודות הקצה',
      method: 'שיטה',
      endpoint: 'נקודת קצה',
      description: 'תיאור',
      inUse: 'בשימוש',
      notInUse: 'לא בשימוש',
      noEndpoints: 'אין נקודות קצה להצגה',
    },
    en: {
      title: 'UI Endpoints',
      subtitle: 'Hierarchical tree of all endpoints used by the UI',
      selectPage: 'Select a page to view endpoints',
      method: 'Method',
      endpoint: 'Endpoint',
      description: 'Description',
      inUse: 'In Use',
      notInUse: 'Not In Use',
      noEndpoints: 'No endpoints to display',
    },
    ar: {
      title: 'نقاط نهاية UI',
      subtitle: 'شجرة هرمية لجميع نقاط النهاية المستخدمة من قبل UI',
      selectPage: 'حدد صفحة لعرض نقاط النهاية',
      method: 'الطريقة',
      endpoint: 'نقطة النهاية',
      description: 'الوصف',
      inUse: 'قيد الاستخدام',
      notInUse: 'غير مستخدم',
      noEndpoints: 'لا توجد نقاط نهاية للعرض',
    }
  };

  const ulmPages: PageEndpoints[] = [
    {
      page: 'Dashboard',
      route: '/dashboard',
      icon: '📊',
      endpoints: [
        { method: 'GET', path: '/api/v1/users/stats', description: 'Get user statistics', used: true },
        { method: 'GET', path: '/api/v1/activity/recent', description: 'Get recent activity', used: true },
      ]
    },
    {
      page: 'Users Table',
      route: '/users/all',
      icon: '📋',
      endpoints: [
        { method: 'GET', path: '/api/v1/users', description: 'Get all users', used: true },
        { method: 'GET', path: '/api/v1/users/search', description: 'Search users', used: true },
        { method: 'PUT', path: '/api/v1/users/{id}', description: 'Update user', used: true },
        { method: 'DELETE', path: '/api/v1/users/{id}', description: 'Delete user', used: false },
      ]
    },
    {
      page: 'Add User',
      route: '/users/add',
      icon: '➕',
      endpoints: [
        { method: 'POST', path: '/api/v1/users', description: 'Create new user', used: true },
        { method: 'GET', path: '/api/v1/roles', description: 'Get available roles', used: true },
      ]
    },
    {
      page: 'Profile',
      route: '/profile',
      icon: '👤',
      endpoints: [
        { method: 'GET', path: '/api/v1/auth/me', description: 'Get current user', used: true },
        { method: 'PUT', path: '/api/v1/users/me', description: 'Update profile', used: true },
        { method: 'PUT', path: '/api/v1/users/me/password', description: 'Change password', used: false },
      ]
    },
    {
      page: 'Login',
      route: '/login',
      icon: '🔐',
      endpoints: [
        { method: 'POST', path: '/api/v1/auth/login', description: 'User login', used: true },
        { method: 'POST', path: '/api/v1/auth/logout', description: 'User logout', used: true },
        { method: 'POST', path: '/api/v1/auth/refresh', description: 'Refresh token', used: false },
      ]
    }
  ];

  const aamPages: PageEndpoints[] = [
    {
      page: 'Dashboard',
      route: '/dashboard',
      icon: '📊',
      endpoints: [
        { method: 'GET', path: '/api/v1/admins/stats', description: 'Get admin statistics', used: true },
        { method: 'GET', path: '/api/v1/system/alerts', description: 'Get system alerts', used: true },
      ]
    },
    {
      page: 'Admins',
      route: '/admins/all',
      icon: '👥',
      endpoints: [
        { method: 'GET', path: '/api/v1/admins', description: 'Get all admins', used: true },
        { method: 'POST', path: '/api/v1/admins', description: 'Create new admin', used: true },
        { method: 'PUT', path: '/api/v1/admins/{id}', description: 'Update admin', used: true },
        { method: 'DELETE', path: '/api/v1/admins/{id}', description: 'Delete admin', used: false },
      ]
    },
    {
      page: 'Permissions',
      route: '/permissions/roles',
      icon: '🔑',
      endpoints: [
        { method: 'GET', path: '/api/v1/roles', description: 'Get all roles', used: true },
        { method: 'POST', path: '/api/v1/roles', description: 'Create new role', used: true },
        { method: 'PUT', path: '/api/v1/roles/{id}/permissions', description: 'Update role permissions', used: true },
      ]
    },
    {
      page: 'System Logs',
      route: '/system/logs',
      icon: '📝',
      endpoints: [
        { method: 'GET', path: '/api/v1/logs', description: 'Get system logs', used: false },
        { method: 'GET', path: '/api/v1/logs/filter', description: 'Filter logs', used: false },
      ]
    }
  ];

  const pages = appType === 'ulm' ? ulmPages : aamPages;

  const togglePageExpand = (pageName: string) => {
    setExpandedPages(prev => 
      prev.includes(pageName) 
        ? prev.filter(p => p !== pageName)
        : [...prev, pageName]
    );
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return '#61affe';
      case 'POST': return '#49cc90';
      case 'PUT': return '#fca130';
      case 'DELETE': return '#f93e3e';
      case 'PATCH': return '#50e3c2';
      default: return '#999';
    }
  };

  return (
    <div className={`api-ui-endpoints ${theme}`} dir={language === 'he' || language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="api-header">
        <h1 className="api-title">{t[language].title}</h1>
        <p className="api-subtitle">{t[language].subtitle}</p>
      </div>

      <div className="api-content">
        {/* Pages Tree */}
        <div className="pages-tree">
          <h3 className="tree-title">{language === 'he' ? 'דפים' : language === 'ar' ? 'الصفحات' : 'Pages'}</h3>
          {pages.map((page) => (
            <div key={page.page} className="page-item">
              <div 
                className={`page-header ${selectedPage === page.page ? 'active' : ''}`}
                onClick={() => {
                  setSelectedPage(page.page);
                  togglePageExpand(page.page);
                }}
              >
                <span className="page-icon">{page.icon}</span>
                <span className="page-name">{page.page}</span>
                <span className="page-route">{page.route}</span>
                <span className={`expand-icon ${expandedPages.includes(page.page) ? 'expanded' : ''}`}>
                  {language === 'he' ? '◀' : '▶'}
                </span>
              </div>
              
              {expandedPages.includes(page.page) && (
                <div className="endpoints-mini">
                  {page.endpoints.map((endpoint, idx) => (
                    <div key={idx} className="endpoint-mini">
                      <span 
                        className="method-badge" 
                        style={{ backgroundColor: getMethodColor(endpoint.method) }}
                      >
                        {endpoint.method}
                      </span>
                      <span className="endpoint-path">{endpoint.path}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Endpoints Details */}
        <div className="endpoints-details">
          {selectedPage ? (
            <>
              <div className="details-header">
                <h2>{selectedPage}</h2>
                <span className="route-badge">
                  {pages.find(p => p.page === selectedPage)?.route}
                </span>
              </div>

              <div className="endpoints-list">
                {pages.find(p => p.page === selectedPage)?.endpoints.map((endpoint, idx) => (
                  <div key={idx} className="endpoint-card">
                    <div className="endpoint-header">
                      <span 
                        className="method-badge large" 
                        style={{ backgroundColor: getMethodColor(endpoint.method) }}
                      >
                        {endpoint.method}
                      </span>
                      <code className="endpoint-path">{endpoint.path}</code>
                      <span className={`usage-badge ${endpoint.used ? 'used' : 'unused'}`}>
                        {endpoint.used ? t[language].inUse : t[language].notInUse}
                      </span>
                    </div>
                    <p className="endpoint-description">{endpoint.description}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="no-selection">
              <span className="no-selection-icon">📋</span>
              <p>{t[language].selectPage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

