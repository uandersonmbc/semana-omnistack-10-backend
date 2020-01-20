const axios = require('axios');
const Dev = require('./../models/Devs');
const parseStringAsArray = require('./utils/parseStringAsArray');
module.exports = {
    async index(request, response) {
        try {
            const devs = await Dev.find();
            return response.json({
                devs,
            });
        } catch (error) {
            return response.status(500).json({
                message: 'Erro interno do servidor'
            })
        }
    },
    async store(request, response) {
        const { github_username, techs, latitude, longitude, password } = request.body;
        const dev = await Dev.findOne({
            github_username
        })
        if (dev) {
            return response.status(401).json({
                message: 'Usuário já cadastrado'
            })
        }

        try {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            try {
                const { name = longi, avatar_url, bio } = apiResponse.data;
                const location = {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                }
                const techsArray = parseStringAsArray(techs)
                const dev = await Dev.create({
                    location,
                    name,
                    avatar_url,
                    bio,
                    password,
                    github_username,
                    techs: techsArray
                });
                return response.json({
                    dev,
                    token: dev.generateToken()
                })
            } catch (error) {
                return response.json({
                    message: 'Erro interno do servidor'
                })
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return response.status(404).json({
                    message: 'Usuário não encontrado no GitHub'
                })
            }
            return response.status(500).json({
                message: 'Erro interno do servidor'
            })
        }

    },

    async update(request, response) {
        const { name, techs } = request.body
        const userId = request.userId;
        const dev = await Dev.findById(userId)
        if (!(name && techs)) {
            return response.status(400).json({
                message: 'Bad request'
            })
        }
        try {
            dev.name = name;
            dev.techs = parseStringAsArray(techs);
            await dev.save()
            return response.json({
                dev
            })
        } catch (error) {
            return response.status(500).json({
                message: 'Error'
            })
        }
    },
    async delete(request, response) {
        const userId = request.userId;
        const dev = await Dev.findById(userId)
        try {
            await dev.remove();
            return response.json({
                dev,
                message: 'Deletado com sucesso'
            })
        } catch (error) {
            return response.status(500).json({
                message: 'Houve um erro ao deletar'
            })
        }
    },
}
