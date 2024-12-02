import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { Task } from '../../types/taskTypes';

interface TaskPriorityProps {
  tasks: Task[];
}

const TaskPriority: React.FC<TaskPriorityProps> = ({ tasks }) => {
  const priorityTasks = {
    high: tasks.filter(t => t.priority === 'high'),
    medium: tasks.filter(t => t.priority === 'medium'),
    low: tasks.filter(t => t.priority === 'low'),
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-gray-500" />
        Priorités
      </h3>

      <div className="space-y-4">
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-900">Haute priorité</span>
            </div>
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm">
              {priorityTasks.high.length}
            </span>
          </div>
          <div className="space-y-2">
            {priorityTasks.high.slice(0, 3).map(task => (
              <div key={task.id} className="text-sm text-red-800">
                • {task.title}
              </div>
            ))}
            {priorityTasks.high.length > 3 && (
              <div className="text-sm text-red-600">
                +{priorityTasks.high.length - 3} autres tâches
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-900">Priorité moyenne</span>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
              {priorityTasks.medium.length}
            </span>
          </div>
          <div className="space-y-2">
            {priorityTasks.medium.slice(0, 2).map(task => (
              <div key={task.id} className="text-sm text-yellow-800">
                • {task.title}
              </div>
            ))}
            {priorityTasks.medium.length > 2 && (
              <div className="text-sm text-yellow-600">
                +{priorityTasks.medium.length - 2} autres tâches
              </div>
            )}
          </div>
        </div>

        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Priorité basse</span>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {priorityTasks.low.length}
            </span>
          </div>
          <div className="space-y-2">
            {priorityTasks.low.slice(0, 2).map(task => (
              <div key={task.id} className="text-sm text-green-800">
                • {task.title}
              </div>
            ))}
            {priorityTasks.low.length > 2 && (
              <div className="text-sm text-green-600">
                +{priorityTasks.low.length - 2} autres tâches
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskPriority;