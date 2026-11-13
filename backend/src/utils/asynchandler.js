
const asyncHandler = (fn) => async(req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(error.statuscode || 500).json({
            message: error.message || "something went wrong"
        })
    }
}

export default asyncHandler