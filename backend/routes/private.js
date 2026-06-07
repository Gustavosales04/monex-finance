import express from 'express'
import { sql } from './connection.js'

const router = express.Router()

router.post('/criar-despesa', async (req,res) => {
    try{
        const info = req.body
        const userid = req.userId
        console.log(info)
        const despesa = await sql.query`
        INSERT INTO Despesa
        (Valor,Data,Descricao, CategoriaId,UsuarioId)
        VALUES
        (${info.valor},${info.data},${info.descricao},${info.categoriaid}, ${userid})
        `
        res.status(202).json({message: 'despesa criada com sucesso'})
    }
    catch(err){
        //Logs de Erro
        console.log(err)
        res.status(500).json({message: 'Erro ao criar categoria, tente novamente'})
    }
})

router.get('/listar-despesa', async (req,res) => {
    try{        
        const userid = req.userId
        const despesa = await sql.query`
        SELECT
        d.Id         AS id,
        d.Descricao  AS descricao,
        c.Nome       AS categoria,
        d.Valor      AS valor,
        d.Data       AS data
        FROM Despesa d
        inner join Categoria c on d.CategoriaId = c.Id
        WHERE d.UsuarioId = ${userid}
        ORDER BY d.Data DESC
        `
        res.status(202).json(despesa.recordset)
    }
    catch(err){
        //Logs de Erro
        console.log(err)
        res.status(500).json({message: 'Erro ao listar despesa, tente novamente'})
    }
})

router.get('/listar-despesa-mes', async (req,res) => {
    try{        
        const userid = req.userId
        const despesa = await sql.query`
        SELECT
        d.Id         AS id,
        d.Descricao  AS descricao,
        c.Nome       AS categoria,
        d.Valor      AS valor,
        d.Data       AS data
        FROM Despesa d
        inner join Categoria c on d.CategoriaId = c.Id
        WHERE d.UsuarioId = ${userid}
        AND MONTH(d.Data) = MONTH(GETDATE()) 
        AND YEAR(d.Data) = YEAR(GETDATE())
        ORDER BY d.Data DESC
        `
        res.status(202).json(despesa.recordset)
    }
    catch(err){
        //Logs de Erro
        console.log(err)
        res.status(500).json({message: 'Erro ao listar despesa, tente novamente'})
    }
})

router.delete('/deletar-despesa', async (req,res) => {
    try{
        const id = req.body.id
        const userid = req.userId
        const despesa = await sql.query`
        DELETE FROM Despesa
        WHERE Id = ${id} AND UsuarioId = ${userid}
        `
        res.status(202).json({message: 'Despesa deletada com sucesso'})
    }
    catch(err){
        //Logs de Erro
        console.log(err)
        res.status(500).json({message: 'Erro ao deletar despesa, tente novamente'})
    }
})

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
        const userid = req.userId

        const categoria = await sql.query`
        SELECT id, Nome as Categoria FROM Categoria
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
