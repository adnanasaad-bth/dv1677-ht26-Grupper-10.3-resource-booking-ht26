import db, { toObjectId, withId } from './db/database.mjs';

const collection = db.collection('bookings');

const bookings = {
    getByResource: async function getByResource(resourceId) {
        const docs = await collection
            .find({ resource_id: resourceId })
            .sort({ start_time: 1 })
            .toArray();
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
            resource_id: body.resource_id,
            user: body.user,
            start_time: body.start_time,
            end_time: body.end_time,
            status: 'confirmed'
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
                user: body.user,
                start_time: body.start_time,
                end_time: body.end_time,
                status: body.status
            }
        });
        return { changes: result.modifiedCount };
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

export default bookings;
