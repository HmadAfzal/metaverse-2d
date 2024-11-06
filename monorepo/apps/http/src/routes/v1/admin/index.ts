import { Router } from "express";
import {
  createAvatarSchema,
  createElementSchema,
  createMapSchema,
  updateElementSchema,
} from "../../../types";
import client from "@repo/db";
import { isadmin } from "../../../middleware/admin";
export const adminRouter = Router();

//create element
adminRouter.post("/element", isadmin, async (req, res) => {
  const parsedData = createElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  try {
    const element = await client.element.create({
      data: {
        height: parsedData.data.height,
        width: parsedData.data.width,
        imageUrl: parsedData.data.imageUrl,
        static: parsedData.data.static,
      },
    });
    res.json({
      id: element.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//update element
adminRouter.put("/element/:elementid", isadmin, async (req, res) => {
  const parsedData = updateElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  try {
    await client.element.update({
      where: {
        id: req.params.elementId,
      },
      data: {
        imageUrl: parsedData.data.imageUrl,
      },
    });
    res.json({ message: "Element updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//create avatar
adminRouter.post("/avatar", isadmin, async (req, res) => {
  const parsedData = createAvatarSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }
  try {
    const avatar = await client.avatar.create({
      data: {
        imageUrl: parsedData.data.imageUrl,
        name: parsedData.data.name,
      },
    });
    res.json({ avatarId: avatar.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//create map
adminRouter.post("/map", isadmin, async (req, res) => {
  const parsedData = createMapSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  try {
    const map = await client.map.create({
      data: {
        name: parsedData.data.name,
        width: parseInt(parsedData.data.dimensions.split("x")[0]),
        height: parseInt(parsedData.data.dimensions.split("x")[1]),
        thumbnail: parsedData.data.thumbnail,
        mapelements: {
          create: parsedData.data.defaultElements.map((element) => ({
            elementId: element.elementId,
            x: element.x,
            y: element.y,
          })),
        },
      },
    });

    res.json({
      id: map.id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
