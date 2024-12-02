import React, { useEffect } from 'react';
import { initGantt } from '../components/ganttConfig'; // Ajustez le chemin en fonction de votre structure de projet

const GanttView = ({ tasks }) => {
  useEffect(() => {
    initGantt(tasks);
  }, [tasks]);

  return (
    <div>
      <div id="gantt_here" style={{ width: '100%', height: '500px' }}></div>
    </div>
  );
};

export default GanttView;
