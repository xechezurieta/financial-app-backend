import { Account } from "../../db/schema";

export interface IAccountModel {
  getAccounts({ userId }: { userId: string }): Promise<Account[]>;
  getAccount({
    accountId,
    userId,
  }: {
    accountId: string;
    userId: string;
  }): Promise<Pick<Account, "id" | "name"> | undefined>;
  createAccount({
    userId,
    name,
  }: {
    userId: string;
    name: string;
  }): Promise<Account>;
  deleteAccounts({
    userId,
    accountIds,
  }: {
    userId: string;
    accountIds: string[];
  }): Promise<Pick<Account, "id">[]>;
  editAccountName({
    accountId,
    userId,
    name,
  }: {
    accountId: string;
    userId: string;
    name: string;
  }): Promise<Account>;
  deleteAccount({
    userId,
    accountId,
  }: {
    userId: string;
    accountId: string;
  }): Promise<Pick<Account, "id"> | undefined>;
}
