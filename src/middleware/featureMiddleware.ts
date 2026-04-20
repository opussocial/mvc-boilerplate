import { Request, Response, NextFunction } from 'express';
import db from '../db.ts';

/**
 * Middleware to check if the system is already installed.
 * If installed, blocks access to the /install route.
 */
export const checkInstallation = (req: Request, res: Response, next: NextFunction) => {
  try {
    const installed = db.prepare("SELECT is_enabled FROM feature_switches WHERE name = 'system_installed'").get() as any;
    
    const isInstallPath = req.path === '/install' || req.originalUrl === '/api/install';

    if (installed?.is_enabled === 1) {
      if (isInstallPath) {
        return res.status(403).json({ 
          error: 'System already installed', 
          redirect: '/login' 
        });
      }
    } else {
      // If not installed and trying to access anything but install, force install
      if (!isInstallPath && req.path.startsWith('/api') && req.path !== '/api/debug/db') {
         // Optionally allow debug
         return res.status(403).json({ 
           error: 'Maintenance: Installation Required', 
           redirect: '/install' 
         });
      }
    }
    next();
  } catch (err) {
    next();
  }
};

/**
 * Middleware to require a specific feature switch to be enabled.
 */
export const requireFeature = (featureName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const feature = db.prepare("SELECT is_enabled FROM feature_switches WHERE name = ?").get(featureName) as any;
      if (!feature || feature.is_enabled !== 1) {
        return res.status(403).json({ error: `Feature '${featureName}' is disabled` });
      }
      next();
    } catch (err) {
      res.status(500).json({ error: 'Feature check failed' });
    }
  };
};
