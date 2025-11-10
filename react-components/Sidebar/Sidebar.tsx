import { useState, useEffect, useMemo } from 'react';
import './Sidebar.css';

interface MenuItem {
  id: string;
  label: string;
  labelEn: string;
  icon: string;
  path: string;
  subItems?: MenuItem[];
}

interface SidebarProps {
  menuItems: MenuItem[];
  currentPath: string;
  language: 'he' | 'en';
  theme: 'light' | 'dark';
  onNavigate: (path: string) => void;
}

export const Sidebar = ({ menuItems, currentPath, language, theme, onNavigate }: SidebarProps) => {
  // Helper function to find parent items for a path
  const findExpandedItems = (items: MenuItem[], targetPath: string, parentIds: string[] = []): string[] => {
    const expanded: string[] = [];
    
    const findPath = (items: MenuItem[], targetPath: string, parentIds: string[] = []): boolean => {
      for (const item of items) {
        if (item.path === targetPath) {
          expanded.push(...parentIds);
          return true;
        }
        if (item.subItems && findPath(item.subItems, targetPath, [...parentIds, item.id])) {
          return true;
        }
      }
      return false;
    };
    
    findPath(items, targetPath);
    return expanded;
  };

  // Find parent items that should be expanded for the current path
  const getExpandedItemsForPath = useMemo(() => {
    return findExpandedItems(menuItems, currentPath);
  }, [menuItems, currentPath]);

  const hasActiveSubItems = getExpandedItemsForPath.length > 0;
  
  // Sidebar state: always open if current path has sub-items
  const [collapsed, setCollapsed] = useState(() => {
    const expanded = findExpandedItems(menuItems, currentPath);
    return expanded.length === 0 && localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const [expandedItems, setExpandedItems] = useState<string[]>(getExpandedItemsForPath);

  // Sync state with current path - always open sidebar and expand items when path has sub-items
  useEffect(() => {
    setExpandedItems(getExpandedItemsForPath);
    if (hasActiveSubItems) {
      setCollapsed(false);
      localStorage.removeItem('sidebar_collapsed');
    }
  }, [currentPath, getExpandedItemsForPath, hasActiveSubItems]);

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    
    // Only persist collapse state if no active sub-items
    if (hasActiveSubItems) {
      localStorage.removeItem('sidebar_collapsed');
    } else {
      localStorage.setItem('sidebar_collapsed', String(newCollapsed));
    }
  };

  const toggleExpand = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (path: string) => currentPath === path;
  const isExpanded = (itemId: string) => expandedItems.includes(itemId);

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const expanded = isExpanded(item.id);
    const active = isActive(item.path);
    const label = language === 'he' ? item.label : item.labelEn;

    return (
      <div key={item.id} className="sidebar-menu-item">
        <div
          className={`sidebar-item ${active ? 'active' : ''} ${level > 0 ? 'sub-item' : ''}`}
          onClick={() => {
            if (hasSubItems) {
              toggleExpand(item.id);
            } else {
              onNavigate(item.path);
            }
          }}
        >
          <span className="item-icon">{item.icon}</span>
          {!collapsed && (
            <>
              <span className="item-label">{label}</span>
              {hasSubItems && (
                <span className={`expand-icon ${expanded ? 'expanded' : ''}`}>
                  {language === 'he' ? '◀' : '▶'}
                </span>
              )}
            </>
          )}
        </div>
        {hasSubItems && expanded && !collapsed && (
          <div className="sidebar-subitems">
            {item.subItems!.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${theme}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <h2 className="sidebar-title">
            {language === 'he' ? 'תפריט ראשי' : 'Main Menu'}
          </h2>
        )}
        <button className="collapse-btn" onClick={toggleCollapse} title="Toggle Sidebar">
          {collapsed ? (language === 'he' ? '◀' : '▶') : (language === 'he' ? '▶' : '◀')}
        </button>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
    </aside>
  );
};
