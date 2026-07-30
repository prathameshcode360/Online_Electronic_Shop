import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

export default deleteFromCloudinary;
