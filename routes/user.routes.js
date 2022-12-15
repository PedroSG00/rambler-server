const router = require("express").Router()
const { isAuthenticated } = require('../middleware/jwt-middleware')
const { userList, userDetails, editUser, deleteUser, userChats } = require('../controllers/user.controller')

router.get('/list', isAuthenticated, userList)

router.get('/user-details', isAuthenticated, userDetails)

router.get('/chats', isAuthenticated, userChats)

router.put('/:user_id/edit', isAuthenticated, editUser)

router.delete("/:user_id/delete", isAuthenticated, deleteUser)

module.exports = router