export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  fields?: Record<string, string[]>;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiErrorBody;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiErrorResponse;
