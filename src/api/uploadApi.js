import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const uploadApi = {
  uploadPhoto: async (photo) => {
    const fd = new FormData();
    fd.append("file", photo);
    const { data } = await apiFetch(`${baseUrl}uploads/photo`, {
      method: "POST",
      body: fd,
    });
    return data.url;
  },

  uploadPdf: async (pdf) => {
    const fd = new FormData();
    fd.append("file", pdf);
    const { data } = await apiFetch(`${baseUrl}uploads/pdf`, {
      method: "POST",
      body: fd,
    });
    return data.url;
  },

  uploadUniversityLogo: async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await apiFetch(`${baseUrl}uploads/university-logo`, {
      method: "POST",
      body: fd,
    });
    return data.url;
  },
};
export default uploadApi;