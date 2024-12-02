import React from 'react';
import { Calendar, User, FileText } from 'lucide-react';
import { Task } from '../types/types';

interface TaskCardProps {
  task: Task;
}

const statusColors = {
  draft: 'bg-gray-200 text-gray-800',
  review: 'bg-yellow-200 text-yellow-800',
  published: 'bg-blue-200 text-blue-800',
  awarded: 'bg-green-200 text-green-800',
  completed: 'bg-purple-200 text-purple-800',
};

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
          <p className="text-sm text-gray-600">ID: {task.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[task.status]}`}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
      </div>
      
      <div className="space-y-3 mb-4">
        <p className="text-gray-600">{task.description}</p>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {task.assignedTo}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {task.documents?.length || 0} document(s)
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`px-3 py-1 rounded-full text-sm ${priorityColors[task.priority]}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
        
        <span className="text-sm text-gray-500">
          Budget: {task.budget.toLocaleString('fr-FR')} €
        </span>
      </div>
    </div>
  );
};

export default TaskCard;