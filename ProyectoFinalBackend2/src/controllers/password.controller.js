import { usersManager } from "../dao/index.dao.js";
import { sendPasswordResetEmail } from "../utils/email.util.js";
import { createHash } from "../utils/hash.util.js";

export const requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await usersManager.readBy({ email });

    if (!user) {
      return res.json400({ message: "User not found" });
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000);
    user.resetCode = resetCode;
    await usersManager.update(user._id, user);

    await sendPasswordResetEmail(user.email, resetCode);
    
    res.json200({ message: "Reset code sent to your email" });
  } catch (error) {
    next(error);
  }
};
