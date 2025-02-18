import { Router } from "express";
import { AccountController } from "./controller";

//TODO: route management
//TODO: middleware
//TODO: types
export const createAccountRouter = ({
  accountModel,
}: {
  accountModel: any;
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
