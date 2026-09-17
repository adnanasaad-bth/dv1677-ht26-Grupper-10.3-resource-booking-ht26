import db from './db/database.mjs';

const bookings = {
    getByResource: async function getByResource(resourceId) {
        return db.prepare(
            'SELECT * FROM bookings WHERE resource_id = ? ORDER BY start_time'
        ).all(resourceId);
    },
    getOne: async function getOne(id) {
        return db.prepare('SELECT * FROM bookings WHERE id = ?').get(id) || {};
    },
    addOne: async function addOne(body) {
        const result = db.prepare(
            'INSERT INTO bookings (resource_id, user, start_time, end_time, status) VALUES (?, ?, ?, ?, ?)'
        ).run(body.resource_id, body.user, body.start_time, body.end_time, 'confirmed');
        return { lastID: result.lastInsertRowid };
    },
    updateOne: async function updateOne(id, body) {
        const result = db.prepare(
            'UPDATE bookings SET user = ?, start_time = ?, end_time = ?, status = ? WHERE id = ?'
        ).run(body.user, body.start_time, body.end_time, body.status, id);
        return { changes: result.changes };
    },
    deleteOne: async function deleteOne(id) {
        const result = db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
        return { changes: result.changes };
    }
};

export default bookings;
