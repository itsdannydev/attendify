const jwt = require('jsonwebtoken');

function verifyAuth(req,res,next){
    const token = req.cookies.authCookie;
    if(!token){
        return res.json({ success: false, message: "No authentication token provided" })
    }

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }catch(err){
        console.log("JWT verification error: ",err.message);
        return res.json({ success:false, message:"Invalid or Expired Token" })
    }
}

module.exports = verifyAuth;