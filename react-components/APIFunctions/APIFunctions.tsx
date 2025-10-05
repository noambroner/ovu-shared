import { useState } from 'react';
import './APIFunctions.css';

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  title: string;
  description: string;
  authentication: boolean;
  parameters?: Parameter[];
  requestBody?: string;
  responseExample?: string;
  category: string;
}

interface APIFunctionsProps {
  language: 'he' | 'en' | 'ar';
  theme: 'light' | 'dark';
  appType: 'ulm' | 'aam';
}

export const APIFunctions = ({ language, theme, appType }: APIFunctionsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null);

  const t = {
    he: {
      title: 'תיעוד API Functions',
      subtitle: 'תיעוד מלא של כל נקודות הקצה שהאפליקציה מספקת',
      categories: 'קטגוריות',
      allCategories: 'כל הקטגוריות',
      method: 'שיטה',
      endpoint: 'נקודת קצה',
      description: 'תיאור',
      authentication: 'אימות',
      required: 'נדרש',
      optional: 'אופציונלי',
      parameters: 'פרמטרים',
      requestBody: 'גוף הבקשה',
      responseExample: 'דוגמת תגובה',
      selectEndpoint: 'בחר נקודת קצה לצפייה בפרטים',
      name: 'שם',
      type: 'סוג',
      status: 'סטטוס',
    },
    en: {
      title: 'API Functions Documentation',
      subtitle: 'Complete documentation of all endpoints provided by the application',
      categories: 'Categories',
      allCategories: 'All Categories',
      method: 'Method',
      endpoint: 'Endpoint',
      description: 'Description',
      authentication: 'Authentication',
      required: 'Required',
      optional: 'Optional',
      parameters: 'Parameters',
      requestBody: 'Request Body',
      responseExample: 'Response Example',
      selectEndpoint: 'Select an endpoint to view details',
      name: 'Name',
      type: 'Type',
      status: 'Status',
    },
    ar: {
      title: 'توثيق وظائف API',
      subtitle: 'توثيق كامل لجميع نقاط النهاية التي يوفرها التطبيق',
      categories: 'الفئات',
      allCategories: 'جميع الفئات',
      method: 'الطريقة',
      endpoint: 'نقطة النهاية',
      description: 'الوصف',
      authentication: 'المصادقة',
      required: 'مطلوب',
      optional: 'اختياري',
      parameters: 'المعاملات',
      requestBody: 'جسم الطلب',
      responseExample: 'مثال الاستجابة',
      selectEndpoint: 'حدد نقطة نهاية لعرض التفاصيل',
      name: 'الاسم',
      type: 'النوع',
      status: 'الحالة',
    }
  };

  const ulmEndpoints: APIEndpoint[] = [
    {
      id: 'auth-login',
      method: 'POST',
      path: '/api/v1/auth/login',
      title: 'User Login',
      description: 'Authenticate user and receive access token',
      authentication: false,
      category: 'Authentication',
      parameters: [],
      requestBody: `{
  "username": "string",
  "password": "string"
}`,
      responseExample: `{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}`
    },
    {
      id: 'auth-logout',
      method: 'POST',
      path: '/api/v1/auth/logout',
      title: 'User Logout',
      description: 'Logout user and invalidate session',
      authentication: true,
      category: 'Authentication',
      responseExample: `{
  "message": "Successfully logged out"
}`
    },
    {
      id: 'users-list',
      method: 'GET',
      path: '/api/v1/users',
      title: 'Get All Users',
      description: 'Retrieve a list of all users (Admin only)',
      authentication: true,
      category: 'Users',
      parameters: [
        { name: 'skip', type: 'integer', required: false, description: 'Number of records to skip' },
        { name: 'limit', type: 'integer', required: false, description: 'Maximum records to return' },
        { name: 'search', type: 'string', required: false, description: 'Search query' },
      ],
      responseExample: `{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 150,
  "skip": 0,
  "limit": 100
}`
    },
    {
      id: 'users-create',
      method: 'POST',
      path: '/api/v1/users',
      title: 'Create User',
      description: 'Create a new user (Admin only)',
      authentication: true,
      category: 'Users',
      requestBody: `{
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "phone": "string",
  "role": "user"
}`,
      responseExample: `{
  "id": 2,
  "username": "new_user",
  "email": "new@example.com",
  "role": "user",
  "created_at": "2025-01-15T10:30:00Z"
}`
    },
    {
      id: 'users-update',
      method: 'PUT',
      path: '/api/v1/users/{id}',
      title: 'Update User',
      description: 'Update user information (Admin only)',
      authentication: true,
      category: 'Users',
      parameters: [
        { name: 'id', type: 'integer', required: true, description: 'User ID' },
      ],
      requestBody: `{
  "username": "string",
  "email": "user@example.com",
  "phone": "string",
  "role": "user"
}`,
      responseExample: `{
  "id": 2,
  "username": "updated_user",
  "email": "updated@example.com",
  "role": "admin",
  "updated_at": "2025-01-15T11:00:00Z"
}`
    }
  ];

  const aamEndpoints: APIEndpoint[] = [
    {
      id: 'auth-login',
      method: 'POST',
      path: '/api/v1/auth/login',
      title: 'Admin Login',
      description: 'Authenticate admin and receive access token',
      authentication: false,
      category: 'Authentication',
      requestBody: `{
  "username": "string",
  "password": "string"
}`,
      responseExample: `{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "admin": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "super_admin"
  }
}`
    },
    {
      id: 'admins-list',
      method: 'GET',
      path: '/api/v1/admins',
      title: 'Get All Admins',
      description: 'Retrieve a list of all administrators',
      authentication: true,
      category: 'Admins',
      parameters: [
        { name: 'skip', type: 'integer', required: false, description: 'Number of records to skip' },
        { name: 'limit', type: 'integer', required: false, description: 'Maximum records to return' },
      ],
      responseExample: `{
  "admins": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "role": "super_admin",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 10
}`
    },
    {
      id: 'roles-list',
      method: 'GET',
      path: '/api/v1/roles',
      title: 'Get All Roles',
      description: 'Retrieve all available roles and their permissions',
      authentication: true,
      category: 'Permissions',
      responseExample: `{
  "roles": [
    {
      "id": 1,
      "name": "admin",
      "permissions": ["users.read", "users.write", "roles.read"]
    }
  ]
}`
    },
    {
      id: 'system-logs',
      method: 'GET',
      path: '/api/v1/logs',
      title: 'Get System Logs',
      description: 'Retrieve system activity logs',
      authentication: true,
      category: 'System',
      parameters: [
        { name: 'level', type: 'string', required: false, description: 'Log level (info, warning, error)' },
        { name: 'limit', type: 'integer', required: false, description: 'Maximum records to return' },
      ],
      responseExample: `{
  "logs": [
    {
      "id": 1,
      "level": "info",
      "message": "User login successful",
      "timestamp": "2025-01-15T10:30:00Z"
    }
  ]
}`
    }
  ];

  const endpoints = appType === 'ulm' ? ulmEndpoints : aamEndpoints;
  const categories = ['all', ...new Set(endpoints.map(e => e.category))];
  const filteredEndpoints = selectedCategory === 'all' 
    ? endpoints 
    : endpoints.filter(e => e.category === selectedCategory);

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
    <div className={`api-functions ${theme}`} dir={language === 'he' || language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="api-header">
        <h1 className="api-title">{t[language].title}</h1>
        <p className="api-subtitle">{t[language].subtitle}</p>
      </div>

      <div className="api-content">
        {/* Sidebar with Categories and Endpoints */}
        <div className="api-sidebar">
          <div className="categories">
            <h3 className="sidebar-title">{t[language].categories}</h3>
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? t[language].allCategories : category}
              </button>
            ))}
          </div>

          <div className="endpoints-list">
            {filteredEndpoints.map(endpoint => (
              <div
                key={endpoint.id}
                className={`endpoint-item ${selectedEndpoint?.id === endpoint.id ? 'active' : ''}`}
                onClick={() => setSelectedEndpoint(endpoint)}
              >
                <span 
                  className="method-badge"
                  style={{ backgroundColor: getMethodColor(endpoint.method) }}
                >
                  {endpoint.method}
                </span>
                <div className="endpoint-info">
                  <div className="endpoint-title">{endpoint.title}</div>
                  <code className="endpoint-path">{endpoint.path}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content with Endpoint Details */}
        <div className="api-main">
          {selectedEndpoint ? (
            <div className="endpoint-details">
              <div className="detail-header">
                <div className="header-top">
                  <span 
                    className="method-badge large"
                    style={{ backgroundColor: getMethodColor(selectedEndpoint.method) }}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <code className="endpoint-path large">{selectedEndpoint.path}</code>
                </div>
                <h2 className="endpoint-title">{selectedEndpoint.title}</h2>
                <p className="endpoint-description">{selectedEndpoint.description}</p>
                
                {selectedEndpoint.authentication && (
                  <div className="auth-badge">
                    🔒 {t[language].authentication} {t[language].required}
                  </div>
                )}
              </div>

              {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                <div className="detail-section">
                  <h3 className="section-title">{t[language].parameters}</h3>
                  <div className="parameters-table">
                    {selectedEndpoint.parameters.map((param, idx) => (
                      <div key={idx} className="parameter-row">
                        <span className="param-name">{param.name}</span>
                        <span className="param-type">{param.type}</span>
                        <span className={`param-required ${param.required ? 'required' : 'optional'}`}>
                          {param.required ? t[language].required : t[language].optional}
                        </span>
                        <span className="param-description">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEndpoint.requestBody && (
                <div className="detail-section">
                  <h3 className="section-title">{t[language].requestBody}</h3>
                  <pre className="code-block">{selectedEndpoint.requestBody}</pre>
                </div>
              )}

              {selectedEndpoint.responseExample && (
                <div className="detail-section">
                  <h3 className="section-title">{t[language].responseExample}</h3>
                  <pre className="code-block">{selectedEndpoint.responseExample}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="no-selection">
              <span className="no-selection-icon">📚</span>
              <p>{t[language].selectEndpoint}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

