import React, { useEffect, useState } from 'react';
import './UserActivityHistory.css';

interface ActivityRecord {
  id: number;
  joined_at: string;
  left_at: string | null;
  scheduled_left_at: string | null;
  actual_left_at: string | null;
  action_type: string;
  performed_by_username: string | null;
  reason: string | null;
  duration_days: number | null;
  is_current: boolean;
  created_at: string;
}

interface UserActivityHistoryProps {
  userId: number;
  apiBaseUrl: string;
  authToken: string;
  translations: {
    activityHistory: string;
    joinedAt: string;
    leftAt: string;
    scheduledAt: string;
    actionType: string;
    performedBy: string;
    reason: string;
    duration: string;
    days: string;
    active: string;
    inactive: string;
    noHistory: string;
    loading: string;
    error: string;
    current: string;
  };
  preferredLanguage?: string;
}

const actionTypeTranslations: Record<string, Record<string, string>> = {
  activated: { he: 'הופעל', en: 'Activated', ar: 'مفعل' },
  deactivated_immediate: { he: 'הושבת מיידי', en: 'Deactivated Immediately', ar: 'معطل فورا' },
  deactivated_scheduled: { he: 'תוזמן להשבתה', en: 'Scheduled for Deactivation', ar: 'مجدول للتعطيل' },
  auto_deactivated: { he: 'הושבת אוטומטית', en: 'Auto Deactivated', ar: 'معطل تلقائيا' },
  schedule_cancelled: { he: 'תזמון בוטל', en: 'Schedule Cancelled', ar: 'ألغي الجدول' },
  reactivated: { he: 'הופעל מחדש', en: 'Reactivated', ar: 'أعيد تفعيله' }
};

export const UserActivityHistory: React.FC<UserActivityHistoryProps> = ({
  userId,
  apiBaseUrl,
  authToken,
  translations,
  preferredLanguage = 'he'
}) => {
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isRTL = preferredLanguage === 'he' || preferredLanguage === 'ar';

  useEffect(() => {
    fetchActivityHistory();
  }, [userId]);

  const fetchActivityHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${apiBaseUrl}/api/users/${userId}/activity-history`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setActivities(data);
    } catch (err) {
      console.error('Error fetching activity history:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString(preferredLanguage, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionTypeLabel = (actionType: string) => {
    return actionTypeTranslations[actionType]?.[preferredLanguage] || actionType;
  };

  const getActionTypeClass = (actionType: string) => {
    if (actionType.includes('activated') || actionType === 'reactivated') {
      return 'action-type-active';
    }
    if (actionType.includes('deactivated')) {
      return 'action-type-inactive';
    }
    if (actionType === 'schedule_cancelled') {
      return 'action-type-cancelled';
    }
    return 'action-type-default';
  };

  if (loading) {
    return (
      <div className={`activity-history-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="loading-state">{translations.loading}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`activity-history-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="error-state">{translations.error}: {error}</div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={`activity-history-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="empty-state">{translations.noHistory}</div>
      </div>
    );
  }

  return (
    <div className={`activity-history-container ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <h3 className="activity-history-title">{translations.activityHistory}</h3>
      
      <div className="activity-timeline">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className={`activity-record ${activity.is_current ? 'current-period' : ''}`}
          >
            <div className="activity-header">
              <span className={`action-type-badge ${getActionTypeClass(activity.action_type)}`}>
                {getActionTypeLabel(activity.action_type)}
              </span>
              {activity.is_current && (
                <span className="current-badge">{translations.current}</span>
              )}
            </div>

            <div className="activity-details">
              <div className="detail-row">
                <span className="detail-label">{translations.joinedAt}:</span>
                <span className="detail-value">{formatDate(activity.joined_at)}</span>
              </div>

              {activity.left_at && (
                <div className="detail-row">
                  <span className="detail-label">{translations.leftAt}:</span>
                  <span className="detail-value">{formatDate(activity.left_at)}</span>
                </div>
              )}

              {activity.scheduled_left_at && (
                <div className="detail-row">
                  <span className="detail-label">{translations.scheduledAt}:</span>
                  <span className="detail-value scheduled-time">
                    {formatDate(activity.scheduled_left_at)}
                  </span>
                </div>
              )}

              {activity.duration_days !== null && (
                <div className="detail-row">
                  <span className="detail-label">{translations.duration}:</span>
                  <span className="detail-value">
                    {activity.duration_days.toFixed(1)} {translations.days}
                  </span>
                </div>
              )}

              {activity.performed_by_username && (
                <div className="detail-row">
                  <span className="detail-label">{translations.performedBy}:</span>
                  <span className="detail-value">{activity.performed_by_username}</span>
                </div>
              )}

              {activity.reason && (
                <div className="detail-row reason-row">
                  <span className="detail-label">{translations.reason}:</span>
                  <span className="detail-value reason-text">{activity.reason}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserActivityHistory;








