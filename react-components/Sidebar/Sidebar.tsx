import { useState, useEffect, useLayoutEffect, useMemo } from 'react';
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
  const findExpandedItems = (items: MenuItem[], targetPath: string): string[] => {
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

  // Calculate expanded items and check if sidebar should be open
  const expandedItemsForPath = useMemo(() => {
    return findExpandedItems(menuItems, currentPath);
  }, [menuItems, currentPath]);

  const shouldBeOpen = expandedItemsForPath.length > 0;
  
  // Initialize state - start closed, will be opened by useLayoutEffect if needed
  const [collapsed, setCollapsed] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Use useLayoutEffect to set state BEFORE render - ensures sidebar opens immediately
  useLayoutEffect(() => {
    setExpandedItems(expandedItemsForPath);
    if (shouldBeOpen) {
      setCollapsed(false);
      // Clear localStorage to prevent it from overriding
      localStorage.removeItem('sidebar_collapsed');
    } else {
      // Only use localStorage if no sub-items
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved === 'true') {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    }
  }, [currentPath, expandedItemsForPath, shouldBeOpen]);

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    
    // Only persist collapse state if no active sub-items
    if (shouldBeOpen) {
      // Don't save if we have active sub-items - sidebar should always be open
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
