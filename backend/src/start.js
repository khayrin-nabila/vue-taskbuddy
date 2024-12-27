import { initializeServer } from './server-initialize.js';

try {
    initializeServer()
        .then((appInstance) => {
            appInstance.listen(8000, () => {
                // eslint-disable-next-line no-console
                console.log('Server is running...');
            });
        })
} catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error starting the server:', error);
        }