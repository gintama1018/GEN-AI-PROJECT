import {
    BookOpen,
    Wand2,
    Settings,
    Sparkles
} from 'lucide-react';
import { useState } from 'react';

type AppTab = 'learning' | 'content';

interface SidebarProps {
    activeTab: AppTab;
    onTabChange: (tab: AppTab) => void;
    onSettingsClick: () => void;
}

export const Sidebar = ({ activeTab, onTabChange, onSettingsClick }: SidebarProps) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <aside
            className="sidebar"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="mb-8 flex items-center justify-center w-full relative">
                <div style={{
                    width: 40,
                    height: 40,
                    background: 'var(--bg-surface-hover)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid var(--border-subtle)'
                }}>
                    <Sparkles color="var(--text-primary)" size={20} />
                </div>

                <span style={{
                    position: 'absolute',
                    left: 80,
                    opacity: isHovered ? 1 : 0,
                    transition: 'opacity 0.2s',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    fontFamily: 'var(--font-ui)',
                    letterSpacing: '-0.02em',
                    whiteSpace: 'nowrap'
                }}>
                    GeminiMind
                </span>
            </div>

            <div className="w-full px-2 flex flex-col gap-2">
                <div
                    className={`sidebar-item ${activeTab === 'learning' ? 'active' : ''}`}
                    onClick={() => onTabChange('learning')}
                >
                    <BookOpen className="sidebar-icon" size={24} />
                    <span style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}>Learning Tool</span>
                </div>

                <div
                    className={`sidebar-item ${activeTab === 'content' ? 'active' : ''}`}
                    onClick={() => onTabChange('content')}
                >
                    <Wand2 className="sidebar-icon" size={24} />
                    <span style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}>Content Gen</span>
                </div>
            </div>

            <div className="mt-auto w-full px-2">
                <div className="sidebar-item" onClick={onSettingsClick}>
                    <Settings className="sidebar-icon" size={24} />
                    <span style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 0.2s' }}>API Settings</span>
                </div>
            </div>
        </aside>
    );
};
