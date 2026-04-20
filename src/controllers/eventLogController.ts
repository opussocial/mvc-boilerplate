import { Request, Response } from 'express';
import { executeAction, handleActionResult } from '../lib/action.ts';
import * as eventLogActions from '../actions/eventLogActions.ts';

export const getEventLogs = async (req: Request, res: Response) => {
  const result = await executeAction(eventLogActions.getEventLogsAction, {});
  return handleActionResult(res, result);
};

export const createEventLog = async (req: Request, res: Response) => {
  const result = await executeAction(eventLogActions.createEventLogAction, req.body);
  return handleActionResult(res, result, 201);
};
