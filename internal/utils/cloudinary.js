require('dotenv').config()

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const cloudPath = 'products'
const imagePath = publicId => `${cloudPath}/${publicId}`

module.exports = {
    url: publicId => cloudinary.url(imagePath(publicId), { secure: true }),
    destroy: publicId => cloudinary.uploader.destroy(imagePath(publicId)),
    upload: (image, name, overwrite = false) => {
        const path = image.path
        const uniqueFilename = new Date().toISOString()

        const result = cloudinary.uploader.upload(path, {
            overwrite,
            public_id: `products/${uniqueFilename}`,
            folder: cloudPath
        })

        console.log(result, 'result')

        return result
    }
}