/**
 * TaskQueue Component
 * Props: { id?: any }
 */

// Note: This component uses Tailwind CSS utility classes only.
// No custom component library dependencies.
// Ensure responsive (sm:, md:, lg:) and dark mode (dark:) classes are included.
import React, {  useState, useMemo, useEffect  } from 'https://esm.sh/react@18';
import { CheckCircle2, Circle, Clock, Loader2, X, Plus, ChevronDown, ChevronRight } from 'lucide-react';
 // Import TaskGroup

// Re-declare TaskWithUsage to match the App.tsx's passing type
interface TaskWithUsage extends Task {
  totalTokenUsage?: number; // Sum of tokens from all its runs
}

interface TaskQueueProps {
  tasks: TaskWithUsage[];
  taskGroups: TaskGroup[]; // NEW: Added prop
  onDelete: (id: string) => void;
  onAdd: (title: string) => void;
}

export default function TaskQueue: React.FC<TaskQueueProps> = ({ tasks, taskGroups, onDelete, onAdd }) => {
  const [newTask, setNewTask] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const handleAdd = () => {
    if (!newTask.trim()) return;
    onAdd(newTask);
    setNewTask('');
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  // Group tasks by task_group_id and map to TaskGroup titles
  const groupedTasks = useMemo(() => {
    const groupsMap: Record<string, { group: TaskGroup | null; tasks: TaskWithUsage[]; totalTokens: number }> = {};

    // Initialize groups with actual TaskGroup objects
    taskGroups.forEach(group => {
      groupsMap[group.id] = { group, tasks: [], totalTokens: 0 };
    });

    // Handle tasks without a group (or not yet synced to a group)
    const noGroupPlaceholder: TaskGroup = { id: 'no-group', app_id: '', title: 'Tasks without a group', status: 'active', created_at: new Date(0).toISOString() };
    if (!groupsMap['no-group']) {
      groupsMap['no-group'] = { group: noGroupPlaceholder, tasks: [], totalTokens: 0 };
    }

    tasks.forEach(task => {
      const groupId = task.task_group_id || 'no-group';
      if (!groupsMap[groupId]) {
        // This case should ideally not happen if taskGroups are synced, but as fallback
        groupsMap[groupId] = { 
            group: { id: groupId, app_id: '', title: `Task Group ${groupId.substring(0, 8)}... (unsynced)`, status: 'active', created_at: task.created_at || new Date().toISOString() }, 
            tasks: [], 
            totalTokens: 0 
        };
      }
      groupsMap[groupId].tasks.push(task);
      groupsMap[groupId].totalTokens += (task.totalTokenUsage || 0);
    });

    // Filter out empty groups that were just initialized but got no tasks
    const populatedGroups = Object.values(groupsMap).filter(g => g.tasks.length > 0 || g.group?.id === 'no-group');

    // Sort tasks within each group by creation time
    populatedGroups.forEach(groupData => {
      groupData.tasks.sort((a, b) => new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime());
    });
    
    // Sort groups themselves by creation date (newest first)
    return populatedGroups.sort((a, b) => new Date(b.group?.created_at || '').getTime() - new Date(a.group?.created_at || '').getTime());

  }, [tasks, taskGroups]);

  // Expand the latest group automatically when new groups are added
  useEffect(() => {
    if (groupedTasks.length > 0) {
      const latestGroupId = groupedTasks[0]?.group?.id;
      if (latestGroupId && !expandedGroups[latestGroupId]) {
        setExpandedGroups(prev => ({ ...prev, [latestGroupId]: true }));
      }
    }
  }, [groupedTasks.length]); // Only trigger when number of groups changes

  return (
    <div className="flex flex-col h-full bg-[#09090b]">
       <div className="p-4 border-b border-white/5 bg-[#0c0c0e]">
         <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Execution Plan</h3>
         <div className="flex gap-2">
            <input 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Add a task..."
              className="flex-1 bg-[#18181b] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-indigo-500/50 outline-none"
            />
            <button onClick={handleAdd} className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded-lg hover:bg-indigo-600/30 transition-colors">
               <Plus size={14} />
            </button>
         </div>
       </div>

       <div className="flex-1 overflow-y-auto p-2 space-y-3"> {/* Increased space-y to make groups visually distinct */}
          {tasks.length === 0 ? (
             <div className="text-center py-10 opacity-30">
                <Clock size={32} className="mx-auto mb-2" />
                <p className="text-[10px] uppercase font-bold">No tasks queued</p>
             </div>
          ) : (
            groupedTasks.map((groupData) => { // Use groupData directly
                const group = groupData.group;
                const isExpanded = expandedGroups[group?.id || 'no-group'] || false;
                const pendingCount = groupData.tasks.filter(t => t.status === 'pending').length;
                const inProgressCount = groupData.tasks.filter(t => t.status === 'in-progress').length;
                const completedCount = groupData.tasks.filter(t => t.status === 'completed').length;
                const failedCount = groupData.tasks.filter(t => t.status === 'failed').length;

                let groupStatusIcon = <Circle size={12} className="text-slate-600" />;
                if (inProgressCount > 0) groupStatusIcon = <Loader2 size={12} className="text-indigo-400 animate-spin" />;
                else if (pendingCount === 0 && failedCount === 0 && completedCount === groupData.tasks.length && groupData.tasks.length > 0) groupStatusIcon = <CheckCircle2 size={12} className="text-emerald-500" />;
                else if (failedCount > 0) groupStatusIcon = <X size={12} className="text-red-500" />;

                const groupTitleDisplay = group?.title || `Task Group ${group?.id?.substring(0, 8)}...`;
                const groupTotalTasks = groupData.tasks.length;

                return (
                    <div key={group?.id || 'no-group'} className="bg-[#121214] border border-white/5 rounded-lg overflow-hidden">
                        <button
                            className="w-full flex items-center justify-between p-3 cursor-pointer hover:bg-[#18181b] transition-colors"
                            onClick={() => toggleGroup(group?.id || 'no-group')}
                        >
                            <div className="flex items-center gap-2">
                                {isExpanded ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                                {groupStatusIcon}
                                <span className="text-sm font-semibold text-slate-200 truncate">{groupTitleDisplay}</span>
                                {groupData.totalTokens > 0 && (
                                    <span className="ml-2 text-[10px] font-mono text-slate-500">
                                        ({groupData.totalTokens} tokens)
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] text-slate-500">{groupTotalTasks} tasks</span>
                        </button>
                        {isExpanded && ( // Only render tasks if group is expanded
                            <div className="border-t border-white/5 p-2 space-y-1">
                                {groupData.tasks.map((task) => (
                                    <div key={task.id} className={`flex items-start gap-3 p-3 rounded-lg transition-all ${ // Removed group-specific background to let task status define it
                                        task.status === 'in-progress' 
                                          ? 'bg-indigo-500/5' // Lighter bg for in-progress tasks
                                          : task.status === 'completed'
                                          ? 'bg-emerald-500/5 opacity-60' // Lighter bg for completed tasks
                                          : 'bg-transparent' // Default for pending/failed within group
                                     }`}>
                                        <div className="mt-0.5 shrink-0">
                                           {task.status === 'completed' && <CheckCircle2 size={14} className="text-emerald-500" />}
                                           {task.status === 'in-progress' && <Loader2 size={14} className="text-indigo-400 animate-spin" />}
                                           {task.status === 'pending' && <Circle size={14} className="text-slate-600" />}
                                           {task.status === 'failed' && <X size={14} className="text-red-500" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                           <p className={`text-xs font-medium truncate ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                                              {task.title}
                                           </p>
                                        </div>
                                        {task.status === 'pending' && (
                                           <button onClick={() => onDelete(task.id)} className="p-1 text-slate-600 hover:text-red-400 transition-colors rounded-md">
                                              <X size={12} />
                                           </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })
          )}
       </div>
    </div>
  );
};
