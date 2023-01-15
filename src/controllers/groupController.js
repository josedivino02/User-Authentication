const GroupModel = require("../models/Group")

const groupController = {
//-------------------------------------------------------------------------------------------------------------------------------------------- 
    create: async (req, res) => {

        const { abv, description } = req.body

        if (!abv) {
            return res.status(422).json({ msg: "Nome obrigatório" })
        }

        if (!description) {
            return res.status(422).json({ msg: "descrição obrigatório" })
        }

        const groupExists = await GroupModel.findOne({ abv: abv })

        if (groupExists) {
            return res.status(422).json({ msg: "Esse grupo já existe" })
        }

        const response = new GroupModel({
            abv, description
        })

        try {

            response.save()

            res.status(201).json({ msg: `Registro ${abv} cadastrado com sucesso!` })
        } catch (error) {
            return res.status(500).json({ msg: "Erro ao cadastrar o registro" })   
        }
    },
//-------------------------------------------------------------------------------------------------------------------------------------------- 
    getAll: async (req, res) => {
        
        try {
            
            const group = await GroupModel.find()

            res.json(group)
        } catch (error) {

            return res.status(404).json({ msg: "Resgistro não encontrado!" })
        }
    },
//-------------------------------------------------------------------------------------------------------------------------------------------- 
    delete: async (req, res) => {

        try {
            
            const id = req.params.id

            const deleteGroup = await GroupModel.findByIdAndDelete(id)

            if (!deleteGroup) {
                return res.status(404).json({ msg: "Registro não encontrado!" })
            }

            res.status(200).json({ deleteGroup, msg: "Registro excluído com sucesso!" })

        } catch (error) {
            return res.status(500).json({ msg: "Erro ao excluír" })
        }
    },
//-------------------------------------------------------------------------------------------------------------------------------------------- 
    update: async (req, res) => {

        try {
            
            const id = req.params.id

            const response = {
                abv, description
            } = req.body

            const groupExists = await GroupModel.findOne({ abv: abv })

            if (groupExists) {
                return res.status(422).json({ msg: "Esse grupo já existe" })
            }

            const updateGroup = await GroupModel.findByIdAndUpdate(id, response)

            if (!updateGroup) {
                return res.status(400).json({ msg: "Registro não encontrado!" })
            }

            res.status(200).json({ updateGroup, msg: "Registro atualizado com sucesso!" })

        } catch (error) {
            return res.status(500).json({ msg: "Erro ao atualizar" })
        }
    }
}

module.exports = groupController