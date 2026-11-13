import {v2 as cloudinary } from 'cloudinary'
// Configure Cloudinary with environment variables
import fs from 'fs'


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});


const uploadImage = async (localFile) => {
    try {
        if(!localFile) return null;
        const result = await cloudinary.uploader.upload(localFile, {
            resource_type: 'auto',
        });
        fs.unlinkSync(localFile); // Delete the local file after upload
        return result;

    } catch (error) {

        console.error('Error uploading image to Cloudinary:', error);
        fs.unlinkSync(localFile); // Delete the local file even if upload fails
    }
}

export default uploadImage;