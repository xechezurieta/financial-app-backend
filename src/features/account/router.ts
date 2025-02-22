import { Router } from "express";
import { AccountController } from "./controller";
import { IAccountModel } from "./types";

//TODO: route management
//TODO: middleware
//TODO: types
export const createAccountRouter = ({
  accountModel,
}: {
  accountModel: IAccountModel;
}) => {
  const accountRouter = Router();

  const accountController = new AccountController({ accountModel });

  accountRouter.get("/", accountController.getAccounts);
  accountRouter.get("/:accountId", accountController.getAccount);
  accountRouter.post("/", accountController.createAccount);
  accountRouter.delete("/", accountController.deleteAccounts);
  accountRouter.delete("/:accountId", accountController.deleteAccount);
  accountRouter.patch("/:accountId", accountController.editAccountName);

  return accountRouter;
};
