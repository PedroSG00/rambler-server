const router = require("express").Router()
const { signUp, logIn, verify } = require('../controllers/auth.controller')

const { isAuthenticated } = require('../middleware/jwt-middleware')

router.post('/sign-up', signUp)

router.post('/log-in', logIn)

router.get('/verify', isAuthenticated, verify)

module.exports = router