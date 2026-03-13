const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.cloudinary_name || process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.cloudinary_api_key || process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.cloudinary_api_secret || process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

function uploadProfileImage({ filePath, folder, fileName }) {
  return cloudinary.uploader.upload(filePath, {
    folder,
    public_id: fileName,
    overwrite: true,
    resource_type: 'image',
  });
}

function uploadMediaBuffer({ buffer, folder, fileName, resourceType = 'image' }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: fileName,
        overwrite: true,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

function uploadProfileImageBuffer({ buffer, folder, fileName }) {
  return uploadMediaBuffer({ buffer, folder, fileName, resourceType: 'image' });
}

module.exports = {
  uploadProfileImage,
  uploadProfileImageBuffer,
  uploadMediaBuffer,
  cloudinary,
};
