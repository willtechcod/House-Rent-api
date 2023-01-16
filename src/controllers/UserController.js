import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User';


//metodos: index, show, update, store, destroy
/*
  index: Listagem de sessoes
  store: Criar uma sessao
  show: Quando queremos lista uma única sessao
  update: Quando queremos alterar uma sessao
  destroy: Quando queremos deletar uma sessao
 */

class UserController {

    async store(req, res) {
        const { name, email, password, confirmpassword } = req.body
        if (!name) {
            return res.status(422).json({ msg: 'O nome é obrigatório!' })
        }
        if (!email) {
            return res.status(422).json({ msg: 'E-mail é obrigatório!' })
        }
        if (!password) {
            return res.status(422).json({ msg: 'A senha é obrigatória!' })
        }
        if (confirmpassword !== password) {
            return res.status(422).json({ msg: 'As senhas não combinam!' })
        }
        const userExists = await User.findOne({ email: email })
        if (userExists) {
            return res.status(422).json({ msg: 'Por favor, ultilize outro e-mail!' })
        }
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const user = new User({
            name,
            email,
            password: passwordHash,
        })
        try {
            await user.save();
            res.status(201).json({ msg: 'Usuário criado com sucesso!' })
        } catch (error) {
            console.log(error)
            res.status(500).json({ msg: 'Erro ao criar usuário, tente novamente mais tarde!' })
        }
    }
}

export default new UserController();