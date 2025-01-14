const jwt= require('jsonwebtoken')


const getJwtToken=(userId)=>{
    return jwt.sign({
        //payload
        },process.env.JWT_SECRET,{expiresIn:"1 day"})
}

module.exports = getJwtToken;