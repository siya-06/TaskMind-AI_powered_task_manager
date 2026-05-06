import express from 'express';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import authroutes from './routes/authroutes.js';
import todoroutes from './routes/todoroutes.js';
import authmiddleware from './middleware/authmiddleware.js';
import aiRoutes from "./routes/airoutes.js";


const app = express();

const PORT = process.env.PORT || 5003;

// get file path from url of current module
const __filename = fileURLToPath(import.meta.url);

// get the directory name from the file path
const __dirname = dirname(__filename);


app.use(express.json());

// serve static files from /public
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static("public"));



// serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// auth routes
app.use('/auth', authroutes);

// todo routes (protected)
app.use('/todos', authmiddleware, todoroutes);


app.use("/api/ai", authmiddleware, aiRoutes);


app.listen(PORT, () => {
    console.log(`server has started on ${PORT}`);
});