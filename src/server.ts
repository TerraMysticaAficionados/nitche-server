import express from "express";
import { resolve } from "path";
import browserify from "browserify-middleware";

const app = express();
const port = 8080;

app.use('/index.js', browserify("./dist/app/index.js"));
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname,"../src/app/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});