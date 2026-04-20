import { Request, Response } from 'express';
import { executeAction, handleActionResult } from '../lib/action.ts';
import * as configActions from '../actions/configActions.ts';
import * as featureSwitchActions from '../actions/featureSwitchActions.ts';

// Config
export const getConfig = async (req: Request, res: Response) => {
  const result = await executeAction(configActions.getConfigAction, {});
  return handleActionResult(res, result);
};

export const updateConfig = async (req: Request, res: Response) => {
  const result = await executeAction(configActions.updateConfigAction, req.body);
  return handleActionResult(res, result);
};

// Feature Switches
export const getFeatureSwitches = async (req: Request, res: Response) => {
  const result = await executeAction(featureSwitchActions.getFeatureSwitchesAction, {});
  return handleActionResult(res, result);
};

export const updateFeatureSwitch = async (req: Request, res: Response) => {
  const result = await executeAction(featureSwitchActions.updateFeatureSwitchAction, req.body);
  return handleActionResult(res, result);
};
