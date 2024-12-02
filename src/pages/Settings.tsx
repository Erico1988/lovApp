import React from 'react';
import { Bell, Lock, User, Globe, Users, ShieldCheck, FileText, ClipboardList, Activity } from 'lucide-react';
import ResourceManagement from '../components/ResourceManagement';
import ActivityLog from '../components/ActivityLog';
import PermissionsManagement from '../components/PermissionsManagement';

const Settings = () => {
  const [activeSection, setActiveSection] = React.useState('profile');

  const sections = [
    {
      id: 'profile',
      title: 'Profil',
      icon: User,
      fields: [
        { label: 'Nom', value: 'RAKOTOARISOA Narindra', type: 'text' },
        { label: 'Email', value: 'narindra.defis@gmail.com', type: 'email' },
        { label: 'Téléphone', value: '+261 34 02 014 73', type: 'tel' },
      ],
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      fields: [
        { label: 'Notifications par email', value: true, type: 'toggle' },
        { label: 'Notifications push', value: true, type: 'toggle' },
        { label: 'Résumé hebdomadaire', value: false, type: 'toggle' },
      ],
    },
    {
      id: 'security',
      title: 'Sécurité',
      icon: Lock,
      fields: [
        { label: 'Authentification à deux facteurs', value: false, type: 'toggle' },
        { label: 'Changer le mot de passe', type: 'button' },
        { label: 'Sessions actives', type: 'button' },
      ],
    },
    {
      id: 'resources',
      title: 'Gestion des ressources',
      icon: Users,
      component: ResourceManagement,
    },
    {
      id: 'permissions',
      title: 'Gestion des permissions',
      icon: ShieldCheck,
      component: PermissionsManagement,
    },
    {
      id: 'activity-log',
      title: 'Journal d\'activités',
      icon: Activity,
      component: ActivityLog,
    },
  ];

  const renderSectionContent = (section: any) => {
    if (section.component) {
      const Component = section.component;
      return <Component />;
    }

    return (
      <div className="space-y-4">
        {section.fields?.map((field: any, index: number) => (
          <div key={index} className="flex items-center justify-between py-2">
            <label className="text-gray-700">{field.label}</label>
            {field.type === 'toggle' ? (
              <button
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  field.value ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    field.value ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            ) : field.type === 'button' ? (
              <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                Modifier
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type={field.type}
                  value={field.value}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  readOnly
                />
                <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
                  Modifier
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>

      <div className="flex space-x-6">
        <div className="w-64 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span>{section.title}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          {renderSectionContent(sections.find(s => s.id === activeSection))}
        </div>
      </div>
    </div>
  );
};

export default Settings;