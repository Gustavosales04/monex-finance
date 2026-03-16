import express from 'express'
import bcrypt from 'bcrypt'
import { sql } from './connection.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET

// Cadastro
router.post('/cadastro', async (req, res) => {
    try{
        //Salva as informações do 'req' na variavel 'user'
        const user = req.body
        //Incryptação de Senha
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password,salt)

        //Insere o Usuário no banco de dados
        const result = await sql.query`
        INSERT INTO Usuario(Nome, Email, Senha)
        VALUES (${user.name},${user.email},${hashPassword})
        `
        //Temp(Devolve as informações do Usuario)
        res.status(201).json(result)
    }
    catch(err){
        //Logs de Erro
        console.log(err)
        res.status(500).json({message:'Erro ao tentar cadastrar, tente novamente'})
    }
})

//Login
router.post("/login", async (req,res) =>{
    try{
        //Salva as informações do 'req' na variavel 'userinfo'
        const userinfo = req.body

        //Busca informações do Usuário no banco
        const user = await sql.query`
        SELECT * FROM Usuario
        WHERE Email = ${userinfo.email}
        `

        //Verifica se o Usuário existe
        if(user.recordset.length === 0){
            return res.status(400).json({massage: 'Usuário não encontrato'})
        }

        //Verifica se a Senha está correta
        const passwordismatch = await bcrypt.compare(userinfo.password, user.recordset[0].Senha)
        if(!passwordismatch){
            res.status(400).json({message: 'Senha incorreta'})
        }

        //Gerar token
        const token = jwt.sign({id: user.recordset[0].Id}, JWT_SECRET, {expiresIn: '1d'})

        //Devolve as informações do token do Usuário
        res.status(202).json(token)
    }
    catch(err){
        //Logs de Erro
        console.log(err)
        res.status(500).json({message:'Erro ao logar no servidor, tente novamente'})
    }
})

export default router 