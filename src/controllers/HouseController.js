import House from '../models/House';
import User from '../models/User';

class HouseController {

    async index(req, res) {
        const { status } = req.query;

        const houses = await House.find({ status });
        return res.status(200).json(houses);
    }


    async store(req, res) {
        const { filename } = req.file;
        const { description, price, location, status } = req.body;
        const { user_id } = req.headers;

        const house = await House.create({
            user: user_id,
            thumbnail: filename,
            description,
            price,
            location,
            status
        });

        return res.status(201).json(house);
    }

    async update(req, res) {
        const { filename } = req.file;
        const { house_id } = req.params;
        const { description, price, location, status } = req.body;
        const { user_id } = req.headers;

        const user = await User.findById(user_id);
        const houses = await House.findById(house_id);

        if (String(user._id) !== String(houses.user)) {
            return res.status(401).json({ error: 'Não autorizado, você não pode editar casas de outro usuário!' })
        }

        await House.updateOne({ _id: house_id }, {
            user: user_id,
            thumbnail: filename,
            description,
            price,
            location,
            status,
        })
        try {

            return res.status(200).json({ msg: 'Casa editada com sucesso!' })

        } catch (error) {

            console.log(error);
            return res.status(500).json({ msg: 'Erro ao atualizar Casa, tente novamente mais tarde!' })
        }
    }

    async destroy(req, res) {
        const { house_id } = req.body;
        const { user_id } = req.headers;

        const user = await User.findById(user_id);
        const houses = await House.findById(house_id);

        if (String(user._id) !== String(houses.user)) {
            return res.status(401).json({ error: 'Não autorizado, você não pode apagar casas de outro usuário!' })
        }

        await House.findByIdAndDelete({ _id: house_id });

        return res.status(200).json({ msg: 'Casa Excluida com sucesso!' })
    }
}

export default new HouseController();