import express from 'express'
import { sql } from './connection.js'

const router = express.Router()

router.post('/criar-categoria', async (req,res) => {
    try{
        const nome = req.body
        const userid = req.userId
        const categoria = await sql.query`
        INSERT INTO Categoria
        (Nome, UsuarioId)
        VALUES
        (${nome.name}, ${userid})
        `
        res.status(202).json({message: 'Categoria criada com sucesso'},categoria)
    }
    catch(err){
        //Logs de Erro
        console.log(err)
        res.status(500).json({message: 'Erro ao criar categoria, tente novamente'})
    }
})

router.get('/listar-categoria', async (req,res) => {
    try{
        
        const userid = req.userid

        const categoria = await sql.query`
        SELECT Nome FROM Categoria
        WHERE UsuarioId = ${userid}
        `
        res.status(202).json(categoria.recordset)
    }
    catch(err){
        //Logs de Erro
        console.log(err)
        res.status(500).json({message: 'Erro ao listar categoria, tente novamente'})
    }
})

export default router