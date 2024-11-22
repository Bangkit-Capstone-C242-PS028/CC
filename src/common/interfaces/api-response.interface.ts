export interface ApiResponse<T> {
  statusCode: number;
  error?: string;
  success?: {
    message: string;
    data: T;
  };
}
