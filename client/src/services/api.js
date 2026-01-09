import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:5000/api',
});

export const createSpace = (code) => API.post('/spaces/create', { code });
export const loginSpace = (code) => API.post('/spaces/login', { code });
export const uploadFile = (formData) => API.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getFiles = (spaceCode) => API.get(`/files/${spaceCode}`);
export const deleteFile = (id) => API.delete(`/files/${id}`);

export default API;
