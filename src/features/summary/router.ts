import { Router } from "express";
import { SummaryController } from "./controller";
import { ISummaryModel } from "./types";

export const createSummaryRouter = ({
  summaryModel,
}: {
  summaryModel: ISummaryModel;
}) => {
  const summaryRouter = Router();

  const summaryController = new SummaryController({ summaryModel });

  summaryRouter.get("/", summaryController.getSummaryController);

  return summaryRouter;
};
