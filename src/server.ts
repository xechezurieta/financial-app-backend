import { createApp } from "./app2.js";
import { AccountModel } from "./features/account/model.js";
import { CategoryModel } from "./features/category/model.js";
import { SummaryModel } from "./features/summary/model.js";
import { TransactionModel } from "./features/transaction/model.js";

createApp({
  accountModel: AccountModel,
  categoryModel: CategoryModel,
  transactionModel: TransactionModel,
  summaryModel: SummaryModel,
});
