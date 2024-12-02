import React, { useEffect, useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Détermine le titre de la page en fonction du chemin
  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/':
        return 'Tableau de bord';
      case '/procedures':
        return 'Marchés';
      case '/planning':
        return 'Planning';
      case '/team':
        return 'Équipe';
      case '/reports':
        return 'Rapports';
      case '/validation':
        return 'Validation';
      case '/alerts':
        return 'Alertes';
      case '/settings':
        return 'Paramètres';
      default:
        return 'Page non trouvée';
    }
  };

  // Change dynamiquement le titre de la fenêtre
  useEffect(() => {
    document.title = `App - ${getPageTitle()}`;
  }, [location.pathname]);

  // Simule des notifications périodiques
  useEffect(() => {
    const interval = setInterval(() => {
      const newNotifications = [
        { id: Date.now(), message: 'Nouvelle alerte !' },
        ...notifications,
      ];
      setNotifications(newNotifications);
      setNotificationCount(newNotifications.length);
    }, 10000); // Simule une nouvelle notification toutes les 10 secondes

    return () => clearInterval(interval);
  }, [notifications]);

  // Gestion de la recherche
  const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Simule une requête vers une API
    console.log(`Rechercher : ${query}`);
    // Exemple de gestion API : fetch(`/api/search?q=${query}`).then(...)
  };

  // Affiche les notifications dans une liste
  const renderNotifications = () => (
    notifications.length > 0 ? (
      <ul className="absolute right-0 mt-12 w-64 bg-white rounded-lg shadow-lg z-20">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className="px-4 py-2 border-b last:border-none hover:bg-gray-100 text-gray-700"
          >
            {notification.message}
          </li>
        ))}
        <li className="px-4 py-2 text-center text-blue-500 cursor-pointer hover:bg-gray-100">
          Voir toutes les notifications
        </li>
      </ul>
    ) : (
      <p className="px-4 py-2 text-gray-500">Aucune notification</p>
    )
  );

  return (
    <header className="h-16 bg-white shadow-sm fixed top-0 right-0 left-64 z-10 flex items-center justify-between px-6">
      {/* Section gauche : Titre de la page et barre de recherche */}
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
        <div className="hidden lg:block max-w-xl">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Section droite : Notifications et profil utilisateur */}
      <div className="flex items-center gap-4 relative">
        {/* Icône de notification */}
        <button
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full"
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        >
          <Bell className="w-6 h-6" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
        {isProfileMenuOpen && renderNotifications()}

        {/* Profil utilisateur */}
        <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200">
          {/* Informations utilisateur */}
          <div className="text-right hidden lg:block">
            <p className="text-sm font-medium text-gray-900">RAKOTOARISOA Narindra</p>
            <p className="text-xs text-gray-500">Administrateur</p>
          </div>
          {/* Avatar utilisateur */}
          <div
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          >
            <User className="w-6 h-6 text-gray-600" />
          </div>
          {/* Menu déroulant du profil */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-12 w-48 bg-white rounded-lg shadow-lg z-20">
              <a
                href="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Voir le profil
              </a>
              <a
                href="/settings"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Paramètres
              </a>
              <button
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
