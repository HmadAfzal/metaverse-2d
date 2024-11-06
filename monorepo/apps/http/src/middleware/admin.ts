import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { Response, Request, NextFunction } from "express";

export const isadmin = (req:Request, res:Response, next:NextFunction) => {
  const header = req.headers["authorization"];
  console.log(header);
  const token = header.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      role: string;
      userId: string;
    };
    if (decoded.role !== "Admin") {
      res.status(401).json({ message: "unauthorized" });
      return;
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
};
