import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User';
require('dotenv').config();

class SessionController {
    async store(req, res) {
        const { email, password } = req.body
        if (!email) {
            return res.status(422).json({ msg: 'O e-mail é obrigatório!' })
        }
        if (!password) {
            return res.status(422).json({ msg: 'a senha é obrigatória!' })
        }

        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado!' })
        }

        const checkPassword = await bcrypt.compare(password, user.password);

        if (!checkPassword) {
            return res.status(422).json({ msg: 'E-mail/ou a senha incorretos!' })
        }

        try {
            const secret = process.env.SECRET
            const token = jwt.sign(
                {
                    id: user._id,
                }, secret,
            )
            res.status(200).json({
                msg: 'Autenticação realizada com sucesso', token
            })

        } catch (error) {
            console.log(error);

            res.status(500).json({
                msg: 'Erro ao fazer login, tente novamente mais tarde!'
            })
        }
    }
}

export default new SessionController();