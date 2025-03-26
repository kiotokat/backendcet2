import passport from "./passport.local.js";

function passportCb(strategy) {
  return async function (req, res, next) {
    return passport.authenticate(strategy, (err, data, info) => {
      try {
        if (err) return next(err);
        if (!data) {
          const error = new Error(info?.message || "Authentication failed");
          error.statusCode = info?.statusCode || 401;
          throw error;
        }

        req.user = data.user;
        req.token = data.token;
        next();
      } catch (error) {
        next(error);
      }
    })(req, res, next);
  };
}

export default passportCb;
