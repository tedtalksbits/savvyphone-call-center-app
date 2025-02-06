import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:6060',
});

export { axiosInstance };
