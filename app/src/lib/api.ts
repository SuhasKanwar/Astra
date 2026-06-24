import axios from 'axios';
import { HTTP_BASE_URL } from './config';

export const api = axios.create({
    baseURL: HTTP_BASE_URL
});