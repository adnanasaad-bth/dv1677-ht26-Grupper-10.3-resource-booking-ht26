import db, { toObjectId, withId } from './db/database.mjs';

const collection = db.collection('resources');

const resources = {
    getAll: async function getAll() {
        const docs = await collection.find().toArray();
        return docs.map(withId);
    },
    getOne: async function getOne(id) {
        const _id = toObjectId(id);
        if (!_id) {
            return {};
        }
        return withId(await collection.findOne({ _id }));
    },
    addOne: async function addOne(body) {
        const result = await collection.insertOne({
            name: body.name,
            type: body.type,
            description: body.description,
            capacity: parseInt(body.capacity) || 1
        });
        return { lastID: result.insertedId.toString() };
    },
    updateOne: async function updateOne(id, body) {
        const _id = toObjectId(id);
        if (!_id) {
            return { changes: 0 };
        }
        const result = await collection.updateOne({ _id }, {
            $set: {
                name: body.name,
                type: body.type,
                description: body.description,
                capacity: parseInt(body.capacity) || 1
            }
        });
        return { changes: result.matchedCount };
    },
    deleteOne: async function deleteOne(id) {
        const _id = toObjectId(id);
        if (!_id) {
            return { changes: 0 };
        }
        const result = await collection.deleteOne({ _id });
        return { changes: result.deletedCount };
    }
};

export default resources;
