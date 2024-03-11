import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const userVerification = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        return res.status(401).json({ status: false })
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.status(401).json({ status: false })
        } else {
            const user = await User.findById(data.id)
            if (user){
                req.userData = {id: data.id}
                next();
            } else {
                return res.status(401).json({ status: false })
            }
        }
    })
}

export default userVerification