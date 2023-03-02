const express = require("express");
const User = require("../model/user");
const bcrypt = require("bcrypt");

const router = express.Router();
// Create new user
router.post("/createUser", async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const data = new User({
    username: req.body.username,
    password: hashedPassword,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const jwt = require("jsonwebtoken");
//AUTHENTICATE LOGIN AND RETURN JWT TOKEN
router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  //check to see if the user exists in the list of registered users
  if (user == null) res.status(400).json({ message: "User does not exist!" });

  //if user does not exist, send a 400 response
  if (await bcrypt.compare(req.body.password, user.password)) {
    const accessToken = generateAccessToken({ user: req.body.username });
    const refreshToken = generateRefreshToken({ user: req.body.username });
    res.json({
      username: user.username,
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } else {
    res.status(400).json({ message: "Password incorrect" });
  }
});

//REFRESH TOKEN API
router.post("/refreshToken", (req, res) => {
  if (!refreshTokens.includes(req.body.token))
    res.status(403).send("Refresh Token Invalid");

  jwt.verify(req.body.token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      //remove the old refreshToken from the refreshTokens list
      refreshTokens = refreshTokens.filter((c) => c != req.body.token);
      res.status(403).send("Refresh Token invalid");
    } else {
      //remove the old refreshToken from the refreshTokens list
      refreshTokens = refreshTokens.filter((c) => c != req.body.token);

      const accessToken = generateAccessToken({ user: req.body.username });
      const refreshToken = generateRefreshToken({ user: req.body.username });
      //generate new accessToken and refreshTokens
      res.json({ accessToken: accessToken, refreshToken: refreshToken });
    }
  }); //end of jwt.verify()
});

// Generate Tokens valid for 24 hours
function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1440m",
  });
}
// refreshTokens
let refreshTokens = [];
function generateRefreshToken(user) {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1440m",
  });
  refreshTokens.push(refreshToken);
  return refreshToken;
}

router.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((c) => c != req.body.token);
  //remove the old refreshToken from the refreshTokens list
  res.status(200).send("Logged out!");
});

function validateToken(req, res, next) {
  //get token from request header
  const authHeader = req.headers["authorization"];
  if (authHeader == null || authHeader == undefined)
    res.status(400).json({ message: "Token not present" });
  //the request header contains the token "Bearer <token>", split the string and use the second value in the split array.
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      res.status(401).send("Token invalid");
    } else {
      req.user = user;
      next(); //proceed to the next action in the calling function
    }
  }); //end of jwt.verify()
}

module.exports = { authRoutes: router, validateToken: validateToken };
