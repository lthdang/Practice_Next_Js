export interface ValidationError {
  origin: string;
  code: string;
  format?: string;
  pattern?: string;
  path: string[];
  message: string;
}

export interface ApiError {
  message: string;
  errors?: ValidationError[];
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  error?: ApiError;
}
