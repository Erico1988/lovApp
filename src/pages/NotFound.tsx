import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center">
    <h1 className="text-4xl font-bold mb-4">Page non trouvée</h1>
    <p className="mb-4">La page que vous cherchez n'existe pas.</p>
    <Link to="/" className="text-blue-600 hover:underline">
      Retour à l'accueil
    </Link>
  </div>
);

export default NotFound;
