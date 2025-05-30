import app from './app';
import { PORT } from './config/env';
import pool from './config/db'; // Importar para inicializar a conexão

const startServer = async () => {
  try {
    // Testa a conexão com o banco de dados ao iniciar
    await pool.query('SELECT NOW()');
    console.log('Database connection successful.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Access it at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
};

startServer();