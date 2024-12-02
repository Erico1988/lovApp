import React, { useState, useEffect } from 'react';
import { Plus, Filter, Calendar, Clock, AlertTriangle, Search, LayoutGrid, LayoutList, SlidersHorizontal, BarChart2, TrendingUp, Table } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ProjectTable from '../components/ProjectTable';
import TaskTable from '../components/TaskTable';
import TaskForm from '../components/TaskForm';
import Modal from '../components/Modal'; // Custom Modal component
import MarketFormModal from '../components/MarketFormModal';
import AdvancedFilters from '../components/AdvancedFilters';
import TaskFilters from '../components/TaskFilters';
import { Task, User, TaskHistory, Market } from '../types/types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar, Pie } from 'react-chartjs-2';
import ReactModal from 'react-modal'; // Renamed Modal from react-modal
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Set the app element for react-modal
ReactModal.setAppElement('#root');

// Mock user data
const mockCurrentUser: User = {
  id: '1',
  name: 'RAKOTOARISOA Narindra',
  email: 'narindra.defis@gmail.com',
  role: 'ADMIN_PRINCIPAL',
  coordination: 'UCP',
  permissions: ['CIR_FIANARANTSOA', 'CIR_MANAKARA', 'CIR_FORT_DAUPHIN', 'UCP'],
};

type ViewMode = 'list' | 'kanban' | 'timeline' | 'table';

