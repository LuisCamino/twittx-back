const connection = require('./database/connection');
const express = require('express')
const cors = require('cors');

console.log('Starting server...');

connection();

// crear servidor node 

const app = express();
const PORT = 3900;

// configuracion CORS

app.use(cors());

// convertir los datos del body en JSON

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// cargar rutas

app.get('/', (req, res) => {
    return res.status(200).json({
        message: 'Welcome to Twittx API'
    });
})

const userRoutes = require('./routes/user');
const followRoutes = require('./routes/follow');
const publicationRoutes = require('./routes/publication');

app.use('/api/user', userRoutes);
app.use('/api/publication', publicationRoutes);
app.use('/api/follow', followRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
})