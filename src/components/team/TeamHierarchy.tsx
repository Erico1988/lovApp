import React from 'react';
import { ChevronRight, ChevronDown, User } from 'lucide-react';
import { TeamMember } from '../../types/team';

interface TeamHierarchyProps {
  members: TeamMember[];
  onSelectMember: (member: TeamMember) => void;
}

const TeamHierarchy: React.FC<TeamHierarchyProps> = ({ members, onSelectMember }) => {
  const [expandedNodes, setExpandedNodes] = React.useState<string[]>([]);

  const toggleNode = (memberId: string) => {
    setExpandedNodes((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const rootMembers = React.useMemo(
    () => members.filter((member) => !member.reportsTo || member.reportsTo.length === 0),
    [members]
  );

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

  const renderHierarchyNode = (member: TeamMember, level = 0) => {
    const subordinates = members.filter((m) => m.reportsTo?.includes(member.id));
    const isExpanded = expandedNodes.includes(member.id);

    return (
      <div key={member.id} className="space-y-2">
        <div
          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition ${
            level > 0 ? 'ml-6' : ''
          }`}
          onClick={() => onSelectMember(member)}
        >
          {subordinates.length > 0 ? (
            <button
              onClick={() => toggleNode(member.id)}
              className="p-1 hover:bg-gray-200 rounded"
              aria-expanded={isExpanded}
              aria-label={`Expand or collapse ${member.firstName} ${member.lastName}`}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
            </button>
          ) : (
            <div className="w-6" />
          )}

          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div>
              <div className={`text-sm font-medium ${getRoleColor(member.role)}`}>
                {member.firstName} {member.lastName}
              </div>
              <div className="text-xs text-gray-500">{member.role}</div>
            </div>
          </div>

          {member.department && (
            <div className="text-xs text-gray-500">{member.department}</div>
          )}
        </div>

        {isExpanded && subordinates.length > 0 && (
          <div
            className="border-l-2 border-gray-200 ml-4 pl-2 transition-max-height duration-300 ease-in-out"
            style={{
              maxHeight: isExpanded ? '500px' : '0',
              overflow: 'hidden',
            }}
          >
            {subordinates.map((subordinate) => renderHierarchyNode(subordinate, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Organigramme</h3>
      <div className="space-y-2">
        {rootMembers.map((member) => renderHierarchyNode(member))}
      </div>
    </div>
  );
};

export default TeamHierarchy;
