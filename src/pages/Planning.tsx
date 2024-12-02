import React, { useState, useEffect, useCallback } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CalendarView from './CalendarView';
import TaskTable from '../components/TaskTable';
import GanttView from '../components/GanttView';
import VarianceTracking from '../components/VarianceTracking';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Task {
  id: string;
  description: string;
  startDate: string;
  dueDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: 'NON_COMMENCE' | 'EN_COURS' | 'TERMINE' | 'EN_RETARD';
  assignedResource: string;
  marketRef: string;
  priority: 'high' | 'medium' | 'low';
  progress: number;
}

const Planning = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState({
    priority: '',
    resource: '',
    status: '',
    startDate: null as Date | null,
    endDate: null as Date | null,
  });
  const [selectedView, setSelectedView] = useState<'calendar' | 'gantt' | 'table'>('calendar');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Charger les tâches initiales
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: 'TASK-001',
        description: 'Validation des spécifications',
        startDate: '2024-03-01',
        dueDate: '2024-03-05',
        status: 'EN_COURS',
        assignedResource: 'Marie Lambert',
        marketRef: 'MARK-2024-001',
        priority: 'high',
        progress: 60
      },
      {
        id: 'TASK-002',
        description: 'Réception des offres',
        startDate: '2024-03-15',
        dueDate: '2024-03-25',
        status: 'NON_COMMENCE',
        assignedResource: 'Pierre Martin',
        marketRef: 'MARK-2024-002',
        priority: 'medium',
        progress: 0
      }
    ];
    setTasks(mockTasks);
  }, []);

  // Mettre à jour les tâches filtrées
  useEffect(() => {
    const filtered = tasks.filter(task => {
      const matchesPriority = !filters.priority || task.priority === filters.priority;
      const matchesResource = !filters.resource || task.assignedResource === filters.resource;
      const matchesStatus = !filters.status || task.status === filters.status;
      const matchesStartDate = !filters.startDate || new Date(task.startDate) >= filters.startDate;
      const matchesEndDate = !filters.endDate || new Date(task.dueDate) <= filters.endDate;

      return matchesPriority && matchesResource && matchesStatus && matchesStartDate && matchesEndDate;
    });
    setFilteredTasks(filtered);
  }, [tasks, filters]);

  // Vérifier les retards et mettre à jour les statuts
  useEffect(() => {
    const checkDelays = () => {
      const today = new Date();
      const updatedTasks = tasks.map(task => {
        if (task.status === 'EN_COURS' && new Date(task.dueDate) < today) {
          return { ...task, status: 'EN_RETARD' };
        }
        return task;
      });
      setTasks(updatedTasks);
    };

    const interval = setInterval(checkDelays, 60000); // Vérifier toutes les minutes
    return () => clearInterval(interval);
  }, [tasks]);

  const handleTaskUpdate = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks => {
      const updatedTasks = prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      
      // Déclencher la mise à jour des autres vues
      setRefreshTrigger(prev => prev + 1);
      
      return updatedTasks;
    });

    toast.success('Tâche mise à jour avec succès');
  }, []);

  const handleTaskStart = useCallback((taskId: string) => {
    handleTaskUpdate(taskId, {
      status: 'EN_COURS',
      actualStartDate: new Date().toISOString()
    });
  }, [handleTaskUpdate]);

  const handleTaskComplete = useCallback((taskId: string) => {
    handleTaskUpdate(taskId, {
      status: 'TERMINE',
      actualEndDate: new Date().toISOString(),
      progress: 100
    });
  }, [handleTaskUpdate]);

  const handleProgressUpdate = useCallback((taskId: string, progress: number) => {
    handleTaskUpdate(taskId, { progress });
  }, [handleTaskUpdate]);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const calculateTaskStatistics = useCallback(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'TERMINE').length,
      delayed: tasks.filter(t => t.status === 'EN_RETARD').length,
      inProgress: tasks.filter(t => t.status === 'EN_COURS').length,
      notStarted: tasks.filter(t => t.status === 'NON_COMMENCE').length,
    };
  }, [tasks]);

  const stats = calculateTaskStatistics();

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Planning</h1>
        <div className="flex items-center gap-4">
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value as 'calendar' | 'gantt' | 'table')}
            className="border rounded-lg px-3 py-2"
          >
            <option value="calendar">Vue Calendrier</option>
            <option value="gantt">Vue Gantt</option>
            <option value="table">Vue Tableau</option>
          </select>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Total des tâches</div>
          <div className="text-2xl font-bold">{stats.total}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-4">
          <div className="text-sm text-green-600">Terminées</div>
          <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-4">
          <div className="text-sm text-yellow-600">En cours</div>
          <div className="text-2xl font-bold text-yellow-700">{stats.inProgress}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-4">
          <div className="text-sm text-red-600">En retard</div>
          <div className="text-2xl font-bold text-red-700">{stats.delayed}</div>
        </div>
        <div className="bg-gray-50 rounded-lg shadow p-4">
          <div className="text-sm text-gray-600">Non commencées</div>
          <div className="text-2xl font-bold text-gray-700">{stats.notStarted}</div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priorité</label>
            <select
              value={filters.priority}
              onChange={(e) => handleFilterChange('priority', e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Toutes</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ressource</label>
            <select
              value={filters.resource}
              onChange={(e) => handleFilterChange('resource', e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Toutes</option>
              {Array.from(new Set(tasks.map(t => t.assignedResource))).map(resource => (
                <option key={resource} value={resource}>{resource}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option value="">Tous</option>
              <option value="NON_COMMENCE">Non commencé</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINE">Terminé</option>
              <option value="EN_RETARD">En retard</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date début</label>
            <DatePicker
              selected={filters.startDate}
              onChange={(date) => handleFilterChange('startDate', date)}
              className="w-full border rounded-lg p-2"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
            <DatePicker
              selected={filters.endDate}
              onChange={(date) => handleFilterChange('endDate', date)}
              className="w-full border rounded-lg p-2"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>

      {/* Vue principale */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {selectedView === 'calendar' && (
          <CalendarView
            tasks={filteredTasks}
            onUpdateTask={handleTaskUpdate}
            onTaskStart={handleTaskStart}
            onTaskComplete={handleTaskComplete}
          />
        )}
        {selectedView === 'gantt' && (
          <GanttView
            tasks={filteredTasks}
            onProgressUpdate={handleProgressUpdate}
            refreshTrigger={refreshTrigger}
          />
        )}
        {selectedView === 'table' && (
          <TaskTable
            tasks={filteredTasks}
            onTaskStart={handleTaskStart}
            onTaskExecute={handleTaskComplete}
            onUpdateTask={handleTaskUpdate}
          />
        )}
      </div>

      {/* Suivi des écarts */}
      <VarianceTracking tasks={filteredTasks} />
    </div>
  );
};

export default Planning;