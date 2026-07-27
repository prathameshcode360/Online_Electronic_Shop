import express from "express";

const app = express();
app.get("/", (req, res) => {
  res.send("Welcome to Express Server");
});

const port = 3500;
app.listen(port, () => {
  console.log("Server is running on the port 3500");
});
