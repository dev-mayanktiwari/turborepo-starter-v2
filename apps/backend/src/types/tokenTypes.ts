export interface CustomJwtPayload {
  publicKey: string;
  id: string;
  type: "user" | "admin";
}
