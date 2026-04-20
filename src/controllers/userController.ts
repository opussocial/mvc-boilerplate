import { Request, Response } from 'express';
import { executeAction, handleActionResult } from '../lib/action.ts';
import * as userActions from '../actions/userActions.ts';
import * as roleActions from '../actions/roleActions.ts';
import * as permissionActions from '../actions/permissionActions.ts';

// Users
export const getUsers = async (req: Request, res: Response) => {
  const result = await executeAction(userActions.getUsersAction, {});
  return handleActionResult(res, result);
};

export const createUser = async (req: Request, res: Response) => {
  const result = await executeAction(userActions.createUserAction, req.body);
  return handleActionResult(res, result, 201);
};

export const getUserById = async (req: Request, res: Response) => {
  const result = await executeAction(userActions.getUserByIdAction, { id: req.params.id });
  return handleActionResult(res, result);
};

export const updateUser = async (req: Request, res: Response) => {
  const result = await executeAction(userActions.updateUserAction, { id: req.params.id, ...req.body });
  return handleActionResult(res, result);
};

export const deleteUser = async (req: Request, res: Response) => {
  const result = await executeAction(userActions.deleteUserAction, { id: req.params.id });
  return handleActionResult(res, result);
};

// Roles
export const getRoles = async (req: Request, res: Response) => {
  const result = await executeAction(roleActions.getRolesAction, {});
  return handleActionResult(res, result);
};

export const createRole = async (req: Request, res: Response) => {
  const result = await executeAction(roleActions.createRoleAction, req.body);
  return handleActionResult(res, result, 201);
};

export const getRoleById = async (req: Request, res: Response) => {
  const result = await executeAction(roleActions.getRoleByIdAction, { id: req.params.id });
  return handleActionResult(res, result);
};

export const updateRole = async (req: Request, res: Response) => {
  const result = await executeAction(roleActions.updateRoleAction, { id: req.params.id, ...req.body });
  return handleActionResult(res, result);
};

export const deleteRole = async (req: Request, res: Response) => {
  const result = await executeAction(roleActions.deleteRoleAction, { id: req.params.id });
  return handleActionResult(res, result);
};

// Permissions
export const getPermissions = async (req: Request, res: Response) => {
  const result = await executeAction(permissionActions.getPermissionsAction, {});
  return handleActionResult(res, result);
};

export const createPermission = async (req: Request, res: Response) => {
  const result = await executeAction(permissionActions.createPermissionAction, req.body);
  return handleActionResult(res, result, 201);
};

export const getPermissionById = async (req: Request, res: Response) => {
  const result = await executeAction(permissionActions.getPermissionByIdAction, { id: req.params.id });
  return handleActionResult(res, result);
};

export const updatePermission = async (req: Request, res: Response) => {
  const result = await executeAction(permissionActions.updatePermissionAction, { id: req.params.id, ...req.body });
  return handleActionResult(res, result);
};

export const deletePermission = async (req: Request, res: Response) => {
  const result = await executeAction(permissionActions.deletePermissionAction, { id: req.params.id });
  return handleActionResult(res, result);
};
