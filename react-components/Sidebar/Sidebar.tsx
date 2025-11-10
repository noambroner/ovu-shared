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
  // Find which items should be expanded based on current path
  const getExpandedItemsForPath = (items: MenuItem[], path: string): string[] => {
    const expanded: string[] = [];
    
    const findPath = (items: MenuItem[], targetPath: string, parentIds: string[] = []): void => {
      for (const item of items) {
        if (item.path === targetPath) {
          // Found the active item, add all parent IDs to expanded
          expanded.push(...parentIds);
          return;
        }
        if (item.subItems) {
          findPath(item.subItems, targetPath, [...parentIds, item.id]);
        }
      }
    };
    
    findPath(items, path);
    return expanded;
  };
  
  // Check if current path has sub-items (needs sidebar to be open)
  const hasActiveSubItems = useMemo(() => {
    return getExpandedItemsForPath(menuItems, currentPath).length > 0;
  }, [menuItems, currentPath]);
  
  // Load collapsed state from localStorage, but override if we have active sub-items
  const [collapsed, setCollapsed] = useState(() => {
    // Check if current path has sub-items
    const activeSubItems = getExpandedItemsForPath(menuItems, currentPath);
    // If current path has sub-items, always open sidebar
    if (activeSubItems.length > 0) {
      return false;
    }
    // Otherwise, load from localStorage
    const saved = localStorage.getItem('sidebar_collapsed');
    return saved === 'true';
  });
  
  // Initialize expanded items based on current path
  const initialExpandedItems = useMemo(() => {
    return getExpandedItemsForPath(menuItems, currentPath);
  }, [menuItems, currentPath]);
  
  const [expandedItems, setExpandedItems] = useState<string[]>(initialExpandedItems);
  
  // Update expanded items when path changes
  useEffect(() => {
    const newExpanded = getExpandedItemsForPath(menuItems, currentPath);
    setExpandedItems(newExpanded);
    
    // If we have an active path with sub-items, always open sidebar
    if (newExpanded.length > 0) {
      setCollapsed(false);
      // Don't save to localStorage when auto-opening for active sub-items
    }
  }, [currentPath, menuItems]);

  const toggleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    
    // Only save to localStorage if we're not in a state where sidebar should be open
    // (i.e., if there are no active sub-items)
    if (!hasActiveSubItems) {
      localStorage.setItem('sidebar_collapsed', String(newCollapsed));
    } else {
      // If we're trying to collapse when we have active sub-items, don't save
      // This ensures sidebar opens on refresh if there are active sub-items
      if (newCollapsed) {
        // User manually collapsed, but we won't persist this if there are active sub-items
        // Remove from localStorage so it opens on refresh
        localStorage.removeItem('sidebar_collapsed');
      }
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
