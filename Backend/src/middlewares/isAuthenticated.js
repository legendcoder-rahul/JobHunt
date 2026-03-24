const jwt = require('jsonwebtoken')

const isAuthenticated = async (req, res, next) => {
    try {
        // Check for token in cookies first, then in Authorization header
        let token = req.cookies.token
        
        console.log('🔍 Checking authentication...')
        console.log('Cookie token:', token ? '✓ Found' : '✗ Not found')
        
        if (!token && req.headers.authorization) {
            // Extract token from "Bearer <token>"
            const authHeader = req.headers.authorization
            console.log('Authorization header:', authHeader.substring(0, 20) + '...')
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7)
                console.log('✓ Extracted token from Authorization header')
            }
        }

        if (!token) {
            console.log('❌ No token found in cookies or Authorization header')
            return res.status(401).json({
                message: 'User not authenticated',
                success: false
            })
        }

        console.log('🔑 Verifying token...')
        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
        if (!decode) {
            return res.status(403).json({
                message: 'Invalid token',
                success: false
            })
        }

        console.log('✅ Token verified, userId:', decode.userId)
        req.id = decode.userId
        next()
    } catch (error) {
        console.error('❌ Authentication error:', error.message);
        return res.status(401).json({
            message: 'Token verification failed',
            success: false
        })
    }
}

module.exports = isAuthenticated