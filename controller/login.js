const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Invalid credentials email and password" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
    //   console.log(password);
    //   console.log(user.password);
    //   console.log(isMatch);
      if (!isMatch) {
        return res.status(400).json({ message: "le mot de pass n'existe pas" });
      }

      // const payload = { user: { id: user.id } };

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ message: "welcom", token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
