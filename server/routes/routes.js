import authRoutes from './authRoutes.js';
import notesRoutes from './notesRoutes.js';

const routes = (app) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/notes', notesRoutes);
};

export default routes;
