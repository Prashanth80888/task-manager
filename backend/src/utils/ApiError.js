/**
 * Custom Error Class to handle operational errors
 */
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // This ensures the stack trace doesn't include the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

// Crucial for ES Modules:
export default ApiError;