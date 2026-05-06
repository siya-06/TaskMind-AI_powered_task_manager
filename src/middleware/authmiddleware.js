import jwt from 'jsonwebtoken';

function authmiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("Invalid or missing Authorization header:", authHeader);
        return res.status(401).json({ message: "Invalid or missing token format" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Token missing from Bearer" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log("Invalid token:", err.message);
            return res.status(401).json({ message: "Invalid token" });
        }

        console.log("Decoded user id =", decoded.id);

        req.userid = decoded.id;
        next();
    });
}

export default authmiddleware;