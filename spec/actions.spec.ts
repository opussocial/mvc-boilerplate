import db, { initDb } from '../src/db.ts';
import * as authActions from '../src/actions/authActions.ts';
import * as userActions from '../src/actions/userActions.ts';
import * as roleActions from '../src/actions/roleActions.ts';
import * as permissionActions from '../src/actions/permissionActions.ts';
import * as installActions from '../src/actions/installActions.ts';
import * as configActions from '../src/actions/configActions.ts';
import * as featureSwitchActions from '../src/actions/featureSwitchActions.ts';
import * as eventLogActions from '../src/actions/eventLogActions.ts';
import * as tokenActions from '../src/actions/tokenActions.ts';

describe('Actions Unit Tests', () => {
  beforeAll(() => {
    initDb();
  });

  describe('Installation Actions', () => {
    it('should install the system successfully', async () => {
      const result = await installActions.installAction();
      expect(result.token).toBeDefined();
      expect(result.user).toBeDefined();
      
      const status = await installActions.getStatusAction();
      expect(status.installed).toBe(true);
    });
  });

  describe('Role Actions', () => {
    let roleId: number;

    it('should create a role', async () => {
      const role = await roleActions.createRoleAction({ name: 'Editor', code: 'EDITOR' }) as any;
      expect(role.name).toBe('Editor');
      expect(role.code).toBe('EDITOR');
      roleId = role.id;
    });

    it('should get all roles', async () => {
      const roles: any = await roleActions.getRolesAction();
      expect(roles.length).toBeGreaterThan(0);
    });

    it('should update a role', async () => {
      const updated = await roleActions.updateRoleAction({ id: roleId, name: 'Senior Editor' }) as any;
      expect(updated.name).toBe('Senior Editor');
    });

    it('should delete a role', async () => {
      const res = await roleActions.deleteRoleAction({ id: roleId });
      expect(res.message).toBeDefined();
      
      try {
        await roleActions.getRoleByIdAction({ id: roleId });
        fail('Should have been rejected');
      } catch (err: any) {
        expect(err.status).toBe(404);
      }
    });

    it('should fail to update non-existing role', async () => {
      try {
        await roleActions.updateRoleAction({ id: 9999, name: 'Ghost' });
        fail('Should have thrown');
      } catch (err: any) {
        expect(err.status).toBe(404);
      }
    });
  });

  describe('Permission Actions', () => {
    let permId: number;

    it('should create a permission', async () => {
      const perm = await permissionActions.createPermissionAction({ name: 'Publish', code: 'publish' }) as any;
      expect(perm.code).toBe('publish');
      permId = perm.id;
    });

    it('should get all permissions', async () => {
      const perms: any = await permissionActions.getPermissionsAction();
      expect(perms.length).toBeGreaterThan(0);
    });

    it('should update a permission', async () => {
      const updated = await permissionActions.updatePermissionAction({ id: permId, name: 'Quick Publish' }) as any;
      expect(updated.name).toBe('Quick Publish');
    });

    it('should delete a permission', async () => {
      await permissionActions.deletePermissionAction({ id: permId });
      try {
        await permissionActions.getPermissionByIdAction({ id: permId });
        fail('Should have failed');
      } catch (err: any) {
        expect(err.status).toBe(404);
      }
    });
  });

  describe('User Actions', () => {
    let userId: number;
    let roleId: number;

    beforeAll(async () => {
      const role = await roleActions.createRoleAction({ name: 'UserRole', code: 'USER_ROLE' }) as any;
      roleId = role.id;
    });

    it('should create a user', async () => {
      const user = await userActions.createUserAction({ 
        name: 'Jane Doe', 
        email: 'jane@example.com',
        role_id: roleId
      }) as any;
      expect(user.email).toBe('jane@example.com');
      userId = user.id;
    });

    it('should get all users', async () => {
      const users: any = await userActions.getUsersAction();
      expect(users.length).toBeGreaterThan(0);
    });

    it('should update a user', async () => {
      const updated = await userActions.updateUserAction({ id: userId, name: 'Jane Updated' }) as any;
      expect(updated.name).toBe('Jane Updated');
    });

    it('should delete a user', async () => {
      await userActions.deleteUserAction({ id: userId });
      try {
        await userActions.getUserByIdAction({ id: userId });
        fail('Should have been rejected');
      } catch (err: any) {
        expect(err.status).toBe(404);
      }
    });
  });

  describe('Auth Actions', () => {
    it('should register a new user', async () => {
      const result = await authActions.registerAction({
        name: 'Auth User', 
        email: 'auth@example.com',
        password: 'password123'
      }) as any;
      expect(result.user.email).toBe('auth@example.com');
      expect(result.token).toBeDefined();
    });

    it('should login an existing user', async () => {
      const result = await authActions.loginAction({
        email: 'auth@example.com',
        password: 'password123'
      }) as any;
      expect(result.token).toBeDefined();
    });

    it('should fail login with wrong password', async () => {
      try {
        await authActions.loginAction({
          email: 'auth@example.com',
          password: 'wrong'
        });
        fail('Should have been rejected');
      } catch (err: any) {
        expect(err.status).toBe(401);
      }
    });

    it('should logout', async () => {
      const loginRes = await authActions.loginAction({
        email: 'auth@example.com',
        password: 'password123'
      }) as any;
      const res = await authActions.logoutAction({ tokenStr: loginRes.token });
      expect(res.success).toBe(true);
    });

    it('should get current user info (me)', async () => {
      const loginRes = await authActions.loginAction({
        email: 'auth@example.com',
        password: 'password123'
      }) as any;
      const res = await authActions.meAction({ tokenStr: loginRes.token }) as any;
      expect(res.email).toBe('auth@example.com');
    });
  });

  describe('Config & Feature Switch Actions', () => {
    it('should set and get config', async () => {
      await configActions.updateConfigAction({ key: 'site_name', value: 'My App' });
      const config: any = await configActions.getConfigAction();
      const entry = config.find((c: any) => c.key === 'site_name');
      expect(entry.value).toBe('My App');
    });

    it('should update feature switch', async () => {
      await featureSwitchActions.updateFeatureSwitchAction({ name: 'maintenance_mode', is_enabled: true });
      const switches: any = await featureSwitchActions.getFeatureSwitchesAction();
      const sw = switches.find((s: any) => s.name === 'maintenance_mode');
      expect(sw.is_enabled).toBe(1);
    });
  });

  describe('Event Log Actions', () => {
    it('should create and get event logs', async () => {
      await eventLogActions.createEventLogAction({ event_type: 'TEST_EVENT', message: 'Hello World' });
      const logs: any = await eventLogActions.getEventLogsAction();
      expect(logs.length).toBeGreaterThan(0);
      const testEvent = logs.find((l: any) => l.event_type === 'TEST_EVENT');
      expect(testEvent).toBeDefined();
      expect(testEvent.message).toBe('Hello World');
    });
  });

  describe('Token Actions', () => {
    it('should create and list tokens', async () => {
      // Find a user first
      const users: any = await userActions.getUsersAction();
      const userId = users[0].id;
      
      await tokenActions.createTokenAction({ user_id: userId, token: 'manual_token', type: 'API' });
      const tokens: any = await tokenActions.getTokensAction();
      const t = tokens.find((tk: any) => tk.token === 'manual_token');
      expect(t).toBeDefined();
      expect(t.user_email).toBeDefined();
    });
  });
});
