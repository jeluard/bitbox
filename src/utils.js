import child_process from 'node:child_process';
import { promisify } from 'node:util';

const nodeExec = promisify(child_process.exec);

export async function exec(command) {
    const promise = nodeExec(command);
    const child = promise.child; 
    
    child.stdout.on('data', function(data) {
        console.log('stdout: ' + data);
    });
    child.stderr.on('data', function(data) {
        console.log('stderr: ' + data);
    });
    await promise;
}