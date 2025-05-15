import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import { AppConfig } from "./config";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import healthRouter from "./routes/healthRoutes";
import { ResponseMessage } from "@repo/types";
import { httpError, logger } from "@repo/shared-utils";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRouter";

const app: Application = express();
const PORT = AppConfig.get("PORT");

// Middlewares
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/user", userRouter);
//404 Handler
app.use((req: Request, _: Response, next: NextFunction) => {
  try {
    throw new Error(ResponseMessage.NOT_FOUND);
  } catch (error) {
    httpError(next, error, req, 404);
  }
});

// Global Error Handler
app.use(globalErrorHandler);

app.listen(PORT, () => {
  logger.info("Server started successfully.", {
    meta: {
      PORT: PORT,
      SERVER_UTL: `http://localhost:${PORT}`,
    },
  });
});
