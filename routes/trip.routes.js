const router = require("express").Router()
const { isAuthenticated } = require("./../middleware/jwt-middleware")
const { tripList, myTrips, tripDetails, createTrips, joinTrip, leaveTrip, editTrip, deleteTrip, searchTrip, requestWaypoint, updateTripState } = require('../controllers/trip.controller')

router.get("/list", tripList)

router.get("/mytrips", isAuthenticated, myTrips)

router.get("/:id", tripDetails)

router.post("/create", isAuthenticated, createTrips)

router.post("/:tripID/join", isAuthenticated, joinTrip)

router.post("/:tripID/leave", isAuthenticated, leaveTrip)

router.post("/:tripID/request", isAuthenticated, requestWaypoint)

router.put("/:id/edit", isAuthenticated, editTrip)

router.put('/:tripID/update-state', isAuthenticated, updateTripState)

router.delete("/:id/delete", isAuthenticated, deleteTrip)

router.post('/search', searchTrip)

module.exports = router

