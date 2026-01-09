// TypeScript type definitions for the application

export interface Student {
    id: number;
    nome: string;
    email: string;
    serie: string;
}

export interface User {
    email: string;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    email: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface ApiError {
    message: string;
    statusCode?: number;
}
