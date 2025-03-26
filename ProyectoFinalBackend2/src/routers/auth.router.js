import CustomRouter from "../utils/CustomRouter.util.js";
import passportCb from "../middlewares/passportCb.mid.js";
import passport from "passport";
import CustomRouter from "../utils/CustomRouter.util.js";
import { register, login, signout, online, verifyAccount } from "../controllers/auth.controller.js";

class AuthRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init = () => {
    this.create("/register", ["PUBLIC"], passportCb("register"), register);
    this.create("/verify", ["PUBLIC"], verifyAccount);
    this.create("/login", ["PUBLIC"], passportCb("login"), login);
    this.create("/signout", ["USER", "ADMIN"], passport.authenticate("jwt", { session: false }), signout);
    this.create("/online", ["USER", "ADMIN"], passport.authenticate("jwt", { session: false }), online);
  };
}

const authRouter = new AuthRouter();
export default authRouter.getRouter();
