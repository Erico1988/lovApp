import React, { useState } from 'react';
import { TeamMember, Role, Department, Function } from '../../types/team';
import { X } from 'lucide-react';

interface TeamMemberFormProps {
  member?: TeamMember;
  onSubmit: (member: TeamMember) => void;
  onClose: () => void;
  existingMembers: TeamMember[];
}

const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  member,
  onSubmit,
  onClose,
  existingMembers,
}) => {
  const [formData, setFormData] = useState<Partial<TeamMember>>(
    member || {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: Role.TEAM_MEMBER,
      department: Department.UCP,
      function: Function.ADMINISTRATIVE,
      privileges: [],
      tasks: [],
      availability: true,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as TeamMember);
  };

  const potentialSuperiors = existingMembers.filter(m => 
    Object.values(Role).indexOf(m.role as Role) < Object.values(Role).indexOf(formData.role as Role)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {member ? 'Modifier le membre' : 'Ajouter un nouveau membre'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Object.values(Role).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Département
              </label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Object.values(Department).map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fonction
              </label>
              <select
                value={formData.function}
                onChange={(e) => setFormData({ ...formData, function: e.target.value as Function })}
                className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {Object.values(Function).map((func) => (
                  <option key={func} value={func}>{func}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Supérieur hiérarchique
            </label>
            <select
              multiple
              value={formData.reportsTo || []}
              onChange={(e) => setFormData({
                ...formData,
                reportsTo: Array.from(e.target.selectedOptions, option => option.value)
              })}
              className="w-full rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              size={3}
            >
              {potentialSuperiors.map((superior) => (
                <option key={superior.id} value={superior.id}>
                  {superior.firstName} {superior.lastName} ({superior.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              {member ? 'Mettre à jour' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamMemberForm;