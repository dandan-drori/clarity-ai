import { createRemoteJWKSet, jwtVerify } from 'jose';

const SUPABASE_JWKS = createRemoteJWKSet(
    new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`)
);

export const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access token missing or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 2. Verify the token using the remote public keys
        const { payload } = await jwtVerify(token, SUPABASE_JWKS, {
            issuer: `${process.env.SUPABASE_URL}/auth/v1`
        });

        // Attach the validated user data payload (contains `sub` UUID)
        req.user = payload;

        next();
    } catch (err) {
        console.error("JWT Verification failed:", err.message);
        return res.status(401).json({ error: 'Invalid or expired auth token.' });
    }
};