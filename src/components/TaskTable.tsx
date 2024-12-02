import React, { useState, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaPlay, FaStop, FaEdit } from 'react-icons/fa';

interface Task {
  id: string;
  name: string;
  status: string;
  marketId: string;
  marketRef: string;
  description: string;
  assignedResource: string;
  startDate: string;
  dueDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
}

interface TaskTableProps {
  tasks: Task[];
  onTaskStart?: (taskId: string) => void;
  onTaskExecute?: (taskId: string) => void;
  onUpdateTask?: (task: Task) => void;
  onTaskStatusChange?: (task: Task) => void;
  onAddTask?: (marketRef: string) => void;
  onCloseMarket?: (marketRef: string) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onTaskStart,
  onTaskExecute,
  onUpdateTask,
  onTaskStatusChange,
  onAddTask,
  onCloseMarket,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Task | ''; direction: 'asc' | 'desc' }>({
    key: '',
    direction: 'asc',
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    let sorted = [...localTasks];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        if (a[sortConfig.key]! < b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key]! > b[sortConfig.key]!) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sorted;
  }, [localTasks, sortConfig]);

  const requestSort = (key: keyof Task) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getDelayAlerts = (task: Task) => {
    const today = new Date();
    const startDelay = Math.ceil((today.getTime() - new Date(task.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const dueDelay = Math.ceil((today.getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24));

    let alerts = [];
    if (startDelay > 0) {
      alerts.push(`Retard de démarrage de ${startDelay} jours`);
    }
    if (dueDelay > 0) {
      alerts.push(`Retard de fin de ${dueDelay} jours`);
    }
    return alerts;
  };

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask({ ...task });
  }, []);

  const handleSaveTask = useCallback(() => {
    if (!editingTask) return;

    if (
      editingTask.actualStartDate &&
      editingTask.actualEndDate &&
      new Date(editingTask.actualEndDate) < new Date(editingTask.actualStartDate)
    ) {
      alert('La date de fin réelle ne peut pas être antérieure à la date de début réelle.');
      return;
    }

    const updatedTasks = localTasks.map((task) =>
      task.id === editingTask.id ? { ...task, ...editingTask } : task
    );

    setLocalTasks(updatedTasks);
    setEditingTask(null);

    if (onUpdateTask) {
      onUpdateTask(editingTask);
    }
  }, [editingTask, localTasks, onUpdateTask]);

  const handleTaskStart = useCallback(
    (taskId: string) => {
      if (onTaskStart) {
        onTaskStart(taskId);
        handleStatusChange(taskId, 'EN_COURS');
      }
    },
    [onTaskStart]
  );

  const handleTaskExecute = useCallback(
    (taskId: string) => {
      if (onTaskExecute) {
        onTaskExecute(taskId);
        const task = localTasks.find(t => t.id === taskId);
        if (task) {
          setSelectedTask(task);
        }
      }
    },
    [onTaskExecute, localTasks]
  );

  const handleStatusChange = (taskId: string, newStatus: string) => {
    const updatedTask = localTasks.find(task => task.id === taskId);
    if (updatedTask) {
      onTaskStatusChange?.({ ...updatedTask, status: newStatus });
    }
  };

  const handleCloseMarket = () => {
    if (selectedTask && onCloseMarket) {
      onCloseMarket(selectedTask.marketRef);
      setSelectedTask(null);
    }
  };

  const handleAddNewTask = () => {
    if (selectedTask && onAddTask) {
      onAddTask(selectedTask.marketRef);
      setSelectedTask(null);
    }
  };

  const handleCancel = () => {
    setSelectedTask(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-50">
          <tr>
            {['Réf. Marché', 'Titre', 'Ressource assignée', 'Statut', 'Date de début prévue', 'Date de fin prévue', 'Date de début réelle', 'Date de fin réelle', 'Alerte retard', 'Actions'].map((header, index) => (
              <th
                key={index}
                className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer"
                onClick={() => requestSort(header.toLowerCase() as keyof Task)}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedTasks.map((task) => {
            const delayAlerts = getDelayAlerts(task);

            return (
              <tr key={task.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{task.marketRef || 'Non défini'}</td>
                <td className="px-4 py-2">{task.description || 'Sans titre'}</td>
                <td className="px-4 py-2">{task.assignedResource || 'N/A'}</td>
                <td className="px-4 py-2">{task.status || 'Non défini'}</td>
                <td className="px-4 py-2">{task.startDate ? new Date(task.startDate).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-2">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-2">{task.actualStartDate ? new Date(task.actualStartDate).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-2">{task.actualEndDate ? new Date(task.actualEndDate).toLocaleDateString() : 'N/A'}</td>
                <td className="px-4 py-2">
                  {delayAlerts.map((alert, index) => (
                    <span key={index} className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded mr-1">
                      {alert}
                    </span>
                  ))}
                </td>
                <td className="px-4 py-2 flex space-x-2">
                  {['NON_COMMENCE', 'EN RETARD'].includes(task.status) && (
                    <button
                      onClick={() => handleTaskStart(task.id)}
                      className="text-green-500 hover:text-green-600"
                    >
                      <FaPlay />
                    </button>
                  )}
                  {task.status === 'EN_COURS' && (
                    <button
                      onClick={() => handleTaskExecute(task.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FaStop />
                    </button>
                  )}
                  <button
                    onClick={() => handleEditTask(task)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <FaEdit />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Modifier la tâche</h2>
            <label className="block mb-2">
              Titre :
              <input
                type="text"
                className="border p-2 w-full"
                value={editingTask.description}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, description: e.target.value })
                }
              />
            </label>
            <label className="block mb-2">
              Date de début réelle :
              <input
                type="date"
                className="border p-2 w-full"
                value={
                  editingTask.actualStartDate
                    ? new Date(editingTask.actualStartDate).toISOString().substring(0, 10)
                    : ''
                }
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    actualStartDate: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
              />
            </label>
            <label className="block mb-2">
              Date de fin réelle :
              <input
                type="date"
                className="border p-2 w-full"
                value={
                  editingTask.actualEndDate
                    ? new Date(editingTask.actualEndDate).toISOString().substring(0, 10)
                    : ''
                }
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    actualEndDate: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
              />
            </label>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setEditingTask(null)}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSaveTask}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Options après la fin de la tâche</h2>
            <div className="flex justify-end space-x-4 mt-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleCloseMarket}
              >
                Clôturer le marché
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleAddNewTask}
              >
                Ajouter une tâche
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={handleCancel}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TaskTable.propTypes = {
  tasks: PropTypes.array.isRequired,
  onTaskStart: PropTypes.func,
  onTaskExecute: PropTypes.func,
  onUpdateTask: PropTypes.func,
  onTaskStatusChange: PropTypes.func,
  onAddTask: PropTypes.func,
  onCloseMarket: PropTypes.func,
};

export default TaskTable;
