import * as express from 'express';
import * as mongodb from 'mongodb';

import { MongoHelper } from './mongo_helper';

const todoRoutes = express.Router();

const getCollection = () => {
    return MongoHelper.client.db('todo').collection('todos');
}

todoRoutes.get('/todo', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    const collection = getCollection();
    collection.find({}).toArray((err, items) => {
        if (err) {
            resp.status(500);
            resp.end();
            console.error('Caught Error', err);
        } else {
            const item2 = items.map((item => { 
                return {
                    id: item._id,
                    description: item.description
                }}));
            resp.json(item2);
        }
    })
});

todoRoutes.post('/todo', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    const descriptionvar = req.body.description;
    const collection = getCollection();
    collection.insertOne( {description: descriptionvar} );
    resp.json( {
        description: descriptionvar
    });
    resp.end();
});

todoRoutes.put('/todo/:id', (req: express.Request, resp: express.Response, next: express.NextFunction) => {
    console.info(req.body);
    console.info(req.params.id);

    const descriptionvar = req.body.description;
    const id = req.params.id;
    const collection = getCollection();

    collection.findOneAndUpdate({"_id": new mongodb.ObjectId(id)}, { $set : {"description": descriptionvar} });
    resp.json( { task: "updated", id: id, description: descriptionvar});
    resp.end();
});

todoRoutes.delete('/todo/:id', (req: express.Request, resp: express.Response, next: express.NextFunction) => {

    const id = req.params.id;
    const collection = getCollection();

    collection.deleteOne({"_id": new mongodb.ObjectId(id)});
    resp.json( {task: "deleted", id : id});
    resp.end();
});

export { todoRoutes }
