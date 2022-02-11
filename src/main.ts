import { app } from './app';
import * as http from 'http';
import { MongoHelper } from './mongo_helper';

const PORT = 4000;
const server = http.createServer(app);
server.listen(PORT);
server.on('listening', async () => {
    console.info(`Listening on port ${PORT}`)
    try {
        await MongoHelper.connect('mongodb://127.0.0.1:27017');
        console.info('Connected to Mongo');
    } catch (err) {
        console.error(err);
    }
});

