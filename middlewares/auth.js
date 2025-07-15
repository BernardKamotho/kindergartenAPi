// import the jsonwebtoken
const jwt = require("jsonwebtoken");

// import the secret key
const JWT_SECRET = process.env.JWT_SECRET;


// create an auth function
const auth = (req, res, next)=>{
    // extract the auth header
    const authHeader = req.headers.authorization;

    // split the header string into an array using the space
    // So far the header usually contains the keyword "bearer" concantenated with the token
    // after the split happens, "bearer" appears on the first index = 0, and the token appears on the second index = 1

    const token = authHeader && authHeader.split(' ')[1];

    // step1: Check whether the request sent by a person contains the token or not
    if(!token) {
        return res.status(401).json({message : "No token provided."})
    }

    // step2: Check whether incase of a token whether the token is valid or not
    try{
        // verify the validity of the token using the jwt secret key
        const decoded = jwt.verify(token, JWT_SECRET);

        // attach the decoded payload (user data) to the request object
        req.user = decoded;


        // if it is valid you proceed to the next step
        next();

    }
    catch(err){
        // if the token is invalid return a response
        res.status(403).json({message : "Invalid token"});
    }
};


// Middleware it shall be used to authorize access to resources based on the user's role
// Accepts any number of allowed roles (e.g 'admin', 'parent', 'teacher');
// usage : authorizeRoles('admin','teacher');
//...params - accepts any number of argumentd and automatically put them into an array


const authorizeRoles = (...allowedRoles) =>{
    return (req, res, next) =>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
            return res.status(403).json({message : "Access Denied: Insufficient permissions"})
        }

        // just allow the person
        next();
    }
};
// export the two functions
module.exports = {auth, authorizeRoles};