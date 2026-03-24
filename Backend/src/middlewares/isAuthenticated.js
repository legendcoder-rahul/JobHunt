const jwt = require('jsonwebtoken')

const isAuthenticated = async (req, res, next) => {
    try {
        // Check for token in cookies first, then in Authorization header
        let token = req.cookies.token
        
        if (!token && req.headers.authorization) {
            // Extract token from "Bearer <token>"
            const authHeader = req.headers.authorization
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7)
            }
        }

        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!decode) {
            return res.status(403).json({
                message: 'Invalid token',
                success: false
            })
        }

        req.id = decode.userId
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Token verification failed',
            success: false
        })
    }
}

module.exports = isAuthenticated