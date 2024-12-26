import { initializeServer } from './server-initialize.js';

try {
    initializeServer()
        .then((appInstance) => {
            appInstance.listen(8000, () => {
                console.log('Server is running...');
            });
        })
} catch (error) {
            console.error('Error starting the server:', error);
        }