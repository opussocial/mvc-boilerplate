import { installAction, getStatusAction } from '../actions/installActions.ts';
import { initDb } from '../db.ts';

async function runCliInstaller() {
  const args = process.argv.slice(2);
  const emailArg = args.find(a => a.startsWith('--email='));
  const passwordArg = args.find(a => a.startsWith('--password='));

  const email = emailArg ? emailArg.split('=')[1] : undefined;
  const password = passwordArg ? passwordArg.split('=')[1] : undefined;

  console.log('--- MVC System CLI Installer ---');
  
  try {
    initDb();
    
    const status = getStatusAction();
    if (status.installed) {
      console.log('System is already installed. Use the web interface or manual DB commands to manage users.');
      process.exit(0);
    }

    console.log(`Starting installation${email ? ` for ${email}` : ''}...`);
    const result = installAction({ email, password });

    if (result.success) {
      console.log('--------------------------------');
      console.log('INSTALLATION SUCCESSFUL');
      console.log(`Admin Email: ${(result.user as any).email}`);
      console.log(`Initial Token: ${result.token}`);
      console.log('--------------------------------');
    } else {
      console.error('Installation failed.');
      process.exit(1);
    }
  } catch (error) {
    console.error('An error occurred during installation:');
    console.error(error);
    process.exit(1);
  }
}

runCliInstaller();
