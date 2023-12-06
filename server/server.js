const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", require("./routes/root"));

app.all("*", (req, res) => {
  res.status(404);
  console.log(req.accepts("html"));
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "./views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not found" });
  } else {
    res.type("text").send("404 Not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
