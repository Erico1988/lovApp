import { useState, useEffect } from 'react';
import { Task } from '../types/types';

export interface PlannedTask extends Task {
  marketRef: string;
  marketTitle?: string;
}

export const useTaskPlanning = () => {
  const [plannedTasks, setPlannedTasks] = useState<PlannedTask[]>([]);

  const addTaskToPlanning = (task: PlannedTask) => {
    setPlannedTasks(prev => {
      // Vérifier si la tâche existe déjà
      const exists = prev.some(t => t.id === task.id);
      if (exists) {
        // Mettre à jour la tâche existante
        return prev.map(t => t.id === task.id ? task : t);
      }
      // Ajouter la nouvelle tâche
      return [...prev, task];
    });
  };

  const removeTaskFromPlanning = (taskId: string) => {
    setPlannedTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const updateTaskInPlanning = (taskId: string, updates: Partial<PlannedTask>) => {
    setPlannedTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  };

  const getTasksByDateRange = (startDate: string, endDate: string) => {
    return plannedTasks.filter(task => {
      const taskStart = new Date(task.startDate);
      const taskEnd = new Date(task.dueDate);
      const rangeStart = new Date(startDate);
      const rangeEnd = new Date(endDate);
      
      return taskStart >= rangeStart && taskEnd <= rangeEnd;
    });
  };

  const getTasksByMarket = (marketRef: string) => {
    return plannedTasks.filter(task => task.marketRef === marketRef);
  };

  return {
    plannedTasks,
    addTaskToPlanning,
    removeTaskFromPlanning,
    updateTaskInPlanning,
    getTasksByDateRange,
    getTasksByMarket
  };
};