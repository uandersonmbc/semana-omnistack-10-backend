const Dev = require('./../models/Devs');
const parseStringAsArray = require('./utils/parseStringAsArray');
module.exports = {
    async index(request, response) {
        const { latitude, longitude, techs, distance = 5000 } = request.query;
        const techsArray = parseStringAsArray(techs);
        const regexi = new RegExp(["^", `[${techsArray}]`, "*$"].join(""), "i");

        let search = {
            techs: {
                $regex: regexi
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: distance
                }
            }
        };
        if (!techsArray.length) {
            delete search.techs;
        }

        try {
            const devs = await Dev.find(search);
            return response.json(devs);
        } catch (error) {
            return response.status(500).json({
                message: 'Erro interno do servidor'
            })
        }
    },
}
