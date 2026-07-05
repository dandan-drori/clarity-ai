import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ error: 'Access token missing or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);

        // Attach the validated user data payload (`sub` contains the User UUID)
        req.user = decoded;

        next();
    } catch(err) {
        console.error("JWT Verification failed:", err.message);
        return res.status(401).json({ error: 'Invalid or expired auth token.' });
    }
}