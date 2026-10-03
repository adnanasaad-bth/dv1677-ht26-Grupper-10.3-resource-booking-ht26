import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const dbName = process.env.NODE_ENV === 'test'
    ? `${process.env.DATABASE_NAME || 'jsramverk'}_test`
    : process.env.DATABASE_NAME || 'jsramverk';

const client = new MongoClient(uri);
await client.connect();

const db = client.db(dbName);

const count = await db.collection('resources').countDocuments();

if (count === 0) {
    const { insertedIds } = await db.collection('resources').insertMany([
        { name: "VM-01", type: "vm", description: "Ubuntu 24.04 – 4 vCPU, 8 GB RAM", capacity: 1 },
        { name: "VM-02", type: "vm", description: "Debian 12 – 2 vCPU, 4 GB RAM", capacity: 1 },
        { name: "GPU-server-1", type: "gpu", description: "NVIDIA T4 – för ML-arbetsbelastningar", capacity: 1 },
    ]);

    await db.collection('bookings').insertMany([
        {
            resource_id: insertedIds[0].toString(),
            user: "anna@student.bth.se",
            start_time: "2026-09-15 08:00",
            end_time: "2026-09-15 12:00",
            status: "confirmed"
        },
        {
            resource_id: insertedIds[1].toString(),
            user: "erik@student.bth.se",
            start_time: "2026-09-15 13:00",
            end_time: "2026-09-15 17:00",
            status: "confirmed"
        },
    ]);
}

// Gör om ett id från URL:en till ObjectId, eller null om det är ogiltigt
export function toObjectId(id) {
    return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

// Lägger till fältet "id" så att vyerna fungerar som med SQLite
export function withId(doc) {
    return doc ? { ...doc, id: doc._id.toString() } : {};
}

export default db;
