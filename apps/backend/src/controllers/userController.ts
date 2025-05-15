import { NextFunction, Request, Response } from "express";
import { asyncErrorHandler, httpError, httpResponse } from "@repo/shared-utils";
import quicker from "../utils/quicker";
import dayjs from "dayjs";
import { ResponseMessage, StatusCodes, UserRegisterInput } from "@repo/types";
import userDbServices from "@/services/userDbServices";

export default {
  self: asyncErrorHandler(async (req: Request, res: Response) => {
    httpResponse(req, res, StatusCodes.SUCCESS.OK, "Hello World", {
      name: "Mayank Tiwari",
    });
  }),

  getNonce: asyncErrorHandler(async (req: Request, res: Response) => {
    const nonce = await quicker.generateVerifyToken();
    return httpResponse(req, res, StatusCodes.SUCCESS.OK, "Nonce generated", {
      nonce,
    });
  }),

  authCheck: asyncErrorHandler(async (req: Request, res: Response) => {
    const token = req.cookies.authToken;

    return httpResponse(req, res, StatusCodes.SUCCESS.OK, "Verified", {
      token: !!token,
    });
  }),

  register: asyncErrorHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const safeParse = UserRegisterInput.safeParse(req.body);

      if (!safeParse.success) {
        return httpError(
          next,
          new Error(ResponseMessage.BAD_REQUEST),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.BAD_REQUEST,
          safeParse.error.format()
        );
      }

      const { publicKey, signature, userType, message } = safeParse.data;

      const isUserValid = await quicker.verifyWalletAddress(
        publicKey,
        signature,
        message
      );

      // console.log("Is user valid: ", isUserValid);

      if (!isUserValid) {
        return httpError(
          next,
          new Error(ResponseMessage.UNAUTHORIZED),
          req,
          StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
        );
      }

      const user = await userDbServices.createUser(publicKey);

      const token = await quicker.generateJWTToken({
        publicKey,
        id: user.userId,
        type: userType,
      });

      const finalToken = "Bearer " + token;

      res.cookie("authToken", finalToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/api/v1/user",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });

      return httpResponse(
        req,
        res,
        StatusCodes.SUCCESS.CREATED,
        "User registered successfully",
        {
          user,
        }
      );
    }
  ),
  health: asyncErrorHandler(async (req: Request, res: Response) => {
    const healthData = {
      application: quicker.getApplicationHealth(),
      system: quicker.getSystemHealth(),
      time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
    };
    httpResponse(req, res, StatusCodes.SUCCESS.OK, "Health Check", healthData);
  }),
};
