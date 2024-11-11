const bcrypt = require("bcrypt");
const User = require("../models/user");

const registerUser = async (req, res) => {
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

const login = async (req, res) => {
  const params = req.body;

  if (!params.username || !params.password) {
    return res.status(400).send({
      message: "You can't leave empty fields",
    });
  }

  try {
    // Busca al usuario solo por el nombre de usuario
    const checkUser = await User.findOne({ username: params.username }).select({ "image": 0 });

    // Si no se encuentra el usuario, devuelve un mensaje de error
    if (!checkUser) {
      return res.status(400).send({
        message: "Incorrect user or password.",
      });
    }

    // Verifica la contraseña con bcrypt
    const match = await bcrypt.compare(params.password, checkUser.password);

    if (!match) {
      // Si la contraseña es incorrecta, devuelve un mensaje de error
      return res.status(400).send({
        message: "Incorrect user or password.",
      });
    }

    // Si la contraseña es correcta, devuelve el usuario
    const user = checkUser.toObject();
    delete user.password; //  elimina la contraseña del objeto usuario para mayor seguridad

    return res.status(200).send({
      status: "success",
      message: "Welcome, " + user.username,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error logging in.",
      error,
    });
  }
};

module.exports = {
  registerUser,
  login,
};
