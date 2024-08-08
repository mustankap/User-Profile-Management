const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

const app = require(`./app`);
console.log(app.get('env'));
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`App is running on port ${port} ...`);
});
