import './ManagePage.css';

interface ManagePageProps {
  language: 'he' | 'en' | 'ar';
  theme: 'light' | 'dark';
}

interface ManageSection {
  id: string;
  icon: string;
  titleHe: string;
  titleEn: string;
  titleAr: string;
  descriptionHe: string;
  descriptionEn: string;
  descriptionAr: string;
  action: string;
}

export const ManagePage = ({ language, theme }: ManagePageProps) => {
  const t = {
    he: {
      pageTitle: 'ניהול',
      pageDescription: 'ניהול כללי של המערכת',
      systemManagement: 'ניהול מערכת',
      configuration: 'תצורה',
      tools: 'כלים',
      logs: 'יומנים',
      comingSoon: 'בקרוב...',
    },
    en: {
      pageTitle: 'Manage',
      pageDescription: 'General system management',
      systemManagement: 'System Management',
      configuration: 'Configuration',
      tools: 'Tools',
      logs: 'Logs',
      comingSoon: 'Coming Soon...',
    },
    ar: {
      pageTitle: 'إدارة',
      pageDescription: 'الإدارة العامة للنظام',
      systemManagement: 'إدارة النظام',
      configuration: 'التكوين',
      tools: 'الأدوات',
      logs: 'السجلات',
      comingSoon: 'قريبا...',
    }
  };

  const sections: ManageSection[] = [
    {
      id: 'system',
      icon: '🖥️',
      titleHe: 'ניהול מערכת',
      titleEn: 'System Management',
      titleAr: 'إدارة النظام',
      descriptionHe: 'תצורת מערכת, מעקב ביצועים וניטור',
      descriptionEn: 'System configuration, performance tracking and monitoring',
      descriptionAr: 'تكوين النظام وتتبع الأداء والمراقبة',
      action: t[language].comingSoon
    },
    {
      id: 'config',
      icon: '⚙️',
      titleHe: 'תצורה',
      titleEn: 'Configuration',
      titleAr: 'التكوين',
      descriptionHe: 'הגדרות כלליות ופרמטרים',
      descriptionEn: 'General settings and parameters',
      descriptionAr: 'الإعدادات والمعلمات العامة',
      action: t[language].comingSoon
    },
    {
      id: 'tools',
      icon: '🔧',
      titleHe: 'כלים',
      titleEn: 'Tools',
      titleAr: 'الأدوات',
      descriptionHe: 'כלי עזר לניהול ותחזוקה',
      descriptionEn: 'Management and maintenance tools',
      descriptionAr: 'أدوات الإدارة والصيانة',
      action: t[language].comingSoon
    },
    {
      id: 'logs',
      icon: '📋',
      titleHe: 'יומנים',
      titleEn: 'Logs',
      titleAr: 'السجلات',
      descriptionHe: 'צפייה ביומני מערכת ופעילות',
      descriptionEn: 'View system and activity logs',
      descriptionAr: 'عرض سجلات النظام والنشاط',
      action: t[language].comingSoon
    },
    {
      id: 'backup',
      icon: '💾',
      titleHe: 'גיבוי ושחזור',
      titleEn: 'Backup & Restore',
      titleAr: 'النسخ الاحتياطي والاستعادة',
      descriptionHe: 'ניהול גיבויים ושחזור נתונים',
      descriptionEn: 'Manage backups and data restoration',
      descriptionAr: 'إدارة النسخ الاحتياطية واستعادة البيانات',
      action: t[language].comingSoon
    },
    {
      id: 'security',
      icon: '🔒',
      titleHe: 'אבטחה',
      titleEn: 'Security',
      titleAr: 'الأمان',
      descriptionHe: 'הגדרות אבטחה והרשאות',
      descriptionEn: 'Security settings and permissions',
      descriptionAr: 'إعدادات الأمان والأذونات',
      action: t[language].comingSoon
    }
  ];

  const getTitle = (section: ManageSection) => {
    if (language === 'he') return section.titleHe;
    if (language === 'ar') return section.titleAr;
    return section.titleEn;
  };

  const getDescription = (section: ManageSection) => {
    if (language === 'he') return section.descriptionHe;
    if (language === 'ar') return section.descriptionAr;
    return section.descriptionEn;
  };

  return (
    <div className={`manage-page ${theme}`} dir={language === 'he' || language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="manage-header">
        <h1 className="manage-title">{t[language].pageTitle}</h1>
        <p className="manage-description">{t[language].pageDescription}</p>
      </div>

      <div className="manage-sections">
        {sections.map(section => (
          <div key={section.id} className="manage-card">
            <div className="card-icon">{section.icon}</div>
            <div className="card-content">
              <h3 className="card-title">{getTitle(section)}</h3>
              <p className="card-description">{getDescription(section)}</p>
            </div>
            <div className="card-action">
              <button className="action-btn" disabled>
                {section.action}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="manage-footer">
        <div className="info-box">
          <span className="info-icon">ℹ️</span>
          <p className="info-text">
            {language === 'he' && 'פיצ\'רים נוספים יתווספו בעתיד הקרוב'}
            {language === 'en' && 'Additional features will be added soon'}
            {language === 'ar' && 'ستتم إضافة ميزات إضافية قريبًا'}
          </p>
        </div>
      </div>
    </div>
  );
};

