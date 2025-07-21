const { response } = require('express');
const { Parent, User } = require('../models/SchoolDb');

// import the bcrypt module so as to hash the password
const bcrypt = require("bcrypt")

// fetch/Get all the parents
exports.getAllParents = async(req, res)=>{
    try{
        // we shall use the find function to accomplish this
        const parents = await Parent.find();

        // give the details of the parents as a response
        res.json(parents)
    }
    catch(err){
        // handle any error
        res.status(500).json({message : "Error fetching parents", error: err.message})
    }
};

// add a new parent
exports.addParent = async(req, res)=>{
    try{
        // Destructure the request body
    const { name, email, phone, nationalID, address} = req.body;

    // console.log("The details from the req body are : ", name, email, phone, nationalID, address )

    // Check whether the parent already exists based on the email address that has been passed
    const existParentEmail = await User.findOne({ email });

    if(existParentEmail){
        return res.status(400).json({message : "Parent with this email address already Exists"})
    }

    // check whether a parent with the given id number already exists
    const existsIdNumber = await Parent.findOne({ nationalID })
    if(existsIdNumber){
        return res.status(400).json({message : "A parent with the same National ID number Already registered."})
    }

    // create and save the parent document
    const newParent = new Parent(req.body)
    const savedParent = await newParent.save()

    // console.log("The details inside of the SavedParent Variable are: ", savedParent)

    // set a default password which shall be changed by the parent when he/she logs in on th dashboard
    const defaultPassword = 'parent1234';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);


    // we create a corresponding user document with the role 'parent'
    const newUser = new User({
        name,
        email,
        password : hashedPassword,
        role : 'parent', 
        parent : savedParent._id
    })

    // console.log(newUser)

    await newUser.save();

    // if the details of the parent are saved successfully, return a response with the saved details
    res.status(201).json({message : "parent saved successfully", parent : savedParent})
    }
    catch(err){
        // handle any error that might occur
        res.status(400).json({message : "Error adding a parent", error: err.message})
    }

};

// Get a parent by use of the ID
exports.getParentById = async(req, res) =>{
    try{
        const parent = await Parent.findOne({ nationalID : req.params.id});

        if(!parent){
            return res.status(404).json({message : "Parent Not Found"})
        }

        res.json(parent);
    }
    catch(err){
        res.status(500).json({message : "Error fetching a Parent"})
    }
};


// Updating the details of a parent
exports.updateParent = async (req, res)=>{
    try{
        // We shall update a parent by use of the id
        const updatedParent = await Parent.findByIdAndUpdate(req.params.id, req.body, {new : true});

        // if the parent with the given Id does not exist, give a response back
        if(!updatedParent){
            return res.status(404).json({message : "Parent not found"})
        }

        // if the parent with the passed id is there, proceed to update her/his details and give a response with the new details
        res.json(updatedParent)
    }
    catch(err){
        // handle any error that might occur during the update process
        res.status(500).json({message : "Error Updating the parent", error: err.message})
    }
};



// Delete functionality for the Parent

exports.deleteParent = async(req, res) =>{
    try{
        // We shall use the findByIdAndDelete() function to do this
        const deletedParent = await Parent.findByIdAndDelete(req.params.id)

        // check whether the given id exists or not
        if(!deletedParent) {
            return res.status(404).json({message : "Parent with that id not Found!"})
        }

        // Delink from the User collection
        await User.findOneAndDelete({  parent: req.params.id })

        // if the whole process is a success, give a response back
        res.json({message : "Parent and the assosiated User's Accounts Deleted Successfully...!!!"})
    }
    catch(err){
        // handle any error that might occur
        res.status(500).json({message : "Error deleting a Parent", error : err.message})
    }
}
