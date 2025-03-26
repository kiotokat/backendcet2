import { Router } from "express";
import passport from "passport";

class CustomRouter {
  constructor() {
    this.router = Router();
    this.use(this.setupResponses);
  }

  getRouter = () => this.router;

  applyMiddlewares = (middlewares) =>
    middlewares.map((each) => async (req, res, next) => {
      try {
        await each(req, res, next);
      } catch (error) {
        next(error);
      }
    });

  setupResponses = (req, res, next) => {
    try {
      res.json200 = (resp) => res.status(200).json(resp);
      res.json201 = (resp) => res.status(201).json(resp);
      res.json400 = (err) => res.status(400).json({ error: err });
      res.json401 = (err) => res.status(401).json({ error: err });
      res.json403 = (err) => res.status(403).json({ error: err });
      res.json500 = (err) => res.status(500).json({ error: err });
      next();
    } catch (error) {
      next(error);
    }
  };

  create = (path, policies, ...middlewares) =>
    this.router.post(path, passport.authenticate("jwt", { session: false }), ...middlewares);

  read = (path, policies, ...middlewares) =>
    this.router.get(path, passport.authenticate("jwt", { session: false }), ...middlewares);

  update = (path, policies, ...middlewares) =>
    this.router.put(path, passport.authenticate("jwt", { session: false }), ...middlewares);

  destroy = (path, policies, ...middlewares) =>
    this.router.delete(path, passport.authenticate("jwt", { session: false }), ...middlewares);

  use = (path, ...middlewares) => this.router.use(path, ...middlewares);
}

export default CustomRouter;
