const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.headers['_auth']
    console.log(authHeader,"auth")
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.sendStatus(401)

    jwt.verify(token, 'mysecretpassword', (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

