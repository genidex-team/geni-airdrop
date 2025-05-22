
const { spawn } = require('child_process');

class Shell {

    run(scriptPath, args = []) {
        return new Promise((resolve, reject) => {
            const child = spawn(scriptPath, args, {
                shell: true,
                stdio: 'inherit',
            });

            child.on('error', (err) => {
                reject(err);
            });

            child.on('close', (code) => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`Process exited with code ${code}`));
                }
            });
        });
    }

}

module.exports = new Shell();