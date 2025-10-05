// Common types for OVU applications

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  preferred_language?: string;
}

export interface MenuItem {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  path: string;
  subItems?: MenuItem[];
}

export interface StatCardData {
  icon: string;
  label: string;
  labelEn: string;
  value: number | string;
  change?: number;
  color: 'blue' | 'purple' | 'green' | 'orange';
}

export interface ActivityItem {
  id: string;
  icon: string;
  message: string;
  messageEn: string;
  timestamp: string;
}

export interface QuickAction {
  label: string;
  labelEn: string;
  icon: string;
  onClick: () => void;
}

export type Theme = 'light' | 'dark';
export type Language = 'he' | 'en';

export interface AppTranslations {
  [key: string]: string | ((param?: any) => string);
}
