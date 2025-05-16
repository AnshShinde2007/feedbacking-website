import axios from 'axios';

const API = axios.create({
  baseURL: 'https://feedbacking-website.onrender.com/api/feedback', // will update to deployed backend later
});

export default API;
