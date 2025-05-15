import dotenv from "dotenv";
dotenv.config();

type ConfigKeys = "PORT" | "ENV" | "JWT_SECRET";

const _config: Record<ConfigKeys, string | undefined> = {
  PORT: process.env.PORT,
  ENV: process.env.ENV,
  JWT_SECRET: process.env.JWT_SECRET,
};

export const AppConfig = {
  get(key: ConfigKeys): string | number {
    const value = _config[key];
    if (value === undefined) {
      process.exit(1);
    }

    return key === "PORT" ? Number(value) : value;
  },
};
