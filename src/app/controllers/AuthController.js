const Dev = require('./../models/Devs');

module.exports = {
    async login(request, response) {
        try {
            const { github_username, password } = request.body;

            const dev = await Dev.findOne({ github_username });
            if (!dev) {
                return response.status(401).json({ message: "Usuário não encontrado" });
            }

            if (!(await dev.compareHash(password))) {
                return response.status(401).json({ message: "Senha invalida" });
            }

            dev.password = undefined
            return response.json({
                dev,
                token: dev.generateToken(),
                message: 'Você foi logado com sucesso.'
            });
        } catch (err) {
            console.log(err)
            return response.status(401).json({ message: "Falha na autenticação" });
        }
    },

    async user(request, response) {
        try {
            const { userId } = request;

            const dev = await Dev.findById(userId, {
                name: 1,
                techs: 1,
                location: 1,
                bio: 1,
                github_username: 1,
                avatar_url: 1
            });

            return response.json(dev);
        } catch (err) {
            return response.status(400).json({
                message: "Não é possível obter informações do usuário"
            });
        }
    },
}
