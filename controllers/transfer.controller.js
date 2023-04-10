const User = require('../models/User');
const Transfer = require('../models/Transfer');
const catchAsync = require('../utils/catchAsync');

exports.transfer = catchAsync(async (req, res) => {
  {
    // Obteniendo los datos del cuerpo de la petición:
    const { amount, receiverAccountNumber, senderAccountNumber } = req.body;

    // Busca el usuario por número de cuenta que envía la transferencia
    const senderUser = await User.findOne({
      where: {
        accountNumber: senderAccountNumber,
        status: 'active',
      },
    });

    // Busca el usuario por número de cuenta que recibe la transferencia
    const receiverUser = await User.findOne({
      where: {
        accountNumber: receiverAccountNumber,
        status: 'active',
      },
    });

    // Si el usuario que envía la transferencia no existe o no tiene suficientes fondos, devuelve un mensaje de error
    if (
      !senderUser ||
      /*esto es para que el usuario no se haga una transferencia así mismo */
      senderUser === senderUser ||
      senderUser.balance < amount
    ) {
      return res.status(400).json({
        message: 'Insufficient funds or invalid sender account number',
      });
    }

    // Si el usuario que recibe la transferencia no existe, devuelve un mensaje de error
    if (!receiverUser) {
      return res
        .status(400)
        .json({ message: 'Invalid receiver account number' });
    }

    // Realiza la transferencia restando el monto de la cuenta del remitente y sumándolo a la cuenta del destinatario
    await senderUser.update({ balance: senderUser.balance - amount });
    await receiverUser.update({ balance: receiverUser.balance + amount });

    // Guarda la transferencia en la base de datos
    await Transfer.create({
      amount,
      senderUserId: senderUser.id,
      receiverUserId: receiverUser.id,
    });

    // Devuelve una respuesta indicando que la transferencia fue exitosa
    return res.status(200).json({ message: 'Transfer successful' });
  }
});
