import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost/fashionbar", {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("db connected");
});

db.dropDatabase(err =>
  err === null ? console.log("db has been dropped") : console.log(err)
);
