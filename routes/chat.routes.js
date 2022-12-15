const router = require("express").Router()
const { isAuthenticated } = require('../middleware/jwt-middleware')
const { getChatDetails, sendMessage } = require('../controllers/chat.controller')


router.get('/:chat_id', isAuthenticated, getChatDetails)

router.put('/send', isAuthenticated, sendMessage)

module.exports = router