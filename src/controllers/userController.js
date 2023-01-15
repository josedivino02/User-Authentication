require('dotenv').config()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const UserModel = require("../models/User")
const GroupModel = require("../models/Group")

const emailRegex = /\S+@\S+\.\S+/ 
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

const userController = {
//--------------------------------------------------------------------------------------------------------------------------------------------
    create: async (req, res) => {

        const { name, email, cpf, birthDate, password, confirmPassword } = req.body

        if (!name) {
            return res.status(422).json({ msg: "O nome é obrigatório" })
        }

        if (!email) {
            return res.status(422).json({ msg: "O email é obrigatório" })
        }

        if(!email.match(emailRegex)) {
            return res.status(400).json({ msg: "Email inválido" })
        }

        if (!cpf) {
            return res.status(422).json({ msg: "O CPF é obrigatório" })
        }

        if (!birthDate) {
            return res.status(422).json({ msg: "O Data de nascimento é obrigatório" })
        }

        if (!password) {
            return res.status(422).json({ msg: "O Senha é obrigatório" })
        }

        if (!password.match(passwordRegex)) {
            return res.status(400).json({ msg: "Senha precisa conter: letra maiúscula, minúscula, pelo menos um número e um caracter especial e tamanho entre 6 a 20." })
        }
        
        if (password !== confirmPassword) {
            return res.status(422).json({ msg: "Senha não conferem" })
        }

        const userExistsEmail = await UserModel.findOne({ email: email })

        if (userExistsEmail) {
            return res.status(422).json({ msg: "Email já cadastrado!" })
        }

        const userExistsCpf = await UserModel.findOne({ cpf: cpf })

        if (userExistsCpf) {
            return res.status(422).json({ msg: "CPF já cadastrado!" })
        }

        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        const response = new UserModel({
            name,
            email,
            cpf,
            birthDate,
            password: passwordHash
        })

        try {
            
            await response.save()

            res.status(201).json({ response, msg: "Registro criado com sucesso!" })

        } catch (error) {
            console.log(error)

            return res.status(500).json({ msg: "Erro ao criar o registro!" })
        }
    },
//--------------------------------------------------------------------------------------------------------------------------------------------
    getAll: async (req, res) => {

        try {
            
            const users = await UserModel.find()

            res.json(users)
        } catch (error) {
            
            return res.status(404).json({ msg: "Registro não encontrado!" })
        }
    },
//--------------------------------------------------------------------------------------------------------------------------------------------
    getOne: async (req, res) => {

        try {
            const id = req.params.id

            const user = await UserModel.findById(id, "-password")

            if (!user) {
                return res.status(404).json({ msg: `Registro (${id}) não encontrado!` })
            }

            res.status(200).json({ user, msg: `Registro (${id}) encontrado com sucesso!` })
        } catch (error) {

            return res.status(404).json({ msg: "Erro no Servidor!" })   
        }
    },
//--------------------------------------------------------------------------------------------------------------------------------------------
    delete: async (req, res) => {
        
        try {
            const id = req.params.id

            const user = UserModel.findById(id)

            if (!user) {
                return res.status(404).json({ msg: `Registro (${id}) não encontrado` })
            }

            const deletedUser = await UserModel.findByIdAndDelete(id)

            if (!deletedUser) {
                return res.status(404).json({ msg: `Registro (${id}) não encontrado` })
            }
            
            res.status(200).json({ deletedUser, msg: `Registro excluído com sucesso!` })
        } catch (error) {
            
            return res.status(404).json({ msg: "Erro no Servidor!" })
        }
    },
//--------------------------------------------------------------------------------------------------------------------------------------------
    update: async (req, res) =>  {

        try {
            
            const id = req.params.id

            const user = await UserModel.findOne({ _id: id })

            const response = {
                name,
                email,
                cpf, 
                birthDate
            } = req.body

            if(!response.email.match(emailRegex)) {
                return res.status(400).json({ msg: "Email inválido" })
            }

            if (user.email !== response.email) {
                const userExistsEmail = await UserModel.findOne({ email: response.email })

                if (userExistsEmail) {
                    return res.status(422).json({ msg: "Email já cadastrado!" })
                }
            }
    
            if (user.cpf !== response.cpf) {
                const userExistsCpf = await UserModel.findOne({ cpf: response.cpf })
    
                if (userExistsCpf) {
                    return res.status(422).json({ msg: "CPF já cadastrado!" })
                }
            }

            const upadatedUser = await UserModel.findByIdAndUpdate(id, response)

            if (!upadatedUser) {
                return res.status(400).json({ msg: "Registro não encontrado!" })
            }

            res.status(200).json({ upadatedUser, msg: "Registro atualizado com sucesso!" })
        } catch (error) {
            
            return res.status(404).json({ msg: "Registro não atualizado!" })
        }
    },
    //--------------------------------------------------------------------------------------------------------------------------------------------
    updatePassword: async (req, res) =>  {

        try {
            
            const id = req.params.id

            const response = {
                password,
                confirmPassword
            } = req.body

            if (response.password !== response.confirmPassword) {
                return res.status(422).json({ msg: "Senha não conferem" })
            }

            if (!response.password.match(passwordRegex)) {
                return res.status(400).json({ msg: "Senha precisa conter: letra maiúscula, minúscula, pelo menos um número e um caracter especial e tamanho entre 6 a 20." })
            }

            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(response.password, salt)

            response.password = passwordHash

            const upadatedUser = await UserModel.findByIdAndUpdate(id, response)

            if (!upadatedUser) {
                return res.status(400).json({ msg: "Registro não encontrado!" })
            }

            res.status(200).json({ upadatedUser, msg: "Registro atualizado com sucesso!" })
        } catch (error) {
            
            return res.status(404).json({ msg: "Registro não atualizado!" })
        }
    },
//--------------------------------------------------------------------------------------------------------------------------------------------
    includeGroup: async (req, res) => {

        try {
            const id = req.params.id

            const { group } = req.body

            const user = await UserModel.findById(id) 

            if (!user) {
                return res.status(404).json({ msg: `Registro ${id} não encontrado` })
            }
            
            const groupId = await GroupModel.findById(group)
            if (!groupId) {
                return res.status(404).json({ msg: `Grupo não encontrado` })
            }

            const includeGroupId = await UserModel.updateOne({ "_id": user._id }, {$set:{ "group": group }})

            res.status(200).json({ includeGroupId, msg: "Grupo adicionado ao Usuário com sucesso!" })
        } catch (error) {
            return res.status(500).json({ msg: "Erro ao incluir" })
        }
    }
}

module.exports =  userController

