import { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Clock,
  Target,
  Sparkles,
  Filter,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  AlertCircle,
} from 'lucide-react';
import type { Task, Priority, TaskStatus } from '../../types';
import { generateAIResponse } from '../../lib/ai-simulation';

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Review Q4 Budget Proposal',
    description: 'Review and approve the Q4 budget proposal from the finance team',
    priority: 'urgent',
    status: 'pending',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    category: 'finance',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Prepare Quarterly Presentation',
    description: 'Create slides for the quarterly business review',
    priority: 'high',
    status: 'in_progress',
    due_date: new Date(Date.now() + 172800000).toISOString(),
    category: 'presentation',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Follow up with Engineering Team',
    description: 'Check on sprint deliverables and blockers',
    priority: 'medium',
    status: 'pending',
    due_date: new Date(Date.now() + 259200000).toISOString(),
    category: 'engineering',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Update Project Dashboard',
    description: 'Refresh metrics and KPIs on the project dashboard',
    priority: 'low',
    status: 'pending',
    due_date: null,
    category: 'admin',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Draft Partnership Proposal',
    description: 'Write proposal for the strategic partnership initiative',
    priority: 'high',
    status: 'pending',
    due_date: new Date(Date.now() + 345600000).toISOString(),
    category: 'partnerships',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const priorityIcons: Record<Priority, typeof ArrowUp> = {
  urgent: AlertCircle,
  high: ArrowUp,
  medium: ArrowRight,
  low: ArrowDown,
};

const priorityColor: Record<Priority, string> = {
  urgent: 'text-red-600 bg-red-50 border-red-200',
  high: 'text-orange-600 bg-orange-50 border-orange-200',
  medium: 'text-blue-600 bg-blue-50 border-blue-200',
  low: 'text-slate-600 bg-slate-50 border-slate-200',
};

export default function TaskPlanner() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<Priority | 'all'>('all');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Priority,
    due_date: '',
    category: '',
  });

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.priority === filter);
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const priorityOrder: Record<Priority, number> = { urgent: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleAddTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      priority: newTask.priority,
      status: 'pending',
      due_date: newTask.due_date ? new Date(newTask.due_date).toISOString() : null,
      category: newTask.category || 'general',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, task]);
    setShowAddTask(false);
    setNewTask({ title: '', description: '', priority: 'medium', due_date: '', category: '' });
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleStatusChange = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, updated_at: new Date().toISOString() } : t))
    );
  };

  const handleAiPlan = () => {
    const pendingTasks = tasks.filter((t) => t.status === 'pending');
    const input = pendingTasks.map((t) => t.title).join(', ');
    const response = generateAIResponse('executive', 'priorities', input);
    setAiSuggestion(response);
  };

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const inProgressCount = tasks.filter((t) => t.status === 'in_progress').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckSquare className="w-7 h-7 text-blue-600" />
            Task Planner
          </h1>
          <p className="text-slate-500 mt-1">AI-powered task management and priority planning</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAiPlan} className="btn-secondary flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> AI Plan
          </button>
          <button onClick={() => setShowAddTask(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
          <p className="text-xs text-slate-500">Pending</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
          <p className="text-xs text-slate-500">In Progress</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
          <p className="text-xs text-slate-500">Completed</p>
        </div>
      </div>

      {/* AI Suggestion */}
      {aiSuggestion && (
        <div className="card p-5 bg-blue-50/50 border-blue-200 animate-fade-in">
          <h3 className="text-sm font-semibold text-blue-800 flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4" /> AI Priority Suggestion
          </h3>
          <p className="text-sm text-blue-700 whitespace-pre-line">{aiSuggestion}</p>
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-slate-400" />
        {(['all', 'urgent', 'high', 'medium', 'low'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              filter === f
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="card p-6">
        <div className="space-y-3">
          {sortedTasks.map((task) => {
            const PriorityIcon = priorityIcons[task.priority];
            return (
              <div
                key={task.id}
                className={`border rounded-lg p-4 transition-all duration-200 ${
                  task.status === 'completed' ? 'opacity-60 border-slate-200' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${priorityColor[task.priority]}`}>
                      <PriorityIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                        {task.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`badge ${priorityColor[task.priority].split(' ').slice(1).join(' ')}`}>
                          {task.priority}
                        </span>
                        {task.due_date && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </span>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task.id, e.target.value as TaskStatus)}
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1 bg-white"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade-in">
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" /> Add New Task
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Title</label>
                <input
                  className="input-field"
                  value={newTask.title}
                  onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Description</label>
                <textarea
                  className="textarea-field"
                  rows={2}
                  value={newTask.description}
                  onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Task description"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Priority</label>
                  <select
                    className="input-field"
                    value={newTask.priority}
                    onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value as Priority }))}
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 mb-1 block">Due Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={newTask.due_date}
                    onChange={(e) => setNewTask((p) => ({ ...p, due_date: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Category</label>
                <input
                  className="input-field"
                  value={newTask.category}
                  onChange={(e) => setNewTask((p) => ({ ...p, category: e.target.value }))}
                  placeholder="e.g., engineering, finance"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddTask(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={handleAddTask} disabled={!newTask.title.trim()} className="btn-primary flex-1">
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
