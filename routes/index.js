module.exports = app => {

    const indexRouter = require('./index.routes')
    app.use('/', indexRouter)

    const authRouter = require('./auth.routes')
    app.use('/api/auth', authRouter)

    const userRouter = require('./user.routes')
    app.use('/api/user', userRouter)

    const tripRouter = require('./trip.routes')
    app.use('/api/trip', tripRouter)

    const carRouter = require('./car.routes')
    app.use('/api/car', carRouter)

    const chatRouter = require('./chat.routes')
    app.use('/api/chats', chatRouter)

    const uploadRouter = require('./upload.routes')
    app.use('/api/upload', uploadRouter)


}
