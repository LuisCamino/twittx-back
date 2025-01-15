const bcrypt = require("bcrypt");
// importar modelo
const User = require("../models/user");
// importar servicios
const jwt = require("../services/jwt");
const createToken = require("../services/jwt");
const mongoosePaginate = require('mongoose-paginate-v2');

const pruebaUser = (req, res) => {
  return res.status(200).send({
    message: "estas en users",
    usuario: req.user,
  });
};

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
    const checkUser = await User.findOne({ username: params.username }).select({
      image: 0,
    });

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

    //obtener el token
    const token = jwt.createToken(user);

    return res.status(200).send({
      status: "success",
      message: "Welcome, " + user.username,
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Error logging in.",
      error,
    });
  }
};

const profile = async (req, res) => {
  //obtener el id del user
  const id = req.params.id;

  //consulta para sacar los datos sin mostrar user pass ni rol
  const userProfile = await User.findById(id).select({
    password: 0,
    username: 0,
    role: 0,
  });

  if (!userProfile) {
    return res.status(404).send({
      status: "error",
      message: "user doesn't exist or there is an error.",
    });
  }

  return res.status(200).send({
    status: "success",
    message: "showing profile...",
    user: userProfile,
  });
};


const listUsers = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const limit = 5;

    // Obtener los usuarios con paginación
    const users = await User.find()
      .sort({ _id: -1 }) // Ordenar por _id descendente
      .skip((page - 1) * limit) // Saltar elementos
      .limit(limit); // Limitar resultados por página

    // Obtener el número total de documentos
    const totalDocs = await User.countDocuments();

    // Calcular el total de páginas
    const totalPages = Math.ceil(totalDocs / limit);

    // Responder con los resultados
    return res.status(200).send({
      status: "success",
      users,
      page,
      totalPages,
      totalDocs
    });
  } catch (error) {
    // Manejo de errores
    return res.status(500).send({
      status: "error",
      message: "Error fetching paginated data",
      error: error.message,
    });
  }
};


module.exports = {
  registerUser,
  pruebaUser,
  login,
  profile,
  listUsers,
};
