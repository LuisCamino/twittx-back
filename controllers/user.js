const bcrypt = require("bcrypt");
const User = require("../models/user");

registerUser = async (req, res) => {
  const params = req.body;

  // Form validation
  if (!params.name || !params.username || !params.email || !params.password) {
    return res.status(400).send({
      message: "You can't leave empty fields",
    });
  }
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: params.email }, { username: params.username }],
    });

    if (existingUser) {
      return res.status(400).send({
        message: "User with this email or username already exists.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(params.password, 10);
    params.password = hashedPassword;

    // Create new user instance
    const create_user = new User(params);

    // Save user to the database
    await create_user.save();

    return res.status(200).send({
      status: "success",
      message: "User created successfully.",
      user: create_user,
    });
  } catch (error) {
    console.error(error); 
    return res.status(500).send({
      message: "Error creating user.",
      error,
    });
  }


};

Login  = async (req, res) => {
    
}

module.exports = {
  registerUser,
};
