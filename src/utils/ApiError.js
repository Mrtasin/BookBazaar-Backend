class ApiError extends Error {
  constructor(statusCode, message, errros = []) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.errros = errros;
  }
}

export default ApiError;
