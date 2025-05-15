import { AppConfig } from "@/config";
import { AuthenticatedRequest } from "@/types/expressRequest";
import { CustomJwtPayload } from "@/types/tokenTypes";
import { httpError } from "@repo/shared-utils";
import { ResponseMessage, StatusCodes } from "@repo/types";
import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.authToken;
  const request = req as AuthenticatedRequest;
  if (!token || !token.startsWith("Bearer ")) {
    return httpError(
      next,
      new Error(ResponseMessage.UNAUTHORIZED),
      req,
      StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
    );
  }

  const tokenValue = token.split(" ")[1];

  if (!tokenValue) {
    return httpError(
      next,
      new Error(ResponseMessage.UNAUTHORIZED),
      req,
      StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
    );
  }

  try {
    const decodedToken = verify(
      tokenValue,
      String(AppConfig.get("JWT_SECRET"))
    ) as CustomJwtPayload;
    request.publicKey = decodedToken.publicKey;
    request.id = decodedToken.id;
    request.type = decodedToken.type;
    
    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return httpError(
        next,
        new Error("Invalid token."),
        req,
        StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
      );
    }

    if (error instanceof TokenExpiredError) {
      return httpError(
        next,
        new Error("Token expired."),
        req,
        StatusCodes.ERROR.CLIENT_ERROR.UNAUTHORIZED
      );
    }

    return next(error);
  }
};

export default authMiddleware;
