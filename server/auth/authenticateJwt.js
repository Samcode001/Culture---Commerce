import jwt from "jsonwebtoken";

 const authenticateJwt = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.jwtSecret, (err, user) => {
        if (err) return res.status(402).send(`UnAuthorised:${err}`);

        req.headers["user"] = user;
        next();
      });
    } else {
      res.status(404).send("Token not fetched");
    }
  } catch (error) {
    res.status(500).send(`Error in Authentication:${error}`);
  }
};

export default authenticateJwt