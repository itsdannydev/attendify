const jwt = require('jsonwebtoken');

function verifyAdminAuth(req,res,next){
    const token = req.cookies.authCookie;
    if(!token){
        if(req.body == undefined){
            return res.redirect(`/?message=${encodeURIComponent("Admin Authentication Token Not Found")}`);
        }
        return res.json({ success:false, message: "Admin Authentication Token Not Found" });
    }
    
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if(payload.role !== "admin"){
            return res.redirect('/');
        }
        req.user = payload;
        next();
    }catch(err){
        console.log("JWT verification error: ",err.message);
        if(req.body == undefined){
            return res.redirect(`/?message=${encodeURIComponent("Admin Auth Verification Failed")}`);
        }
        return res.json({ success:false, message: "Admin Auth Verification Failed" });
    }
}

module.exports = verifyAdminAuth;