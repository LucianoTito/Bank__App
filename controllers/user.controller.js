const User = require('../models/user.models');
const catchAsync = require('../utils/catchAsync');

exports.createAccount = catchAsync(async (req, res) => {
  // Obteniendo los datos del cuerpo de la petición
  const { name, password } = req.body;

  // Creación de un nuevo usuario
  const newUser = await User.create({
    name,
    password,
  });

  // Devuelve una respuesta con el nuevo usuario creado
  return res.status(201).json({
    status: 'success',
    message: 'The user has been created',
  });
});

exports.login = catchAsync(async (req, res) => {
  // Obteniendo los datos del cuerpo de la petición:
  const { accountNumber, password } = req.body;

  // Busca el usuario por número de cuenta, contraseña y estado activo
  const user = await User.findOne({
    where: {
      accountNumber,
      password,
      status: 'active',
    },
  });
  // Si el usuario no existe o la contraseña es incorrecta, devuelve un mensaje de error
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Si todo está bien, devuelve una respuesta con el usuario y un token de sesión
  return res.status(200).json({ user });
});

exports.getTransferHistory = catchAsync(async (req, res) => {
  const userId = req.params.id;

  // Busca al usuario por ID y asegura que esté activo
  const user = await User.findOne({
    where: {
      id: userId,
      status: 'active',
    },
  });

  // Si el usuario no existe, devuelve un mensaje de error
  if (!user) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  // Busca todas las transferencias realizadas por el usuario
  const transfers = await Transfer.findAll({
    where: {
      senderUserId: user.id,
    },
  });

  // Devuelve las transferencias en una respuesta JSON
  return res.status(200).json(transfers);
});
