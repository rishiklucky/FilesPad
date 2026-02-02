import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
});

export const createSpace = (code) => API.post('/spaces/create', { code });
export const loginSpace = (code, lockCode) => API.post('/spaces/login', { code, lockCode });
export const enableLock = (code, lockCode) => API.post('/spaces/enable-lock', { code, lockCode });
export const uploadFile = (formData) => API.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getFiles = (spaceCode) => API.get(`/files/${spaceCode}`);
export const deleteFile = (id) => API.delete(`/files/${id}`);
export const getTextPad = (spaceCode) => API.get(`/spaces/${spaceCode}/textpad`);
export const updateTextPad = (spaceCode, content) => API.put(`/spaces/${spaceCode}/textpad`, { content });
export const deleteSpace = (spaceCode) => API.delete(`/spaces/${spaceCode}`);

export default API;
