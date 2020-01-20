const { Router } = require('express');
const authMiddleware = require("./middlewares");

const DevController = require('./../app/controllers/DevController');
const SearchController = require('./../app/controllers/SearchController');
const AuthController = require('./../app/controllers/AuthController');

const routers = Router();

routers.get('/devs', DevController.index);
routers.post('/devs', DevController.store);

routers.get('/search', SearchController.index);

routers.post('/login', AuthController.login);

routers.use(authMiddleware);

routers.get('/user', AuthController.user);

routers.put('/devs', DevController.update);
routers.delete('/devs', DevController.delete);

module.exports = routers;
