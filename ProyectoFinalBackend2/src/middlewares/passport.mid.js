import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { usersManager } from "../dao/index.dao.js";
import { compareHash, createHash } from "../utils/hash.util.js";
import { createToken } from "../utils/token.util.js";
import UserDto from "../dto/users.dto.js";

// Estrategia para registro de usuario
passport.use(
  "register",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      try {
        const userExists = await usersManager.readBy({ email });
        if (userExists) {
          return done(null, false, { message: "Email already in use", statusCode: 400 });
        }

        // Crear nuevo usuario con DTO
        const newUser = await usersManager.create(new UserDto({ ...req.body, password: createHash(password) }));

        // Generar JWT
        const token = createToken({ user_id: newUser._id, email: newUser.email, role: newUser.role });

        // Retornar el usuario y el token
        return done(null, { user: newUser, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Estrategia para login de usuario

passport.use(
  "login",
  new LocalStrategy(
    { passReqToCallback: true, usernameField: "email" },
    async (req, email, password, done) => {
      try {
        const user = await usersManager.readBy({ email });
        if (!user) {
          return done(null, null, { message: "Invalid credentials", statusCode: 401 });
        }
        if (!user.verified) {
          return done(null, null, { message: "Account not verified", statusCode: 403 });
        }
        const verifyPassword = compareHash(password, user.password);
        if (!verifyPassword) {
          return done(null, null, { message: "Invalid credentials", statusCode: 401 });
        }
        const token = createToken({
          email: user.email,
          role: user.role,
          user_id: user._id,
        });
        req.token = token;
        done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// Estrategia JWT para autenticación
passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await usersManager.readById(payload.user_id);
        if (!user) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
