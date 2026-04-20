import { Router } from 'express';
import * as userController from '../controllers/userController.ts';
import * as configController from '../controllers/configController.ts';
import * as eventLogController from '../controllers/eventLogController.ts';
import * as installController from '../controllers/installController.ts';
import * as authController from '../controllers/authController.ts';
import db from '../db.ts';

const router = Router();

// Debug
router.get('/debug/db', (req, res) => {
  try {
    const result = db.prepare('SELECT 1 as connected').get();
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const userColumns = db.prepare("PRAGMA table_info(users)").all();
    res.json({ connected: true, result, tables, userColumns });
  } catch (err: any) {
    res.status(500).json({ connected: false, error: err.message });
  }
});

// Users
router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Config
router.get('/config', configController.getConfig);
router.post('/config', configController.updateConfig);

// Feature Switches
router.get('/feature-switches', configController.getFeatureSwitches);
router.post('/feature-switches', configController.updateFeatureSwitch);

// Event Logs
router.get('/event-logs', eventLogController.getEventLogs);
router.post('/event-logs', eventLogController.createEventLog);

// Roles
router.get('/roles', userController.getRoles);
router.post('/roles', userController.createRole);
router.get('/roles/:id', userController.getRoleById);
router.put('/roles/:id', userController.updateRole);
router.delete('/roles/:id', userController.deleteRole);

// Permissions
router.get('/permissions', userController.getPermissions);
router.post('/permissions', userController.createPermission);
router.get('/permissions/:id', userController.getPermissionById);
router.put('/permissions/:id', userController.updatePermission);
router.delete('/permissions/:id', userController.deletePermission);

// System
router.post('/install', installController.install);
router.get('/system/status', installController.getStatus);

// Auth & Tokens
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.get('/auth/me', authController.me);
router.get('/tokens', authController.getTokens);
router.post('/tokens', authController.createToken);

export default router;
