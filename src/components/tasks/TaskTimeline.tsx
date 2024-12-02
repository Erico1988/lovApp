import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Task } from '../../types/taskTypes';

interface TaskTimelineProps {
  tasks: Task[];
}

const TaskTimeline: React.FC<TaskTimelineProps> = ({ tasks }) => {
  const sortedTasks = [...tasks].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-gray-500" />
        Chronologie
      </h3>

      <div className="space-y-4">
        {sortedTasks.map((task, index) => (
          <div key={task.id} className="relative pl-6">
            {index !== sortedTasks.length - 1 && (
              <div className="absolute left-2.5 top-6 w-px h-full bg-gray-200" />
            )}
            <div className="relative">
              <div className="absolute left-[-1.625rem] top-1.5 w-3 h-3 rounded-full bg-blue-600" />
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{task.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(task.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>→</span>
                    <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
                {task.subtasks.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-gray-500 mb-1">
                      Sous-tâches: {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-600 h-1.5 rounded-full"
                        style={{
                          width: `${(task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskTimeline;