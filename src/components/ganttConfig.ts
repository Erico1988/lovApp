// ganttConfig.js
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { gantt } from 'dhtmlx-gantt';

export const initGantt = (tasks) => {
  gantt.config.start_date = new Date(2024, 10, 1);
  gantt.config.end_date = new Date(2024, 10, 30);
  gantt.config.scale_unit = 'day';
  gantt.config.date_scale = '%d %M';
  gantt.config.subscales = [
    { unit: 'month', step: 1, date: '%F, %Y' }
  ];

  // Configurer la locale en français
  gantt.i18n.setLocale('fr');

  gantt.init('gantt_here');
  gantt.parse({ data: tasks });
};
