import { spawn } from 'child_process';
const T = process.argv[2];
const loop = () => {
  const p = spawn('node', ['dom_fix_value.mjs', T], { cwd: 'D:/Code/knowledge-base/gsc-mock', stdio: 'ignore' });
  p.on('close', () => {});
};
loop();
setInterval(loop, 3000);
