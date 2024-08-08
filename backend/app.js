const path = require('path');
const express = require('express');
const AppError = require('./utils/appError');
const userRouter = require(`./routes/userRoutes`);
const globalErrorHandler = require('./controllers/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const app = express();

// app.set('view engine', 'pug');
// app.set('views', path.join(__dirname, 'views'));
// 1)MIDDLEWARES
//Set security HTTP header
app.use(helmet());
app.use(
  cors({
    origin: 'http://localhost:4200', // Your Angular app's URL
    credentials: true,
  })
);

//development logging
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgen('dev'));
// }

//limit requests from same API
// const limiter = rateLimit({
//   max: 1000,
//   windowMs: 1000 * 60 * 60,
//   message: 'Too many requests from this IP, Please try again in an hour !',
// });
// limiter
// app.use('/api');

//Body parser, reading data from the body into req.body
app.use(express.json()); //{ limit: '10kb' }

//serving static files
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   console.log("hello from the middleware");
//   next();
// });

//test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

app.use(`/api/v1/users`, userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
