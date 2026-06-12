import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Mail,
  Users,
  CheckSquare,
  Mic,
  Brain,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/calendar', icon: Calendar, label: 'Calendar AI' },
  { path: '/email', icon: Mail, label: 'Email Generator' },
  { path: '/meetings', icon: Users, label: 'Meetings' },
  { path: '/tasks', icon: CheckSquare, label: 'Task Planner' },
  { path: '/voice', icon: Mic, label: 'Voice AI' },
  { path: '/agents', icon: Brain, label: 'Agent Hub' },
  { path: '/chat', icon: MessageSquare, label: 'Chat' },
];

export default function Sidebar({ open, onToggle }: SidebarProps) {
  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-40 transition-all duration-300 flex flex-col ${
        open ? 'w-64' : 'w-16'
      }`}
    >
      <div className={`flex items-center h-16 border-b border-slate-200 px-4 ${open ? 'justify-between' : 'justify-center'}`}>
        {open && (
          <div className="flex items-center gap-2 animate-fade-in">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">AI Assistant</span>
          </div>
        )}
        {!open && (
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              isActive ? 'sidebar-link-active' : 'sidebar-link'
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {open && <span className="animate-fade-in">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-2">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-150"
        >
          {open ? (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span className="text-sm font-medium animate-fade-in">Collapse</span>
            </>
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
}
