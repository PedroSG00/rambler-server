const Chat = require("../models/Chat.model")

const getChatDetails = (req, res, next) => {

    const { chat_id } = req.params
    Chat.findById(chat_id)
        .populate({
            path: 'messages',
            populate: {
                path: 'author'
            }
        })
        .populate('users')
        .then(chat => res.json(chat))
        .catch(err => next(err))
}

const sendMessage = (req, res, next) => {
    const { _id: author } = req.payload
    const { text, time } = req.body
    const { chat_id } = req.params

    console.log('author---------------------', text)

    Chat
        .findByIdAndUpdate(chat_id, { $push: { messages: { author: author, text, time } } }, { new: true })
        .populate({
            path: 'messages',
            populate: {
                path: 'author'
            },
        })
        .populate('users')
        .then((data) => {
            console.log(data)
            res.json(data)
        })
        .catch(err => next(err))

}

module.exports = {
    getChatDetails,
    sendMessage
}