import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, Calendar, Clock, Filter, Mail, Settings, X } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'DEADLINE' | 'VALIDATION' | 'BUDGET' | 'TASK_START' | 'TASK_END';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  date: string;
  marketRef: string;
  taskId?: string;
  isRead: boolean;
  notificationSent: boolean;
}

interface AlertSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  deadlineThreshold: number;
  notifyBeforeStart: boolean;
  notifyBeforeEnd: boolean;
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AlertSettings>({
    emailNotifications: true,
    pushNotifications: true,
    deadlineThreshold: 3,
    notifyBeforeStart: true,
    notifyBeforeEnd: true
  });

  // Simuler le chargement des alertes
  useEffect(() => {
    const mockAlerts: Alert[] = [
      {
        id: '1',
        title: 'Échéance proche',
        description: 'Le marché "Équipements informatiques" arrive à échéance dans 3 jours',
        type: 'DEADLINE',
        severity: 'HIGH',
        date: new Date().toISOString(),
        marketRef: 'MARK-2024-001',
        isRead: false,
        notificationSent: false
      },
      {
        id: '2',
        title: 'Début de tâche',
        description: 'La tâche "Installation des équipements" commence demain',
        type: 'TASK_START',
        severity: 'MEDIUM',
        date: new Date().toISOString(),
        marketRef: 'MARK-2024-002',
        taskId: 'TASK-001',
        isRead: false,
        notificationSent: true
      }
    ];
    setAlerts(mockAlerts);
  }, []);

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isRead: true } : alert
      )
    );
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleSettingsChange = (setting: keyof AlertSettings, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'DEADLINE':
        return <Calendar className="w-5 h-5" />;
      case 'TASK_START':
      case 'TASK_END':
        return <Clock className="w-5 h-5" />;
      default:
        return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.isRead;
    return alert.severity === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Centre de Notifications</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            <Settings className="w-5 h-5" />
            Paramètres
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">Toutes les alertes</option>
            <option value="unread">Non lues</option>
            <option value="HIGH">Haute priorité</option>
            <option value="MEDIUM">Priorité moyenne</option>
            <option value="LOW">Basse priorité</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="font-semibold text-red-800">Alertes critiques</h3>
          <p className="text-2xl font-bold text-red-600">
            {alerts.filter(a => a.severity === 'HIGH').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-semibold text-yellow-800">Alertes en attente</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {alerts.filter(a => !a.isRead).length}
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800">Total des notifications</h3>
          <p className="text-2xl font-bold text-blue-600">{alerts.length}</p>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className={`relative flex items-start gap-4 p-4 rounded-lg border ${
              alert.isRead ? 'bg-gray-50' : 'bg-white'
            } ${getSeverityColor(alert.severity)}`}
          >
            <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
              {getTypeIcon(alert.type)}
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{alert.title}</h3>
                  <p className="text-gray-600">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(alert.date), 'PPP', { locale: fr })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(alert.date), 'HH:mm')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!alert.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      Marquer comme lu
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Paramètres des notifications</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-gray-500" />
                  Notifications par email
                </label>
                <button
                  onClick={() =>
                    handleSettingsChange('emailNotifications', !settings.emailNotifications)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-500" />
                  Notifications push
                </label>
                <button
                  onClick={() =>
                    handleSettingsChange('pushNotifications', !settings.pushNotifications)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seuil d'alerte (jours avant échéance)
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.deadlineThreshold}
                  onChange={(e) =>
                    handleSettingsChange('deadlineThreshold', parseInt(e.target.value))
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  Notifier avant le début des tâches
                </label>
                <button
                  onClick={() =>
                    handleSettingsChange('notifyBeforeStart', !settings.notifyBeforeStart)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.notifyBeforeStart ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.notifyBeforeStart ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  Notifier avant la fin des tâches
                </label>
                <button
                  onClick={() =>
                    handleSettingsChange('notifyBeforeEnd', !settings.notifyBeforeEnd)
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    settings.notifyBeforeEnd ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      settings.notifyBeforeEnd ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;