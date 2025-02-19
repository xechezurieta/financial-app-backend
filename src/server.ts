import { createApp } from "./app2.js";
import { AccountModel } from "./features/account/model.js";
import { CategoryModel } from "./features/category/model.js";

createApp({ accountModel: AccountModel, categoryModel: CategoryModel });
