
const login = async (req, res) => {
  const { token, user } = req;
  const opts = { maxAge: 60 * 60 * 24 * 7 * 1000 };
  res.cookie("token", token, opts).json200(user, "Logged in");
};
const signout = (req, res) =>
  res.clearCookie("token").json200(null, "Signed out");
const online = (req, res) => res.json200(null, "It's online");
const google = async (req, res) => {
  const { token, user } = req;
  const opts = { maxAge: 60 * 60 * 24 * 7 * 1000};
  res.cookie("token", token, opts).json200(user, "Logged in with google");
};
const failure = (req, res) => {
  return res.json401();
};

import { usersManager } from "../dao/index.dao.js";
import { sendVerificationEmail } from "../utils/email.util.js";
import { createHash, compareHash } from "../utils/hash.util.js";
import { createToken } from "../utils/token.util.js";

 const register = async (req, res, next) => {
  try {
    const user = await usersManager.create({
      ...req.body,
      verified: false, // El usuario se crea NO verificado
      verificationCode: Math.floor(100000 + Math.random() * 900000), // Código de 6 dígitos
    });
    
    // Enviar email con código de verificación
    await sendVerificationEmail(user.email, user.verificationCode);

    res.json201({ message: "User registered. Check your email for verification code." });
  } catch (error) {
    next(error);
  }
};

//Verificar cuenta con el código
 const verifyAccount = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const user = await usersManager.readBy({ email });

    if (!user || user.verificationCode !== code) {
      return res.json400({ message: "Invalid verification code" });
    }

    // Marcar usuario como verificado
    user.verified = true;
    user.verificationCode = null;
    await usersManager.update(user._id, user);

    res.json200({ message: "Account verified. You can now log in." });
  } catch (error) {
    next(error);
  }
};


export { register, login, signout, online, google, failure, verifyAccount };
