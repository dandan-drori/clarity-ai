import express from 'express';

export const healthRouter = express.Router();

healthRouter.get('/', async (req, res) => {
  try {
    res.status(200).json({ status: 'ready', message: 'Service is up and running' });
  } catch (err) {
    res.status(503).json({ status: 'error', message: 'Service Unavailable' });
  }
});