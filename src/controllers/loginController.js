require('dotenv').config()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserModel = require("../models/User")

const loginController = {
 //--------------------------------------------------------------------------------------------------------------------------------------------   
    login: async (req, res) => {

        const { email, cpf, password } = req.body

        if (!email || !cpf) {
            return res.status(422).json({ msg: "O Email ou CPF é obrigatório" })
        }

        if (!password) {
            return res.status(422).json({ msg: "Senha é obrigatoria" })
        }

        const user = await UserModel.findOne({ email: email, cpf: cpf })

        if (!user) {
            return res.status(404).json({ msg: "CPF, Email ou Senha inválidos!" })
        }

        const checkPass = await bcrypt.compare(password, user.password)
        
        if (!checkPass) {
            return res.status(422).json({ msg: "CPF, Email ou Senha inválidos!" })
        }

        try {
            
            const secret = process.env.SECRET
            const token = jwt.sign({ id: user._id }, secret, { expiresIn: "1 day" })

            res.status(200).json({ msg: "Autenticação realizada com sucesso", token })

        } catch (error) {
            console.log(error)

            return res.status(500).json({ msg: "Erro no Servidor, Tente novamente mais tarte!" })
        }
    }
}

module.exports =  loginController

