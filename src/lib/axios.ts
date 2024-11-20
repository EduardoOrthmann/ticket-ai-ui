import { API_BASE_URL } from '@/types/constants';
import axios from 'axios';

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});
