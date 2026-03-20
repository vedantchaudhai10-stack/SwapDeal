export const uploadImage = async (image) => {
  const formData = new FormData();

  formData.append("file", image);
  formData.append("upload_preset", "olx_upload");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/dbofzun3g/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url;
};
