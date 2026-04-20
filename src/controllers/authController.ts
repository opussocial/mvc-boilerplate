import { Request, Response } from 'express';
import { executeAction, handleActionResult } from '../lib/action.ts';
import * as authActions from '../actions/authActions.ts';
import * as tokenActions from '../actions/tokenActions.ts';

export const login = async (req: Request, res: Response) => {
  const result = await executeAction(authActions.loginAction, req.body);
  return handleActionResult(res, result);
};

export const register = async (req: Request, res: Response) => {
  const result = await executeAction(authActions.registerAction, req.body);
  return handleActionResult(res, result, 201);
};

export const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(200).json({ success: true, message: 'Already logged out' });
  }
  const tokenStr = authHeader.split(' ')[1];
  const result = await executeAction(authActions.logoutAction, { tokenStr });
  return handleActionResult(res, result);
};

export const me = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const tokenStr = authHeader.split(' ')[1];
  const result = await executeAction(authActions.meAction, { tokenStr });
  return handleActionResult(res, result);
};

export const getTokens = async (req: Request, res: Response) => {
  const result = await executeAction(tokenActions.getTokensAction, {});
  return handleActionResult(res, result);
};

export const createToken = async (req: Request, res: Response) => {
  const result = await executeAction(tokenActions.createTokenAction, req.body);
  return handleActionResult(res, result, 201);
};
