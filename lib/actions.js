"use server"

import { v2 as cloudinary } from "cloudinary"

// Configuration
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
})


export async function uploadImageryImage(formData) {
  try {
    const file = formData.get("file")
    const category = formData.get("category")
    const title = formData.get("title")

    if (!file || !category || !title) {
      throw new Error("Missing required fields")
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`

    // Generate a unique filename
    const timestamp = Date.now()
    const fileName = `${category}_${title.replace(/\s+/g, "_")}_${timestamp}`

    const uploadResponse = await cloudinary.uploader.upload(base64Image, {
      folder: "portfolio_site/shahriar",
      public_id: fileName,
      overwrite: false,
    })

    return {
      success: true,
      url: uploadResponse.secure_url,
      fileName: fileName,
    }
  } catch (error) {
    console.error("Error uploading imagery image:", error)
    return {
      success: false,
      error: error.message,
    }
  }
}
