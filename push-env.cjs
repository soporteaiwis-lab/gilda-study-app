const { execSync } = require('child_process');
const fs = require('fs');

const envLocal = fs.readFileSync('.env.local', 'utf-8');
const lines = envLocal.split('\n').filter(line => line.trim() && !line.startsWith('#'));

for (const line of lines) {
  const [key, ...rest] = line.split('=');
  const value = rest.join('=');
  
  if (key && value) {
    try {
      console.log(`Adding ${key} to vercel...`);
      execSync(`npx vercel env rm ${key} production preview development -y`, { stdio: 'ignore' });
    } catch (e) {} // ignore error if it doesn't exist

    try {
      execSync(`echo ${value} | npx vercel env add ${key} production`, { stdio: 'inherit' });
      console.log(`Successfully added ${key}`);
    } catch (e) {
      console.error(`Failed to add ${key}`, e.message);
    }
  }
}
