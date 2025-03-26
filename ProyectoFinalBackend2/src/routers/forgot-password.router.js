import CustomRouter from "../utils/CustomRouter.util.js";
import { requestPasswordReset, resetPassword } from "../controllers/password.controller.js";

class PasswordRouter extends CustomRouter {
  constructor() {
    super();
    this.init();
  }

  init = () => {
    this.create("/forgot-password", ["PUBLIC"], requestPasswordReset);
    this.create("/reset-password", ["PUBLIC"], resetPassword);
  };
}

const passwordRouter = new PasswordRouter();
export default passwordRouter.getRouter();
