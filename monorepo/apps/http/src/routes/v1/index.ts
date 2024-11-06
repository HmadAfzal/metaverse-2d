import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { signinSchema, signupSchema } from "../../types";
import client from "@repo/db";
import { hash, compare } from "../../scrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";
export const router = Router();

//signup

router.post("/signup", async (req, res) => {
  console.log("inside signup");
  const parsedData = await signupSchema.safeParse(req.body);
  console.log(parsedData);
  if (!parsedData.success) {
    console.log("parsed data incorrect", parsedData.error);
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  const hashedPassword = await hash(parsedData.data.password);

  try {
    const existingUser = await client.user.findFirst({
      where: {
        username: parsedData.data.username,
      },
    });

    if (existingUser) {
      res.status(400).json({ message: "username already exists" });
      return;
    }

    const user = await client.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.role === "admin" ? "Admin" : "User",
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (e) {
    console.log("erroer thrown");
    console.log(e);
    res.status(400).json({ message: "Something went wrong" });
  }
});

//signin
router.post("/signin", async (req, res) => {
  const parsedData = signinSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  try {
    const user = await client.user.findFirst({
      where: {
        username: parsedData.data.username,
      },
    });
    if (!user) {
      res.status(404).json({ message: "invalid username" });
      return;
    }

    const passwordMatch = await compare(
      parsedData.data.password,
      user.password
    );
    if (!passwordMatch) {
      res.status(400).json({ message: "invalid password" });
      return;
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);

    res.json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

//get avalible avatars
router.get("/avatars", async (req, res) => {
  const avatars = await client.avatar.findMany();
  res.json({
    avatars: avatars.map((x) => ({
      id: x.id,
      imageUrl: x.imageUrl,
      name: x.name,
    })),
  });
});

//See all available elements
router.get("/elements", async (req, res) => {
  const elements = await client.element.findMany();
  res.json({
    elements: elements.map((e) => ({
      id: e.id,
      imageUrl: e.imageUrl,
      width: e.width,
      height: e.height,
      static: e.static,
    })),
  });
});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
