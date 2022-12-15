const router = require("express").Router()
const uploader = require('../config/cloudinary.config')
const { loadImage } = require('../controllers/upload.controller')

router.post('/image', uploader.single('imageData'), loadImage)


module.exports = router