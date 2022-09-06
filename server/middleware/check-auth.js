const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // check token exists
    try {
        const token = req.headers.authorization.split(' ')[1];
        // validate incoming jwt
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    } catch (err) {
        res.status(401).json({
            message: 'You are not authenticated',
        });
    }
};
