class apiError extends Error {
    constructor(statusCode, message = "Something went wrong", stack = []) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.data = null;
        this.stack = stack;
    }
}

export default apiError;