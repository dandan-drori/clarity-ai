export const requireApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.WEBHOOK_API_KEY;

  if (!apiKey || apiKey !== validKey) {
    console.warn('Unauthorized webhook attempt');
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
  
  next();
};