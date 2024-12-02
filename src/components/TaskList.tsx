import React from 'react';
import TaskCard from './TaskCard';
import { Filter } from 'lucide-react';

// Définition des types si nécessaires (extrait simplifié)
interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  assignedTo?: string;
  priority: 'high' | 'medium' | 'low';
  budget?: number;
}

const tasks: Task[] = [
  // Étape 1 : Préparation et conception
  {
    id: '1',
    title: 'Conception des TDR',
    description:
      "Définir les besoins spécifiques du marché, identifier les objectifs, valider la structure avec le chef de projet.",
    status: 'TDR_CONCEPTION',
    dueDate: '2024-12-01',
    assignedTo: 'Chef de projet',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Validation des TDR',
    description:
      "Soumettre les TDR à l’approbation, intégrer les modifications, finaliser pour diffusion.",
    status: 'TDR_APPROBATION',
    dueDate: '2024-12-05',
    assignedTo: 'Coordonnateur',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Estimation budgétaire',
    description:
      "Identifier les coûts potentiels et valider le budget prévisionnel avec l’équipe financière.",
    status: 'ESTIMATION_BUDGETAIRE',
    dueDate: '2024-12-10',
    assignedTo: 'Responsable financier',
    priority: 'high',
  },
  {
    id: '4',
    title: 'Création du plan de passation de marché',
    description: "Identifier les délais et étapes clés, valider avec les parties prenantes.",
    status: 'PLAN_PASSATION',
    dueDate: '2024-12-15',
    assignedTo: 'Équipe projet',
    priority: 'medium',
  },

  // Étape 2 : Lancement du processus
  {
    id: '5',
    title: 'Lancement de l’appel d’offres',
    description:
      "Publier l’appel d’offres, envoyer des notifications aux fournisseurs, fixer une échéance.",
    status: 'APPEL_OFFRES',
    dueDate: '2025-01-05',
    assignedTo: 'Responsable des achats',
    priority: 'high',
  },
  {
    id: '6',
    title: 'Organisation de la session Q&A',
    description:
      "Recueillir les questions des fournisseurs potentiels et organiser une réunion pour y répondre.",
    status: 'SESSION_QA',
    dueDate: '2025-01-10',
    assignedTo: 'Chef de projet',
    priority: 'medium',
  },
  {
    id: '7',
    title: 'Réception et vérification des offres',
    description:
      "Vérifier que les soumissions respectent les conditions et archiver les documents reçus.",
    status: 'VERIFICATION_OFFRES',
    dueDate: '2025-01-20',
    assignedTo: 'Équipe projet',
    priority: 'medium',
  },

  // Étape 3 : Évaluation des offres
  {
    id: '8',
    title: 'Analyse préliminaire des offres',
    description: "Vérifier la conformité administrative et établir une liste éligible.",
    status: 'ANALYSE_PRELIMINAIRE',
    dueDate: '2025-01-25',
    assignedTo: 'Comité d’analyse',
    priority: 'high',
  },
  {
    id: '9',
    title: 'Évaluation technique et financière',
    description:
      "Comparer les propositions techniques, analyser les coûts et établir une grille d’évaluation.",
    status: 'EVALUATION_OFFRES',
    dueDate: '2025-01-30',
    assignedTo: 'Comité technique',
    priority: 'high',
  },
  {
    id: '10',
    title: 'Validation des résultats',
    description: "Préparer un rapport d’évaluation et soumettre au comité.",
    status: 'VALIDATION_RESULTATS',
    dueDate: '2025-02-05',
    assignedTo: 'Coordonnateur',
    priority: 'medium',
  },
  {
    id: '11',
    title: 'Sélection du fournisseur',
    description: "Notifier le fournisseur retenu et informer les candidats non sélectionnés.",
    status: 'SELECTION_FOURNISSEUR',
    dueDate: '2025-02-10',
    assignedTo: 'Responsable des achats',
    priority: 'medium',
  },

  // Étape 4 : Finalisation et contractualisation
  {
    id: '12',
    title: 'Négociation des termes du contrat',
    description: "Finaliser les clauses contractuelles avec le fournisseur.",
    status: 'NEGOCIATION_CONTRAT',
    dueDate: '2025-02-20',
    assignedTo: 'Chef de projet',
    priority: 'high',
  },
  {
    id: '13',
    title: 'Approbation du contrat',
    description: "Soumettre le contrat pour validation par le RAF et l’archiver.",
    status: 'APPROBATION_CONTRAT',
    dueDate: '2025-02-25',
    assignedTo: 'Responsable administratif',
    priority: 'medium',
  },

  // Étape 5 et 6 : Suivi, paiement, et clôture
  {
    id: '14',
    title: 'Planification de la livraison ou des prestations',
    description: "Définir les dates et modalités, vérifier les ressources nécessaires.",
    status: 'PLANIFICATION_LIVRAISON',
    dueDate: '2025-03-05',
    assignedTo: 'Chef de projet',
    priority: 'medium',
  },
  {
    id: '15',
    title: 'Service fait',
    description: "Préparer un certificat pour les produits reçus ou services effectués.",
    status: 'SERVICE_FAIT',
    dueDate: '2025-03-20',
    assignedTo: 'Chef de projet',
    priority: 'high',
  },
  {
    id: '16',
    title: 'Clôture du marché',
    description: "Rédiger un rapport de clôture et archiver tous les documents.",
    status: 'CLOTURE_MARCHE',
    dueDate: '2025-04-01',
    assignedTo: 'Chef de projet',
    priority: 'medium',
  },
];

const TaskList: React.FC = () => {
  const [filterStatus, setFilterStatus] = React.useState<string[]>([]);
  const [sortBy, setSortBy] = React.useState('dueDate');

  const handleStatusFilter = (status: string) => {
    setFilterStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const filteredTasks = tasks.filter(
    (task) => filterStatus.length === 0 || filterStatus.includes(task.status)
  );

  return (
    <div>
      <div>
        <h1 className="text-xl font-bold">Liste des tâches</h1>
        <div>
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleStatusFilter(status)}
              className={`px-2 py-1 rounded ${
                filterStatus.includes(status) ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>
      <div>
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