const Procedures = () => {
  // State management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMarketModalOpen, setIsMarketModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [taskHistory, setTaskHistory] = useState<TaskHistory[]>([]);
  const [selectedMarketReferences, setSelectedMarketReferences] = useState<string[]>([]);
  const [selectedMarketRefForNewTask, setSelectedMarketRefForNewTask] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTaskFilters, setShowTaskFilters] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Analytics data state
  const [analyticsData, setAnalyticsData] = useState({
    taskCompletion: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Completed Tasks',
          data: [12, 19, 15, 25, 22, 30],
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    },
    marketDistribution: {
      labels: ['En cours', 'Terminé', 'En retard', 'Non commencé'],
      datasets: [
        {
          data: [30, 20, 10, 40],
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(255, 99, 132, 0.8)',
            'rgba(255, 206, 86, 0.8)',
          ],
        },
      ],
    },
    progressTrend: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          label: 'Actual Progress',
          data: [20, 45, 60, 80],
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
        },
        {
          label: 'Planned Progress',
          data: [25, 50, 75, 100],
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
        },
      ],
    },
  });

  // Filters state
  const [filters, setFilters] = useState({
    searchTerm: '',
    marketType: '',
    coordination: '',
    status: '',
    startDate: '',
    endDate: '',
    budget: { min: '', max: '' },
    priority: '',
    indicator: ''
  });

  const [taskFilters, setTaskFilters] = useState({
    searchTerm: '',
    status: '',
    assignedTo: '',
    priority: '',
    startDate: '',
    endDate: '',
    progress: { min: '', max: '' },
    reductionDevelopment: ''
  });

  // Handlers
  const handleMarketSelect = (marketRef: string) => {
    setSelectedMarketReferences(prev =>
      prev.includes(marketRef)
        ? prev.filter(ref => ref !== marketRef)
        : [...prev, marketRef]
    );
  };

  const handleOpenNewTaskModal = (marketRef: string) => {
    setSelectedMarketRefForNewTask(marketRef);
    setIsModalOpen(true);
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

  const handleAddTask = (newTask: Partial<Task>) => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask as Task
    };
    setTasks(prev => [...prev, task]);
    setIsModalOpen(false);
    toast.success('Nouvelle tâche ajoutée');
  };

  const handleAddMarket = (newMarket: Market) => {
    setMarkets(prev => [...prev, newMarket]);
    setIsMarketModalOpen(false);
    toast.success('Nouveau marché ajouté');
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleTaskFilterChange = (newFilters: any) => {
    setTaskFilters(newFilters);
  };

  const handleUpdateMarketStatus = (marketRef: string) => {
    setMarkets(prev => prev.map(market => {
      if (market.marketRef === marketRef) {
        const allTasks = tasks.filter(task => task.marketRef === marketRef);
        const completedTasks = allTasks.filter(task => task.status === 'TERMINE');
        const newStatus = completedTasks.length === allTasks.length ? 'TERMINE' :
                         completedTasks.length > 0 ? 'EN_COURS' : 'NON_COMMENCE';
        return { ...market, status: newStatus };
      }
      return market;
    }));
  };

  // Filter tasks based on current filters
  useEffect(() => {
    const filtered = tasks.filter(task => {
      const matchesSearch = task.title?.toLowerCase().includes(taskFilters.searchTerm.toLowerCase());
      const matchesStatus = !taskFilters.status || task.status === taskFilters.status;
      const matchesAssignee = !taskFilters.assignedTo || task.assignedTo === taskFilters.assignedTo;
      const matchesPriority = !taskFilters.priority || task.priority === taskFilters.priority;

      return matchesSearch && matchesStatus && matchesAssignee && matchesPriority;
    });
    setFilteredTasks(filtered);
  }, [tasks, taskFilters]);

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Task Completion Trend',
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Progress Comparison',
      },
    },
  };

  // Render analytics dashboard
  const renderAnalyticsDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Task Completion Trend</h3>
        <Line data={analyticsData.taskCompletion} options={lineChartOptions} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Market Distribution</h3>
        <Pie data={analyticsData.marketDistribution} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
        <h3 className="text-lg font-semibold mb-4">Progress Tracking</h3>
        <Bar data={analyticsData.progressTrend} options={barChartOptions} />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marchés</h1>
          <p className="text-gray-600 mt-1">
            {markets.length} marché(s) • {tasks.length} tâche(s)
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className={`p-2 rounded ${
              showAnalytics ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'
            } shadow-sm`}
            title="Afficher/Masquer les analyses"
          >
            <BarChart2 className="w-5 h-5" />
          </button>
          <div className="flex items-center bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              title="Vue liste"
            >
              <LayoutList className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              title="Vue kanban"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`p-2 rounded ${viewMode === 'timeline' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              title="Vue chronologique"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded ${viewMode === 'table' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
              title="Vue tableau"
            >
              <Table className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded ${showFilters ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'} shadow-sm`}
            title="Afficher/Masquer les filtres"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsMarketModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nouveau Marché
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {renderAnalyticsDashboard()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <AdvancedFilters
              onFilterChange={handleFilterChange}
              totalResults={markets.length}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1">
        <ProjectTable
          markets={markets}
          currentUser={mockCurrentUser}
          onMarketSelect={handleMarketSelect}
          onAddTask={handleOpenNewTaskModal}
          onTaskStart={handleTaskStart}
          onTaskExecute={handleTaskExecute}
          onUpdateMarketStatus={handleUpdateMarketStatus}
        />
      </div>

      {/* Tasks Section */}
      <div className="w-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Tâches</h2>
          <button
            onClick={() => setShowTaskFilters(!showTaskFilters)}
            className={`p-2 rounded ${showTaskFilters ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600'} shadow-sm`}
            title="Afficher/Masquer les filtres des tâches"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <AnimatePresence>
          {showTaskFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-4"
            >
              <TaskFilters
                filters={taskFilters}
                onChange={handleTaskFilterChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="text-sm text-gray-600 mb-2">
            {selectedMarketReferences.length} marché(s) sélectionné(s)
          </div>
          <div className="text-sm text-gray-600">
            {filteredTasks.length} tâche(s) trouvée(s)
          </div>
        </div>

        <div className="mt-4 flex-1 overflow-auto">
          {selectedMarketReferences.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm">
              <TaskTable
                tasks={filteredTasks.filter((task) => selectedMarketReferences.includes(task.marketRef))}
                onTaskStart={handleTaskStart}
                onTaskExecute={handleTaskExecute}
                onUpdateTask={handleTaskUpdate}
              />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
              <div className="font-medium mb-2">Aucun marché sélectionné</div>
              <p className="text-sm">Sélectionnez un ou plusieurs marchés pour voir les tâches associées</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ReactModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
          setSelectedMarketRefForNewTask(null);
        }}
        title={selectedTask ? 'Modifier la tâche' : 'Nouvelle tâche'}
      >
        <TaskForm
          initialData={selectedTask || undefined}
          onSubmit={selectedTask ? handleTaskUpdate : handleAddTask}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedTask(null);
            setSelectedMarketRefForNewTask(null);
          }}
          currentUser={mockCurrentUser}
          selectedMarketReference={selectedMarketRefForNewTask}
        />
      </ReactModal>

      <MarketFormModal
        isOpen={isMarketModalOpen}
        onClose={() => setIsMarketModalOpen(false)}
        onSubmit={handleAddMarket}
        currentUser={mockCurrentUser}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Procedures;
