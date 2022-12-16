const router = require("express").Router()
const { isAuthenticated } = require('../middleware/jwt-middleware')
const { getChatDetails, sendMessage, deleteMessage } = require('../controllers/chat.controller')


router.get('/:chat_id', isAuthenticated, getChatDetails)

router.put('/:chat_id/send', isAuthenticated, sendMessage)

router.delete('/:chat_id/delete', isAuthenticated, deleteMessage)


module.exports = router