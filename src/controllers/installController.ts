import { Request, Response } from 'express';
import { executeAction, handleActionResult } from '../lib/action.ts';
import * as installActions from '../actions/installActions.ts';

export const install = async (req: Request, res: Response) => {
  const result = await executeAction(installActions.installAction, {});
  return handleActionResult(res, result);
};

export const getStatus = async (req: Request, res: Response) => {
  const result = await executeAction(installActions.getStatusAction, {});
  return handleActionResult(res, result);
};
