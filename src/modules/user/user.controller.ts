import { Request, Response } from "express";

import httpStatus from "http-status";
import { userService } from "./user.service";

const registerUser = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const user = await userService.registerUserIntoDB(payload);

    res.status(httpStatus.CREATED).json({
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registration successful",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      message: "User registration failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const userController = {
  registerUser,
};
