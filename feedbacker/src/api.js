import axios from 'axios';

const API = axios.create({
  baseURL: 'https://feedbacking-website.onrender.com/api/feedback', 
});

export default API;
