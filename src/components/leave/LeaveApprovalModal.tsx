import React, { useState } from 'react';
import { X, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import { LeaveRequest, LeaveStatus } from '../../types/leave';

interface LeaveApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: LeaveRequest;
  onApprove: (request: LeaveRequest, comment: string) => void;
  onReject: (request: LeaveRequest, comment: string) => void;
}

const LeaveApprovalModal: React.FC<LeaveApprovalModalProps> = ({
  isOpen,
  onClose,
  request,
  onApprove,
  onReject,
}) => {
  const [comment, setComment] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);

  const handleAction = () => {
    if (action === 'approve') {
      onApprove(request, comment);
    } else if (action === 'reject') {
      onReject(request, comment);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Validation de la demande de congé
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Employé</h3>
              <p className="mt-1 text-sm text-gray-900">{request.employee}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Type de congé</h3>
              <p className="mt-1 text-sm text-gray-900">{request.type}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Période</h3>
              <p className="mt-1 text-sm text-gray-900">
                Du {new Date(request.startDate).toLocaleDateString()} au{' '}
                {new Date(request.endDate).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Motif</h3>
              <p className="mt-1 text-sm text-gray-900">{request.reason}</p>
            </div>

            {request.documents && request.documents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Documents joints</h3>
                <ul className="mt-2 divide-y divide-gray-200">
                  {request.documents.map((doc) => (
                    <li key={doc.id} className="py-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {doc.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Commentaire
              </label>
              <div className="mt-1">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Ajouter un commentaire..."
                />
              </div>
            </div>
          </div>

          {!showConfirmation ? (
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => {
                  setAction('reject');
                  setShowConfirmation(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Refuser
              </button>
              <button
                type="button"
                onClick={() => {
                  setAction('approve');
                  setShowConfirmation(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approuver
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Confirmation
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      Êtes-vous sûr de vouloir {action === 'approve' ? 'approuver' : 'refuser'} cette demande ?
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleAction}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-md shadow-sm ${
                    action === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirmer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveApprovalModal;