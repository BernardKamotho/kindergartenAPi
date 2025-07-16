// Import the user schema
const { User } = require("../models/SchoolDb");
const bcrypt = require("bcrypt");

// import jwt
const jwt = require("jsonwebtoken");

// import the jwt secret key from .env file
const JWT_SECRET = process.env.JWT_SECRET;


// below is the controller to register an admin
exports.registerAdmin = async(req, res)=>{
    // pick the details passed from insomnia/postman
    const {name, email, password, secretKey} = req.body;

    // console.log(name, email, password, secretKey)

    // 1. Verify the admin secret Key
    if(secretKey !== process.env.ADMIN_SECRET_KEY){
        return res.status(403).json({message : "Unauthorized Account Creation"})
    };

    // 2. Check whether the user is already registered through the entered email address
    const existingUser = await User.findOne({ email });

    if (existingUser){
        return res.status(400).json({message : "User with this email address already exists"})
    };

    // 3. Create the admin user
    //hash the password first
    const hashedPassword = await bcrypt.hash(password, 10);

    // proceed
    const newUser = new User({
        name,
        email,
        password : hashedPassword,
        role : 'admin',
        isActive: true,
        teacher: null,
        parent : null
    });

    // create the user on the database
    const user = await newUser.save();

    //if the registration is successful, return a response to the user:
    res.status(201).json({message : "Admin account created successfully", user})
};


// below is the login route
exports.login = async(req, res) =>{
    try{

        // pick the details passed from insomnia/postman
        const {email, password} = req.body;

        // console.log(email, password);

        // 1. Check whether the email address passed is valid or not
        const user = await User.findOne({ email });
        // console.log("The details of the user are: ", user)

        if(!user){
            return res.status(401).json({message : "Email address could not be found."});
        }

        //2. check whether the use is active or not
        if(!user.isActive){
            return res.status(403).json({message : "Your account has been deactivated"});
        }

        //3. compare the provided password with the one stored in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({message : "Invalid password."})
        }

        //4. Generate JWT Token (will be needed when a person tries to login)
        const token = jwt.sign(
            {userId : user._id, role : user.role},
            JWT_SECRET,
            {expiresIn : '4h'} 
        );

        //5. send a success message 
        res.json({
            message: "Login successfull",
            token,
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
                role: user.role
            }
        });

    }
    catch(err){
        res.status(500).json({message : 'Login Failed', error: err.message})
    }
};