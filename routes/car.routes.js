const router = require("express").Router()
const User = require("../models/User.model")
const { getCars, myCars, carsQuery, createCar, editCar, deleteCar } = require('../controllers/car.controller')
const { isAuthenticated } = require("./../middleware/jwt-middleware")
const Cars = require('../models/Car.model')


router.get("/list", getCars)

router.get('/my-cars', isAuthenticated, myCars)

router.get("/", carsQuery)

router.post("/create", isAuthenticated, createCar)

router.delete('/:car_id/delete', isAuthenticated, deleteCar)


module.exports = router
