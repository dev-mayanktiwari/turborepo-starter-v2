import { v6 } from "uuid";
import os from "os";
import { AppConfig } from "../config";
import dayjs from "dayjs";
import nacl from "tweetnacl";
import bs58 from "bs58";
import { CustomJwtPayload } from "@/types/tokenTypes";
import { sign } from "jsonwebtoken";

export default {
  getSystemHealth: () => {
    return {
      cpuUsage: os.loadavg(),
      totalMemory: `${(os.totalmem() / 1024 / 1024).toFixed(2)} MB`,
      freeMemory: `${(os.freemem() / 1024 / 1024).toFixed(2)} MB`,
    };
  },
  getApplicationHealth: () => {
    return {
      environment: AppConfig.get("ENV"),
      uptime: `${process.uptime().toFixed(2)} seconds`,
      memoryUsage: {
        totalHeap: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(
          2
        )} MB`,
        usedHeap: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(
          2
        )} MB`,
      },
    };
  },
  generateVerifyToken: () => {
    const token = v6();
    return token;
  },
  generateCode: (n: number) => {
    if (n <= 0) {
      return null;
    }
    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  verifyWalletAddress: async (
    publicKey: string,
    signature: string,
    message: string
  ) => {
    const signatureBytes = bs58.decode(signature);
    const publicKeyBytes = bs58.decode(publicKey);
    const messageBytes = new TextEncoder().encode(message);
    const isValid = await nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );
    return isValid;
  },
  generateExpiryTime: (minutes: number) => {
    return dayjs().add(minutes, "minutes").toISOString();
  },
  generateJWTToken: async (data: CustomJwtPayload) => {
    const token = await sign(data, String(AppConfig.get("JWT_SECRET")), {
      expiresIn: "30d",
    });
    return token;
  },
};
