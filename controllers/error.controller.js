const AppError = require('../utils/appError');
/*Función que la invocamos en la línea 47 */
const handleCastError22P02 = () =>
  /*generamos un error con la clase AppError, la clase AppError genera errores operacionales */
  new AppError('Some type of data send does not match as expected', 400);

/*con esto gestinamos los errores en fase de desarrollo */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack:
      err.stack /*en esta línea enviamos el error pero más detallado, es una propiedad del stack de errores */,
    error: err,
  });
};
/*Con esto se gestionan los errores en fase de producción */
const sendErrorProd = (err, res) => {
  //Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programmin or other uknown error: don't leak error
    res.status(500).json({
      status: 'fail',
      message: 'Something went very wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
  if (process.env.NODE_ENV === 'production') {
    /*con esta función manejamos los errores por el nombre y no por el código, el nombre es 22P02, el código sería un error 400 */

    let error = err;
    console.log(error.parent?.code);

    if (error.parent?.code === '22P02') error = handleCastError22P02();
    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
