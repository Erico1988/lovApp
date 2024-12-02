import React from 'react';
import Modal from 'react-modal';
import MarketForm from './MarketForm';

interface MarketFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (marketData: any) => void;
  currentUser: {
    coordination: string | null;
    role: string;
  };
}

const MarketFormModal: React.FC<MarketFormModalProps> = ({ isOpen, onClose, onSubmit, currentUser }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Ajouter un nouveau marché"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <MarketForm onSubmit={onSubmit} onClose={onClose} isOpen={isOpen} currentUser={currentUser} />
    </Modal>
  );
};

export default MarketFormModal;
