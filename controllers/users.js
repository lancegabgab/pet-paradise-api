const User = require("../models/users");
const bcrypt = require("bcrypt");
const auth = require("../auth");

const registerUser = (req,res) => {
    let newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
                //bcrypt.hashSync is to hide the actual pasaword
        password: bcrypt.hashSync(req.body.password, 10),
        mobileNo: req.body.mobileNo,
        isAdmin : req.body.isAdmin
    })
    if(req.body.mobileNo.length !== 11){
        return res.status(404).send({error: "Your number is not 11 digits"})
    }
    if(!req.body.email.includes("@")){
        return res.status(404).send({error: "Your email does not include @ character"})
    }
    if(req.body.password.length < 8){
        return res.status(404).send({error: "Your password must compose of atleast 8 characters"})
    }

    return newUser.save()
    .then((user) => res.status(201).send({ message: "Registered Successfully"}))
    .catch(err => {
    console.error("Error in register", err)
    return res.status(500).send({error: 'Email is duplicated.'});
    })
}

const loginUser = (req,res) => {
    
    return User.findOne ({email: req.body.email})
    .then((result) => {
        if(result == null) {
            return res.status(404).send({ error: "No Email Found" });
        }
        else {
            //verify password
            const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password); // true or false

            if (isPasswordCorrect == true) {
                //if the password matches, the paplication server will create/generate a token.
                    return res.status(200).send({ access : auth.createAccessToken(result)})
                } else {
                    //if the password does not match, it should response that it does not match "Email and password do not match".
                    return res.status(401).send({ message: "Email and password do not match" })
                }
        }
    })
            .catch(err => {
             console.error("Error in logging in", err)
             return res.status(500).send({error: 'Cannot log in.'});
        })
}

const getAllUsers = (req,res) => {
    return User.find ({})
    .then (result => {
        res.status(200).send({result})
    })
    .catch(err => {
             console.error("Error in getting all info", err)
             return res.status(500).send({error: 'Failed to get details of user.'});
    })
}

const getProfile = (req,res) =>{
    return User.findById(req.user.id)
    .then (result => {
        if (result){
            result.password = "";
            res.status(200).send(result)
        }

    })
    .catch(err => {
             console.error("Error in getting all info", err)
             return res.status(500).send({error: 'Failed to get details of user.'});
    })
}

const resetPassword = async (req, res) => {
  try {
    const newPassword = { password : bcrypt.hashSync(req.body.newPassword, 10)};

    // Updating the user's password in the database
    await User.findByIdAndUpdate(req.user.id, newPassword );

    // Sending a success response
    res.status(200).send({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal server error' });
  }
};

const updateAdmin = (req, res) => {
  const { userId } = req.params;

  if (!req.user.isAdmin) {
    return res.status(403).send({ message: 'Permission denied. Only admins can update user roles.' });
  }

  // Update the user's role to admin
  User.findByIdAndUpdate(userId, { isAdmin: true })
    .then(() => {
      res.status(200).send({ message: 'User role updated successfully.' });
    })
    .catch((error) => {
      console.error('Error updating user role:', error);
      res.status(500).send({ message: 'Failed to update user role.' });
    });
};

module.exports = { 
    registerUser, 
    loginUser,
    getAllUsers,
    getProfile,
    resetPassword,
    updateAdmin
};
