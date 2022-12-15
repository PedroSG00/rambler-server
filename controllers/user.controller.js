const User = require("../models/User.model")

const userList = (req, res, next) => {

    User
        .find({ role: 'USER' })
        .select({ email: 1, imageUrl: 1 })
        .then(users => res.json(users))
        .catch(error => next(error))

}

const userDetails = (req, res, next) => {

    const { _id: user_id } = req.payload

    User
        .findById(user_id)
        .populate('cars')
        .then(userDetails => res.status(200).json(userDetails))
        .catch(error => next(error))

}

const userChats = (req, res, next) => {

    const { _id: user_id } = req.payload

    User
        .findById(user_id)
        .select({ chats: 1 })
        .populate({
            path: 'chats',
            populate: {
                path: 'trip',
                model: 'Trip'
            }
        })
        .then(chats => res.status(200).json(chats))
        .catch(error => next(error))

}

const editUser = (req, res, next) => {

    const { user_id } = req.params
    const { email, username, _id, firstname, lastname, age, gender, imageUrl } = req.body

    User
        .findByIdAndUpdate(user_id, { email, username, _id, firstname, lastname, age, gender, imageUrl }, { new: true })
        .then(userDetails => res.json(userDetails))
        .catch(error => next(error))

}

const deleteUser = (req, res, next) => {

    const { user_id } = req.params

    User
        .findByIdAndDelete(user_id)
        .then(deletedUser => res.json(deletedUser))
        .catch(err => next(err))

}

module.exports = {
    userList,
    userDetails,
    editUser,
    deleteUser,
    userChats
}