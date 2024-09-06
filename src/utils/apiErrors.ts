export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function formatErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return {
      status: 'error',
      statusCode: error.statusCode,
      message: error.message,
    };
  }
  
  return {
    status: 'error',
    statusCode: 500,
    message: 'Internal Server Error',
  };
}