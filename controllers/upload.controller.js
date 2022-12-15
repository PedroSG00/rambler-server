const loadImage = (req, res) => {

    if (!req.file) {
        res.status(500).json({ errorMessage: 'Error loading file' })
        return
    }

    res.json({ cloudinary_url: req.file.path })
}

module.exports = {
    loadImage
}