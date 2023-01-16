import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import routes from './routes';
require('dotenv').config();

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

class App {
    constructor() {
        this.server = express();

        mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.jj2n0.mongodb.net/rent?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
            .then(() => {
                console.log('Conectado ao banco! 🚀');
            })
            .catch((err) => console.log(err));

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.server.use(cors());
        this.server.use(
            '/files',
            express.static(path.resolve(__dirname, '..', 'uploads'))
        );

        this.server.use(express.json());
    }

    routes() {
        this.server.use(routes);
    }
}

export default new App().server;