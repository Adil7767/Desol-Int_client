import axios, { AxiosError, AxiosRequestConfig, Method } from 'axios';
import { removeToken } from './auth';

const BASE_URL = 'https://desol-int-server.vercel.app';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

export async function apiRequest<T>({
    endpoint,
    requiresToken = false,
    method = 'post',
    data,
    contentType = 'application/json' }: { endpoint: string, data?: Object, requiresToken?: boolean, contentType?: string, method: string }
): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': contentType,
    };

    if (requiresToken) {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            return { error: 'Token is required but not found' };
        }
    }

    try {
        const response = await axios({
            url,
            method,
            headers,
            data,
        });

        if (response.status === 200) {
            return { data: response.data as T };
        }

        return response
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            if (error.response.status === 401) {
                removeToken();
                window.location.href = '/login';
                return { error: 'You have been logged out.' };
            }
            const errorMessage = (error.response.data as { message?: string })?.message;
            return { error: errorMessage || 'API request failed' };
        }
        console.error(error);

        return { error: 'Unknown error occurred' };
    }
}
