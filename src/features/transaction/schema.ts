import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { accountsTable } from "../account/schema";
import { categoriesTable } from "../category/schema";
import { relations } from "drizzle-orm";

export const transactionsTable = pgTable("transactions", {
  id: text("id").primaryKey(),
  amount: integer("amount").notNull(),
  payee: text("payee").notNull(),
  notes: text("notes"),
  date: timestamp("date", { mode: "date" }).notNull(),
  accountId: text("account_id")
    .references(() => accountsTable.id, {
      onDelete: "cascade",
    })
    .notNull(),
  categoryId: text("category_id").references(() => categoriesTable.id, {
    onDelete: "set null",
  }),
});

export type Transaction = typeof transactionsTable.$inferSelect;

export const transactionsRelations = relations(
  transactionsTable,
  ({ one }) => ({
    account: one(accountsTable, {
      fields: [transactionsTable.accountId],
      references: [accountsTable.id],
    }),
    categories: one(categoriesTable, {
      fields: [transactionsTable.categoryId],
      references: [categoriesTable.id],
    }),
  })
);
