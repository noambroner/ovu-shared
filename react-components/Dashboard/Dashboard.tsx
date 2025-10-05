import './Dashboard.css';

interface StatCardData {
  icon: string;
  label: string;
  labelEn: string;
  value: number | string;
  change?: number;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

interface ActivityItem {
  id: string;
  icon: string;
  message: string;
  messageEn: string;
  timestamp: string;
}

interface DashboardProps {
  language: 'he' | 'en';
  theme: 'light' | 'dark';
  stats: StatCardData[];
  activities: ActivityItem[];
  quickActions?: {
    label: string;
    labelEn: string;
    icon: string;
    onClick: () => void;
  }[];
}

export const Dashboard = ({ language, theme, stats, activities, quickActions }: DashboardProps) => {
  const t = {
    welcome: language === 'he' ? 'ברוך הבא' : 'Welcome',
    recentActivity: language === 'he' ? 'פעילות אחרונה' : 'Recent Activity',
    quickActions: language === 'he' ? 'פעולות מהירות' : 'Quick Actions',
  };

  const getColorClass = (color: string) => {
    return `stat-card-${color}`;
  };

  return (
    <div className={`dashboard ${theme}`}>
      <div className="dashboard-header">
        <h1 className="dashboard-title">{t.welcome}</h1>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`stat-card ${getColorClass(stat.color)}`}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-label">
                {language === 'he' ? stat.label : stat.labelEn}
              </div>
              <div className="stat-value">{stat.value}</div>
              {stat.change !== undefined && (
                <div className={`stat-change ${stat.change >= 0 ? 'positive' : 'negative'}`}>
                  {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-content">
        {/* Quick Actions */}
        {quickActions && quickActions.length > 0 && (
          <div className="dashboard-section quick-actions-section">
            <h2 className="section-title">{t.quickActions}</h2>
            <div className="quick-actions-grid">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  className="quick-action-btn"
                  onClick={action.onClick}
                >
                  <span className="action-icon">{action.icon}</span>
                  <span className="action-label">
                    {language === 'he' ? action.label : action.labelEn}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="dashboard-section activity-section">
          <h2 className="section-title">{t.recentActivity}</h2>
          <div className="activity-list">
            {activities.length === 0 ? (
              <div className="no-activity">
                {language === 'he' ? 'אין פעילות אחרונה' : 'No recent activity'}
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-content">
                    <div className="activity-message">
                      {language === 'he' ? activity.message : activity.messageEn}
                    </div>
                    <div className="activity-timestamp">{activity.timestamp}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
