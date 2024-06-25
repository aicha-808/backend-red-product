const express = require('express');
const  User = require('../models/User');
const router = express.Router();
const crypto = require('crypto');
const Token = require ('../models/token');
const sendEmail = require('../config/sendEmail');
const bcrypt = require('bcryptjs');

// route pour demander la reinitialisation 
const bcryptSalt = 10;
router.post( '/forgot-password' ,async (req, res) => {
    const { email } = req.body;
    console.log(email);
    try {
        const user = await User.findOne({email: email})
        if (!user) {
            return res
              .status(400)
              .json({ message: "utilisateur n'existe pas" });
        }

        const token = await Token.findOne({ userId: user._id });
        if(token) await token.deleteOne();
          console.log(token);
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hash = await bcrypt.hash(resetToken, bcryptSalt);

        await new Token({
          userId: user._id,
          token: hash,
          createdAt: Date.now(),
      }).save();

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&id=${user._id}`;
      console.log(resetUrl);
      const message = `To reset your password, click this link: ${resetUrl}`;
      await sendEmail(user.email, 'Password rejet request', message);
        return res
        .status(200)
        .json({ message: "Password rejet email sent" });

    } catch (err) {
        console.error( err);
        res.status(500).json({message: "aaa Erreur du serveur"})
        console.log("test:", err);
    }
})

// Route pour reunitialise
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { userId, password } = req.body;
  console.log(token);
  console.log(password);
  console.log(userId);
  try {
    const passwordResetToken = await Token.findOne({ email });
    if (!passwordResetToken) {
      return res.status(400).json({ message: "Invalid or expired password reset token" });
      console.log(passwordResetToken);
    }
  
    const isValid =  bcrypt.compare(token, passwordResetToken.token);

    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired password reset token" });
    }
    console.log(isValid);
    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    await User.updateOne(
    { _id: userId },
    { $set: { password: hash } },
    { new: true }
    );

    const user = await User.findById(userId);
    await sendEmail(user.email, "Password Reset Successfully", { name: user.name });
    await passwordResetToken.deleteOne();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur du serveur" });
  } 

});

module.exports = router;