const jwt = require('jsonwebtoken');

function checkAuthStatus(req, res, next) {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (req.isAuthenticated()) {
        req.user = { provider: 'google', ...req.user };
        return next();
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_SECRET_2);
            req.user = { provider: 'jwt', ...decoded };
            return next();
        } catch (error) {
            console.error("JWT verification error:", error);
        }
    }
    res.status(401).redirect('/login');
}

module.exports = checkAuthStatus;

