import axios from 'axios';
const BASE_URL = 'https://api.hotmix.ma';

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosPublic = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' }
});
