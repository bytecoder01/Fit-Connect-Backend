import userModel from './../Models/userModel.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
//Get a user

export const getUser = async(req,res)=>{

const id = req.params.id;
try {
    const user = await userModel.findById(id);
    if(user){

   const {password,...otherDetails} = user._doc
   res.status(200).json(otherDetails)

    }else{

  res.status(404).json("User not found")
    }
} catch (error) {
    res.status(404).json(error)
}

}
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id,  password } = req.body;

  if (id === _id ) { // Ensure only the user or an admin can update the user
    try {
      // If a new password is provided, hash it
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }

      // Update the user data
      const user = await userModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      // Check if the user exists after the update
      if (user) {
        // Create a new token with updated user data
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );



    
        // Respond with the updated user and the new token
        res.status(200).json({ user, token});
      } else {
        res.status(404).json("User not found");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied! You can update only your own account.");
  }
};

// deleting a user


export const deleteUser = async(req,res)=>{
    const id = req.params.id;

    const {currentUserId, currentUserAdminStatus}= req.body
    if (currentUserId === id || currentUserAdminStatus){

try {

    await userModel.findByIdAndDelete(id)
    res.status(200).json("User delted successfully")
    
} catch (error) {
    res.status(500).json(error)
}

    }
    else{

        res.status(403).json("You are not authorized to delete this user")
    }

} 


// follow a user



export const followUser = async (req, res) => {
    const id = req.params.id;
    const { _id } = req.body;

    try {
        if (_id === id) {
            return res.status(403).json({ message: "Action forbidden" });
        }

        const followUser = await userModel.findById(id);
        const followingUser = await userModel.findById(_id);

        if (!followUser.followers.includes(_id)) {
            await followUser.updateOne({ $push: { followers: _id } });
            await followingUser.updateOne({ $push: { following: id } });

            return res.status(200).json("User followed!");
        } else {
            return res.status(403).json("User is already followed!");
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};




// unfollow a user



export const unfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;

  try {
      if (_id === id) {
          return res.status(403).json({ message: "Action forbidden" });
      }

      const followUser = await userModel.findById(id);
      const followingUser = await userModel.findById(_id );

      if (followUser.followers.includes(_id )) {
          await followUser.updateOne({ $pull: { followers: _id } });
          await followingUser.updateOne({ $pull: { following: id } });

          return res.status(200).json("User Unfollowed!");
      } else {
          return res.status(403).json("User is not in your followers list!");
      }
  } catch (error) {
      return res.status(500).json(error);
  }
};


export const getAllUsers = async(req,res)=>{
try {
  let users = await userModel.find();
  users = users.map((user)=>{

    const { password,...otherDetails} = user._doc
    return otherDetails
  })
  res.status(200).json(users)
} catch (error) {
  res.status(500).json(error);
}

}