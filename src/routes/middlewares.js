const jwt = require("jsonwebtoken");
const { promisify } = require("util");

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Token not provided"
        });
    }

    const parts = authHeader.split(" ");

    if (!parts.length === 2) {
        return res.status(401).json({
            message: "Token error"
        });
    }

    const [scheme, token] = parts;

    // if (/^Bearer$/i.test(scheme)) {
    //     return res.status(401).json({
    //         message: "Token malformed"
    //     })
    // }

    try {
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);

        req.userId = decoded.id;

        return next();
    } catch (err) {
        return res.status(401).json({
            message: "Token invalid"
        });
    }
};
