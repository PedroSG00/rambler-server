const ioRoutes = (io) => {

    io.on('connection', (socket) => {
        socket.on('ConnectRequest', (payload) => {
            const { room } = payload
            socket.join(room)
            socket.emit('ConnectResponse', { message: `You have conected to room: ${room}` })
        })

        socket.on('ConnectGeneral', () => {
            console.log('General Connection')
        })

        socket.on("sendMessage", (data) => {
            socket.to(data.room).emit("receiveMessage", { author: data.author, text: data.text, time: data.time })
            console.log('datita-----------------------', data)
        })

        socket.on('Disconnect', ({ message }) => {
            console.log(message)
        })

    })


}

module.exports = ioRoutes