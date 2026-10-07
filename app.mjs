import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import resources from "./resources.mjs";
import bookings from "./bookings.mjs";

const port = process.env.PORT;
const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// --- Resurser ---

app.get('/resources', asyncHandler(async (req, res) => {
    return res.json(await resources.getAll());
}));

app.post('/resources', asyncHandler(async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Fältet name saknas' });
    }
    const result = await resources.addOne(req.body);
    return res.status(201).json(result);
}));

app.get('/resources/:id', asyncHandler(async (req, res) => {
    const resource = await resources.getOne(req.params.id);
    if (!resource.id) {
        return res.status(404).json({ error: 'Resursen hittades inte' });
    }
    return res.json(resource);
}));

app.get('/resources/:id/bookings', asyncHandler(async (req, res) => {
    const resource = await resources.getOne(req.params.id);
    if (!resource.id) {
        return res.status(404).json({ error: 'Resursen hittades inte' });
    }
    return res.json(await bookings.getByResource(req.params.id));
}));

app.put('/resources/:id', asyncHandler(async (req, res) => {
    const result = await resources.updateOne(req.params.id, req.body);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Resursen hittades inte' });
    }
    return res.json(result);
}));

app.delete('/resources/:id', asyncHandler(async (req, res) => {
    const result = await resources.deleteOne(req.params.id);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Resursen hittades inte' });
    }
    return res.status(204).end();
}));

// --- Bokningar ---

app.post('/bookings', asyncHandler(async (req, res) => {
    const { resource_id, start_time, end_time } = req.body;
    if (!resource_id || !start_time || !end_time) {
        return res.status(400).json({
            error: 'Fälten resource_id, start_time och end_time krävs'
        });
    }
    const result = await bookings.addOne(req.body);
    return res.status(201).json(result);
}));

app.get('/bookings/:id', asyncHandler(async (req, res) => {
    const booking = await bookings.getOne(req.params.id);
    if (!booking.id) {
        return res.status(404).json({ error: 'Bokningen hittades inte' });
    }
    return res.json(booking);
}));

app.put('/bookings/:id', asyncHandler(async (req, res) => {
    const result = await bookings.updateOne(req.params.id, req.body);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Bokningen hittades inte' });
    }
    return res.json(result);
}));

app.delete('/bookings/:id', asyncHandler(async (req, res) => {
    const result = await bookings.deleteOne(req.params.id);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Bokningen hittades inte' });
    }
    return res.status(204).end();
}));


app.use((req, res) => {
    res.status(404).json({ error: 'Routen finns inte' });
});

app.use((err, req, res, next) => {
    if (err.status && err.status < 500) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    return res.status(500).json({ error: 'Något gick fel på servern' });
});

app.listen(port, () => {
    console.log(`Proxmox Booking app listening on port ${port}`);
});
