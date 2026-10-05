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
    const result = await resources.addOne(req.body);
    return res.status(201).json(result);
});

app.get('/resources/:id', async (req, res) => {
    return res.json(await resources.getOne(req.params.id));
});

app.get('/resources/:id/bookings', async (req, res) => {
    return res.json(await bookings.getByResource(req.params.id));
});

app.put('/resources/:id', async (req, res) => {
    const result = await resources.updateOne(req.params.id, req.body);
    return res.json(result);
});

app.delete('/resources/:id', async (req, res) => {
    const result = await resources.deleteOne(req.params.id);
    return res.json(result);
});

// --- Bokningar ---

app.post('/bookings', async (req, res) => {
    const result = await bookings.addOne(req.body);
    return res.status(201).json(result);
});

app.get('/bookings/:id', async (req, res) => {
    return res.json(await bookings.getOne(req.params.id));
});

app.put('/bookings/:id', async (req, res) => {
    const result = await bookings.updateOne(req.params.id, req.body);
    return res.json(result);
});

app.delete('/bookings/:id', async (req, res) => {
    const result = await bookings.deleteOne(req.params.id);
    return res.json(result);
});

app.listen(port, () => {
    console.log(`Proxmox Booking app listening on port ${port}`);
});
