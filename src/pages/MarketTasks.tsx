import React, { useState, useEffect } from 'react';
import { Plus, Filter, AlertTriangle, Clock, CheckCircle, Search } from 'lucide-react';
import TaskTable from '../components/TaskTable';
import TaskFilters from '../components/TaskFilters';
import MarketSelector from '../components/MarketSelector';
import TaskForm from '../components/TaskForm';
import { Task, Market } from '../types/types';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const MarketTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedMarketForTask, setSelectedMarketForTask] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
    assignedTo: '',
    priority: '',
    startDate: '',
    endDate: '',
    progress: {
      min: '',
      max: ''
    }
  });

  // Statistiques des tâches
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'TERMINE').length,
    inProgress: tasks.filter(t => t.status === 'EN_COURS').length,
    delayed: tasks.filter(t => t.status === 'EN_RETARD').length,
    notStarted: tasks.filter(t => t.status === 'NON_COMMENCE').length
  };

  const handleMarketSelect = (marketRef: string) => {
    setSelectedMarkets(prev =>
      prev.includes(marketRef)
        ? prev.filter(ref => ref !== marketRef)
        : [...prev, marketRef]
    );
  };

  const handleTaskStart = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: 'EN_COURS', actualStartDate: new Date().toISOString() }
        : task
    ));
    toast.success('Tâche démarrée avec succès');
  };

  const handleTaskExecute = (taskId: string) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, status: 'TERMINE', actualEndDate: new Date().toISOString() }
        : task
    ));
    toast.success('Tâche terminée avec succès');
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
    toast.success('Tâche mise à jour avec succès');
  };

  const handleAddTask = (marketRef: string) => {
    setSelectedMarketForTask(marketRef);
    setIsTaskFormOpen(true);
  };

  const handleTaskSubmit = (taskData: Partial<Task>) => {
    if (selectedMarketForTask) {
      const newTask: Task = {
        id: Date.now().toString(),
        marketRef: selectedMarketForTask,
        ...taskData as Task
      };
      setTasks(prev => [...prev, newTask]);
      setIsTaskFormOpen(false);
      setSelectedMarketForTask(null);
      toast.success('Nouvelle tâche ajoutée avec succès');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedMarkets.length > 0 && !selectedMarkets.includes(task.marketRef)) {
      return false;
    }

    const matchesSearch = task.title?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesStatus = !filters.status || task.status === filters.status;
    const matchesAssignee = !filters.assignedTo || task.assignedResource === filters.assignedTo;
    const matchesPriority = !filters.priority || task.priority === filters.priority;
    const matchesStartDate = !filters.startDate || new Date(task.startDate) >= new Date(filters.startDate);
    const matchesEndDate = !filters.endDate || new Date(task.dueDate) <= new Date(filters.endDate);

    return matchesSearch && matchesStatus && matchesAssignee && 
           matchesPriority && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tâches des Marchés</h1>
          <p className="text-gray-600 mt-1">
            {filteredTasks.length} tâche(s) • {selectedMarkets.length} marché(s) sélectionné(s)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded ${showFilters ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'} shadow-sm`}
          >
            <Filter className="w-5 h-5" />
          </button>
          {selectedMarkets.length === 1 && (
            <button
              onClick={() => handleAddTask(selectedMarkets[0])}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              Nouvelle tâche
            </button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <h3 className="text-2xl font-bold text-gray-900">{taskStats.total}</h3>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <Clock className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Terminées</p>
              <h3 className="text-2xl font-bold text-green-600">{taskStats.completed}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En cours</p>
              <h3 className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En retard</p>
              <h3 className="text-2xl font-bold text-red-600">{taskStats.delayed}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Non commencées</p>
              <h3 className="text-2xl font-bold text-yellow-600">{taskStats.notStarted}</h3>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de marchés */}
      <MarketSelector
        markets={markets}
        selectedMarkets={selectedMarkets}
        onMarketSelect={handleMarketSelect}
      />

      {/* Filtres */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <TaskFilters
              filters={filters}
              onChange={setFilters}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table des tâches */}
      <div className="bg-white rounded-lg shadow-sm">
        <TaskTable
          tasks={filteredTasks}
          onTaskStart={handleTaskStart}
          onTaskExecute={handleTaskExecute}
          onUpdateTask={handleTaskUpdate}
        />
      </div>

      {/* Modal d'ajout/modification de tâche */}
      {isTaskFormOpen && (
        <TaskForm
          initialData={undefined}
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setIsTaskFormOpen(false);
            setSelectedMarketForTask(null);
          }}
          currentUser={{
            id: '1',
            name: 'RAKOTOARISOA Narindra',
            email: 'narindra.defis@gmail.com',
            role: 'ADMIN_PRINCIPAL',
            coordination: 'UCP',
            permissions: ['CIR_FIANARANTSOA', 'CIR_MANAKARA', 'CIR_FORT_DAUPHIN', 'UCP']
          }}
          selectedMarketReference={selectedMarketForTask}
        />
      )}
    </div>
  );
};

export default MarketTasks;