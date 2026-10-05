import 'dotenv/config';
import express from 'express';
import path from 'path';
import morgan from 'morgan';
import cors from 'cors';
import methodOverride from 'method-override';
import resources from "./resources.mjs";
import bookings from "./bookings.mjs";

const port = process.env.PORT;
const app = express();

app.disable('x-powered-by');
app.set("view engine", "ejs");
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        const method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
app.use(cors());

if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}

// --- Resurser ---

app.get('/resources', async (req, res) => {
    return res.json(await resources.getAll());
});

app.post('/resources', async (req, res) => {
    if (!req.body.name) {
        return res.status(400).json({ error: 'Fältet name saknas' });
    }
    const result = await resources.addOne(req.body);
    return res.status(201).json(result);
});

app.get('/resources/:id', async (req, res) => {
    const resource = await resources.getOne(req.params.id);
    if (!resource.id) {
        return res.status(404).json({ error: 'Resursen hittades inte' });
    }
    return res.json(resource);
});

app.get('/resources/:id/bookings', async (req, res) => {
    const resource = await resources.getOne(req.params.id);
    if (!resource.id) {
        return res.status(404).json({ error: 'Resursen hittades inte' });
    }
    return res.json(await bookings.getByResource(req.params.id));
});

app.put('/resources/:id', async (req, res) => {
    const result = await resources.updateOne(req.params.id, req.body);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Resursen hittades inte' });
    }
    return res.json(result);
});

app.delete('/resources/:id', async (req, res) => {
    const result = await resources.deleteOne(req.params.id);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Resursen hittades inte' });
    }
    return res.status(204).end();
});

// --- Bokningar ---

app.post('/bookings', async (req, res) => {
    const { resource_id, start_time, end_time } = req.body;
    if (!resource_id || !start_time || !end_time) {
        return res.status(400).json({
            error: 'Fälten resource_id, start_time och end_time krävs'
        });
    }
    const result = await bookings.addOne(req.body);
    return res.status(201).json(result);
});

app.get('/bookings/:id', async (req, res) => {
    const booking = await bookings.getOne(req.params.id);
    if (!booking.id) {
        return res.status(404).json({ error: 'Bokningen hittades inte' });
    }
    return res.json(booking);
});

app.put('/bookings/:id', async (req, res) => {
    const result = await bookings.updateOne(req.params.id, req.body);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Bokningen hittades inte' });
    }
    return res.json(result);
});

app.delete('/bookings/:id', async (req, res) => {
    const result = await bookings.deleteOne(req.params.id);
    if (result.changes === 0) {
        return res.status(404).json({ error: 'Bokningen hittades inte' });
    }
    return res.status(204).end();
});

app.listen(port, () => {
    console.log(`Proxmox Booking app listening on port ${port}`);
});
