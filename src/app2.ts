import express, { json } from "express"; // require -> commonJS
import { createAccountRouter } from "./features/account/router";
import "dotenv/config";
import { IAccountModel } from "./features/account/types";
import { createCategoryRouter } from "./features/category/router";
import { ICategoryModel } from "./features/category/types";
import { createTransactionRouter } from "./features/transaction/router";
import { ITransactionModel } from "./features/transaction/types";
// después
export const createApp = ({
  accountModel,
  categoryModel,
  transactionModel,
}: {
  accountModel: IAccountModel;
  categoryModel: ICategoryModel;
  transactionModel: ITransactionModel;
}) => {
  const app = express();
  app.use(json());
  app.disable("x-powered-by");

  app.use("/accounts", createAccountRouter({ accountModel }));
  app.use("/categories", createCategoryRouter({ categoryModel }));
  app.use("/transactions", createTransactionRouter({ transactionModel }));

  const PORT = process.env.PORT ?? 8080;

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });
};
