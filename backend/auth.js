import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import Blacklist from "./model/Blacklist.js";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

export async function authMiddleware(req, res, next) {
  // Use lowercase 'authorization' to access the header
  const authHeader = req.headers["authorization"];
  const userId = req.headers['id']; 

  // Check if the Authorization header is present and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ") || !userId) {
    console.log("JWT verification error: Bearer");
    return res.status(403).json({ message: "No token provided or invalid format, authorization denied." });
  }

  // Extract the token (everything after "Bearer ")
  const token = authHeader.split(' ')[1];

  // If the token is missing or not properly formatted
  if (!token) {
    console.log("JWT verification error: no tokern");
    return res.status(403).json({ message: "No token provided, authorization denied." });
  }


  const isBlacklisted = await Blacklist.findOne({ where: { user_id: userId } });

  if (isBlacklisted) {
    return res.status(401).json({ message: 'User is blacklisted' });
  }
  // Verify the token
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("JWT verification error: ", err);
      return res.status(401).json({ message: "Invalid token." });
    }

    // Token is valid, attach decoded user info to the request
    req.user = decoded;
    console.log("allowing user with id:", decoded.id);
    next();
  });
}
