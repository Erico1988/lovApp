import React from 'react';
import { Mail, Phone, Calendar, User, Edit, Eye } from 'lucide-react';
import { TeamMember } from '../../types/team';

interface TeamMemberCardProps {
  member: TeamMember;
  onEdit: (member: TeamMember) => void;
  onViewDetails: (member: TeamMember) => void;
}

const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  member,
  onEdit,
  onViewDetails,
}) => {
  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'manager':
        return 'text-blue-600';
      case 'developer':
        return 'text-green-600';
      case 'designer':
        return 'text-purple-600';
      default:
        return 'text-gray-900';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      {/* Avatar, Nom, Rôle, Disponibilité */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={`${member.firstName} ${member.lastName}`}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-8 h-8 text-gray-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3
            className={`text-lg font-semibold truncate ${getRoleColor(
              member.role
            )}`}
            aria-live="polite"
          >
            {member.firstName} {member.lastName}
          </h3>
          <p className="text-sm text-gray-600">{member.role}</p>
          <p className="text-sm text-gray-500">{member.department}</p>
        </div>
        <span
          className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded-full ${
            member.availability
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {member.availability ? 'Disponible' : 'Indisponible'}
        </span>
      </div>

      {/* Coordonnées */}
      <div className="space-y-2 mb-4">
        {member.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{member.email}</span>
          </div>
        )}
        {member.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4" />
            <span>{member.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            Depuis le{' '}
            {new Date(member.startDate).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Tâches et Actions */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="text-sm">
          <span className="text-gray-500">Tâches: </span>
          <span className="font-medium text-gray-900">{member.tasks.length}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(member)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-transform transform hover:scale-105"
            title="Voir les détails"
            aria-label="Voir les détails du membre"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(member)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-transform transform hover:scale-105"
            title="Modifier le membre"
            aria-label="Modifier les informations du membre"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;
