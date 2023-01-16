import { Router } from 'express';
import multer from 'multer';
import uploadConfig from './config/upload';

import UserController from './controllers/UserController';
import SessionController from './controllers/SessionController';
import HouseController from './controllers/HouseController';
import DashboardController from './controllers/DashboardController';
import ReserveController from './controllers/ReserveController';


const routes = new Router();
const upload = multer(uploadConfig);

routes.get('/', (req, res) => {
    return res.status(200).json({ msg: 'Rent-House API no Ar 🚀' });
});
//Rotas de usuário
routes.post('/users/auth', UserController.store);

//rota de autenticação
routes.post('/sessions', SessionController.store);

//Rotas de criar listar editar e apagar casas
routes.post('/houses', upload.single('thumbnail'), HouseController.store);
routes.get('/houses', HouseController.index);
routes.put('/houses/:house_id', upload.single('thumbnail'), HouseController.update);
routes.delete('/houses', HouseController.destroy);

//Dashboard route
routes.get('/dashboard', DashboardController.show);

//Rota de reservas
routes.post('/houses/:house_id/reserve', ReserveController.store);
routes.get('/reserves', ReserveController.index);
routes.delete('/reserves/cancel', ReserveController.destroy);

export default routes;