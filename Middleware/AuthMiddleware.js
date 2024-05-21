const jwt = require('jsonwebtoken')
const secretpassword="mysecretpassword"

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers['_auth']
        const token = authHeader && authHeader.split(' ')[1]
        
      
        if (token == null) return res.sendStatus(401)
      
        jwt.verify(token, secretpassword, (err, user) => {
          if (err) return res.sendStatus(403)
          req.user = user
        console.log('passed1')
          next()
        })

        
    } catch (error) {
        res.status(500).send(error)
        
    }

}
