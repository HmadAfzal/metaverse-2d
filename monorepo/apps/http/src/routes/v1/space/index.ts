import { Router } from "express";
import {
  createElementSchema,
  createSpaceSchema,
  DeleteElementSchema,
} from "../../../types";
import { isAuthorized } from "../../../middleware/user";
import client from "@repo/db";
export const spaceRouter = Router();

//create space
spaceRouter.post("/", isAuthorized, async (req, res) => {
  const parsedData = createSpaceSchema.safeParse(req.body);
  if (!parsedData.success) {
    console.log(JSON.stringify(parsedData));
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  try {
    if (!parsedData.data.mapId) {
      const space = await client.space.create({
        data: {
          name: parsedData.data.name,
          width: parseInt(parsedData.data.dimensions.split("x")[0]),
          height: parseInt(parsedData.data.dimensions.split("x")[1]),
          creatorId: req.userId!,
        },
      });

      res.json({ spaceId: space.id });
    }

    const map = await client.map.findUnique({
      where: {
        id: parsedData.data.mapId,
      },
      select: {
        mapelements: true,
        height: true,
        width: true,
      },
    });

    if (!map) {
      res.status(404).json({ message: "Map not found" });
      return;
    }

    let space = await client.$transaction(async () => {
      const space = await client.space.create({
        data: {
          name: parsedData.data.name,
          width: map.width,
          height: map.height,
          creatorId: req.userId!,
        },
      });

      await client.spaceElements.createMany({
        data: map.mapelements.map((element) => {
          return {
            spaceId: space.id,
            elementId: element.elementId,
            x: element.x,
            y: element.y,
          };
        }),
      });

      return space;
    });

    console.log("space created");
    res.json({ spaceId: space.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete space
spaceRouter.delete("/:spaceId", isAuthorized, async (req, res) => {
  try {
    const space = await client.space.findUnique({
      where: {
        id: req.params.spaceId,
      },
      include: {
        creator: true,
      },
    });

    if (!space) {
      res.status(404).json({ message: "Space not found" });
      return;
    }

    if (space.creatorId !== req.userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await client.space.delete({
      where: {
        id: req.params.spaceId,
      },
    });
    res.json({ message: "Space deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get user existing spaces that user has created
spaceRouter.get("/all", isAuthorized, async (req, res) => {
  try {
    const spaces = await client.space.findMany({
      where: {
        creatorId: req.userId,
      },
    });

    res.json({
      spaces: spaces.map((space) => {
        return {
          id: space.id,
          name: space.name,
          thumbnail: space.thumbnail,
          dimensions: `${space.width}x${space.height}`,
        };
      }),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//get arena space
spaceRouter.get("/:spaceId", isAuthorized, async (req, res) => {
  try {
    const space = await client.space.findUnique({
      where: {
        id: req.params.spaceId,
      },
      include: {
        spaceElements: {
          include: {
            element: true,
          },
        },
      },
    });

    if (!space) {
      res.status(404).json({ message: "Space not found" });
      return;
    }

    res.json({
      dimensions: `${space.width}x${space.height}`,
      elements: space.spaceElements.map((e) => ({
        id: e.id,
        element: {
          id: e.elementId,
          imageUrl: e.element.imageUrl,
          width: e.element.width,
          height: e.element.height,
          static: e.element.static,
        },
      })),
    });
  } catch (error) {
    console.error("Error fetching space:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//create element
spaceRouter.post("/element", isAuthorized, async (req, res) => {
  try {
    const parsedData = createElementSchema.safeParse(req.body);
    if (!parsedData.success) {
      res.status(400).json({ message: "Validation failed" });
      return;
    }
    const space = await client.space.findUnique({
      where: {
        id: req.body.spaceId,
        creatorId: req.userId,
      },
      select: {
        height: true,
        width: true,
      },
    });
    if (!space) {
      res.status(404).json({ message: "Space not found" });
      return;
    }

    if (
      req.body.x > space.width ||
      req.body.y > space.height ||
      req.body.x < 0 ||
      req.body.y < 0
    ) {
      res.status(400).json({ message: "Invalid coordinates" });
      return;
    }

    await client.spaceElements.create({
      data: {
        elementId: req.body.elementId,
        spaceId: req.body.spaceId,
        x: req.body.x,
        y: req.body.y,
      },
    });

    res.json({ message: "Element created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//delete element
spaceRouter.delete("/element", isAuthorized, async (req, res) => {
  const parsedData = DeleteElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json({ message: "Validation failed" });
    return;
  }

  try {
    const spaceElement = await client.spaceElements.findUnique({
      where: {
        id: parsedData.data.id,
      },
      include: {
        space: true,
      },
    });

    if (
      !spaceElement.space.creatorId ||
      spaceElement.space.creatorId !== req.userId
    ) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    await client.spaceElements.delete({
      where: {
        id: parsedData.data.id,
      },
    });
    res.json({ message: "Element deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
