import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Users,
  Settings,
  Calendar,
  BarChart,
  FileCheck,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Briefcase,
  ClipboardList,
  Plane,
  UserCheck,
  Building,
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  // Initialement fermés
  const [isInternalManagementOpen, setIsInternalManagementOpen] = useState(false);
  const [isMarketManagementOpen, setIsMarketManagementOpen] = useState(false);

  const mainMenuItems = [
    { icon: Home, label: 'Tableau de bord', path: '/' },
    {
      icon: Building,
      label: 'Suivi Marchés',
      submenu: [
        { label: "Vue d'ensemble", path: '/procedures' },
        { label: 'Marchés', path: '/procedures/markets' },
        { label: 'Tâches', path: '/procedures/tasks' },
        { label: 'Planning', path: '/planning', icon: Calendar },
        { label: 'Équipe', path: '/team', icon: Users },
        { label: 'Rapports', path: '/reports', icon: BarChart },
        { label: 'Validation', path: '/validation', icon: FileCheck },
        { label: 'Alertes', path: '/alerts', icon: AlertCircle },
      ],
    },
    { icon: MessageSquare, label: 'Messages', path: '/chat' },
  ];

  const internalManagementItems = [
    { icon: ClipboardList, label: 'Tâches', path: '/tasks' },
    { icon: Plane, label: 'Missions', path: '/missions' },
    { icon: UserCheck, label: 'Congés', path: '/leave' },
  ];

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  const renderMenuItem = (item) => {
    if (item.submenu) {
      const isOpen = item.label === 'Suivi Marchés' ? isMarketManagementOpen : isInternalManagementOpen;
      const toggleMenu = item.label === 'Suivi Marchés' ? setIsMarketManagementOpen : setIsInternalManagementOpen;
      const isActiveSubmenu = item.submenu.some((subItem) => isActive(subItem.path));

      return (
        <div key={item.label}>
          <button
            onClick={() => toggleMenu(!isOpen)}
            className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
              isActiveSubmenu
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </div>
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>

          {isOpen && (
            <div className="ml-4 mt-2 space-y-2 border-l border-gray-700">
              {item.submenu.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`flex items-center gap-3 rounded-lg p-3 pl-5 transition-colors ${
                    isActive(subItem.path)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {subItem.icon && <subItem.icon className="w-5 h-5" />}
                  <span>{subItem.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (!item.path) return null;

    return (
      <Link
        key={item.path}
        to={item.path}
        className={`flex items-center gap-3 rounded-lg p-3 transition-colors ${
          isActive(item.path)
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:text-white hover:bg-gray-800'
        }`}
      >
        <item.icon className="w-5 h-5" />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">ProcureTrack</h1>
        <nav className="space-y-2">
          {mainMenuItems.map(renderMenuItem)}
          <div className="py-2">
            <button
              onClick={() => setIsInternalManagementOpen(!isInternalManagementOpen)}
              className="w-full flex items-center justify-between text-gray-300 hover:text-white p-3 rounded-lg hover:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5" />
                <span>Gestion interne</span>
              </div>
              {isInternalManagementOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {isInternalManagementOpen && (
              <div className="ml-4 mt-2 space-y-2 border-l border-gray-700">
                {internalManagementItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg p-3 pl-5 transition-colors ${
                      isActive(item.path)
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {renderMenuItem({ icon: Settings, label: 'Paramètres', path: '/settings' })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
