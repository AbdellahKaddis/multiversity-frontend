import { baseUrl } from "./authApi";


const uploadApi = {
 uploadPhoto: async (photo) => {
    const photoFd = new FormData();
    photoFd.append("file", photo);
    try {
      const response = await fetch(`${baseUrl}uploads/photo`, {
        method: "POST",
        headers: {},
        body: photoFd,
      });

      if (!response.ok) throw new Error("Upload failed");
  const { url } = await response.json();
  return url; 
    } catch (error) {
      if (error.message === "Failed to fetch")
        throw new Error(
          "Oops! We're having trouble connecting to the server. Please try again later."
        );
      else throw new Error(error.message);
    }
  },
  uploadPdf: async (pdf) => {
    const pdfFd = new FormData();
    pdfFd.append("file", pdf);
    try {
      const response = await fetch(`${baseUrl}uploads/pdf`, {
        method: "POST",
        headers: {},
        body: pdfFd,
      });

      if (!response.ok) throw new Error("Upload failed");
  const { url } = await response.json();
  return url; 
    } catch (error) {
      if (error.message === "Failed to fetch")
        throw new Error(
          "Oops! We're having trouble connecting to the server. Please try again later."
        );
      else throw new Error(error.message);
    }
  },
};
export default uploadApi;