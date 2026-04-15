import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js'
// Route Imports
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

// Middleware Imports
import errorHandler from './middleware/errorMiddleware.js';

const app = express();

// 1. GLOBAL MIDDLEWARES (Security & Logging First)
app.use(helmet()); // Sets security HTTP headers
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL encoded data

// Log requests in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 2. HEALTH CHECK ROUTE (Before Auth/Task routes for monitoring tools)
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'Server is healthy',
    timestamp: new Date().toISOString()
  });
});

// 3.1 API DOCUMENTATION ROUTE
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 3. API ROUTES
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);

// 4. GLOBAL ERROR HANDLER (MUST BE LAST)
// This replaces the inline basic version and uses our production logic
app.use(errorHandler);

export default app;