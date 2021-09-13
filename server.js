const express = require("express");

((app) => {
  app.use(express.static("./game/"));
  const server = app.listen(3000, () => {
    console.log("Open http://localhost:3000/");
  });
})(express());
