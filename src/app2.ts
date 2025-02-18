import express, { json } from "express"; // require -> commonJS
import { createAccountRouter } from "./features/account/router";
import "dotenv/config";
// después
export const createApp = ({ accountModel }: { accountModel: any }) => {
  const app = express();
  app.use(json());
  app.disable("x-powered-by");

  app.use("/accounts", createAccountRouter({ accountModel }));

  const PORT = process.env.PORT ?? 8080;

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};
