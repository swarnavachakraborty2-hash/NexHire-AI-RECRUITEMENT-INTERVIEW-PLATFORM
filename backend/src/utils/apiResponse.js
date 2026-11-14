class apiResponse {
    constructor(statusCode, data, message = "Success") {
        this.message = message;
        this.statusCode = statusCode;
        this.data = data;
        this.success = true;
    }
}

export default apiResponse;