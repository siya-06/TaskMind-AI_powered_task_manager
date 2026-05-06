import jwt from 'jsonwebtoken'

function authmiddleware (req,res,next) {
    const token =req.headers['authorization']
    console.log(" Incoming token =", token)

    if(!token) {
        console.log("no token provided")
        return res.status(401).json({message: "no token provided"})
        }
    jwt.verify(token,process.env.JWT_SECRET, (err,decoded) => {
        if(err) {
            console.log("invalid token",err.message)
            return res.status(401).json({message:"invalid token"})
        }
        console.log("decoded user id=",decoded.id)
        req.userid = decoded.id
        next()
        
    })    
}
export default authmiddleware