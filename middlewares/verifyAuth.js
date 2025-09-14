const jwt = require('jsonwebtoken');

function verifyAuth(req,res,next){
    const token = req.cookies.authCookie;
    if(!token){
        if(req.body == undefined){
            return res.redirect(`/?message=${encodeURIComponent("Authentication Token Not Found")}`);
        }
        return res.json({ success:false, message: "Authentication Token Not Found" });
    }

    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        next();
    }catch(err){
        console.log("JWT verification error: ",err.message);
        if(req.body == undefined){
            return res.redirect(`/?message=${encodeURIComponent("Auth Verification Failed")}`);
        }
        return res.json({ success:false, message: "Auth Verification Failed" });
    }
}

module.exports = verifyAuth;