const Trip = require('../models/Trip.model')
const User = require('../models/User.model')
const Chat = require('../models/Chat.model')

const tripList = (req, res, next) => {

    Trip
        .find()
        .populate('owner passengers')
        .select({ origin_address: 1, destination_address: 1, price: 1, date: 1, stops: 1, owner: 1, passengers: 1, seats: 1 })
        .then(foundTrip => res.json(foundTrip))
        .catch(err => next(err))
}

const myTrips = (req, res, next) => {

    Trip
        .find({ owner: req.payload._id })
        .populate('owner passengers')
        .select({ origin_address: 1, destination_address: 1, price: 1, date: 1, stops: 1, owner: 1, seats: 1, passengers: 1, trip_state: 1 })
        .then(ownTripList => res.json(ownTripList))
        .catch(err => next(err))
}

const tripDetails = (req, res, next) => {

    const { id } = req.params

    Trip
        .findById(id)
        .populate("owner car passengers")
        .then(trip => {
            res.json(trip)
        })
        .catch(err => next(err))
}

const requestWaypoint = async (req, res, next) => {

    const { id } = req.params
    const { waypoint, waypoint_address } = req.body
    const { _id: owner } = req.payload
    const { lng: waypoint_lng, lat: waypoint_lat } = waypoint

    try {
        Trip.findByIdAndUpdate(id, {
            $addToSet: {
                requests: {
                    owner: owner,
                    type: 'Point',
                    coordinates: [waypoint_lng, waypoint_lat]
                }
            }
        })
    } catch (error) {
        next(error)
    }

}

const createTrips = async (req, res, next) => {

    const { from, to, origin_address, destination_address, date, seats, car, price, hour, trip_state } = req.body
    const { _id: owner } = req.payload

    const { lng: origin_lng, lat: origin_lat } = from
    const { lng: destination_lng, lat: destination_lat } = to

    try {
        const createdTrip = await Trip.create
            ({
                from: {
                    type: 'Point',
                    coordinates: [origin_lng, origin_lat]
                },
                to: {
                    type: 'Point',
                    coordinates: [destination_lng, destination_lat]
                },
                origin_address,
                destination_address,
                seats,
                price,
                date,
                owner,
                seats,
                car,
                hour,
                trip_state
            })

        const createdChat = await Chat.create({ driver: owner, trip: createdTrip._id })


        const updateTripWithChat = await createdTrip.updateOne({ chat: createdChat._id })
        const userUpdated = await User.findByIdAndUpdate(owner, { $addToSet: { chats: createdChat._id } })

        return res.json(updateTripWithChat)
    } catch (error) {
        next(error)
    }


}

const joinTrip = async (req, res, next) => {

    const { tripID } = req.params

    const { _id: passenger } = req.payload

    try {
        const tripUpdated = await Trip.findByIdAndUpdate(tripID, { $addToSet: { passengers: passenger } })
        const { chat: chat_id } = tripUpdated
        const chatUpdated = await Chat.findByIdAndUpdate(chat_id, { $addToSet: { users: passenger } })
        const userUpdated = await User.findByIdAndUpdate(passenger, { $addToSet: { chats: chat_id } })
        return res.status(200).json(tripUpdated)
    } catch (error) {
        next(error)
    }


}

const leaveTrip = async (req, res, next) => {

    const { tripID } = req.params

    const { _id: passenger } = req.payload

    try {

        const tripUpdated = await Trip.findByIdAndUpdate(tripID, { $pull: { passengers: passenger } })
        const { chat: chat_id } = tripUpdated
        const chatUpdated = await Chat.findByIdAndUpdate(chat_id, { $pull: { users: passenger } })
        const userUpdated = await User.findByIdAndUpdate(passenger, { $pull: { chats: chat_id } })

        return res.status(202).json(tripUpdated)

    } catch (error) {
        next(error)
    }

}

const editTrip = (req, res, next) => {

    const { id } = req.params


    Trip
        .findByIdAndUpdate(id, req.body, { new: true })
        .then(data => res.status(200).json(data))
        .catch(err => next(err))
}

const deleteTrip = async (req, res, next) => {

    const { id } = req.params
    const { _id: user_id } = req.payload

    try {
        const deletedTrip = await Trip.findByIdAndDelete(id)
        const deletedChat = await Chat.findByIdAndDelete(deleteTrip.chat._id)
        const userUpdated = await User.findByIdAndUpdate(user_id, { $pull: { chats: deleteTrip.chat._id } })



        return res.status(200).json(deleteTrip)

    } catch (error) {
        next()
    }

}

const searchTrip = (req, res, next) => {

    const { origin_lng, origin_lat, destination_lng, destination_lat, seatsAviable, travelDate, travelHour, emission } = req.body

    let fromQuery = {
        from: {
            $near: {
                $maxDistance: 2000,
                $geometry: {
                    type: "Point",
                    coordinates: [origin_lng, origin_lat]
                }
            }
        }
    }

    let toQuery = {
        to: {
            $near: {
                $maxDistance: 2000,
                $geometry: {
                    type: "Point",
                    coordinates: [destination_lng, destination_lat]
                }
            }
        }
    }

    if (seatsAviable) fromQuery = { ...fromQuery, seats: seatsAviable }
    if (travelDate) fromQuery = { ...fromQuery, date: travelDate }
    if (travelHour) fromQuery = { ...fromQuery, hour: travelHour }




    if (seatsAviable) toQuery = { ...toQuery, seats: seatsAviable }
    if (travelDate) toQuery = { ...toQuery, date: travelDate }
    if (travelHour) toQuery = { ...toQuery, hour: travelHour }



    const promises = [
        Trip.find(fromQuery)
            .select({ createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('passengers owner')
            .populate('car', 'energeticClassification')
        ,

        Trip.find(toQuery)

            .select({ createdAt: 0, updatedAt: 0, __v: 0 })
            .populate('passengers owner')
            .populate('car', 'energeticClassification')

    ]

    Promise
        .all(promises)
        .then((results) => {
            const from = results[0]
            const to = results[1].map(el => el._id.toString())
            const both = from.filter(trip => {

                return emission ? to.includes(trip._id.toString()) && trip.car.energeticClassification === emission : to.includes(trip._id.toString())
            })
            return res.json(both)
        })
        .catch(err => next(err))
}

const updateTripState = (req, res, next) => {
    const { trip_state } = req.body
    const { tripID } = req.params

    Trip
        .findByIdAndUpdate(tripID, { trip_state }, { new: true })
        .then(data => res.status(200).json(data))
        .catch(err => next(err))
}


module.exports = {
    tripList,
    myTrips,
    tripDetails,
    createTrips,
    joinTrip,
    leaveTrip,
    editTrip,
    deleteTrip,
    searchTrip,
    requestWaypoint,
    updateTripState
}