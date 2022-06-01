const moment = require('moment')
const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const nodemailer = require('nodemailer')
const { password } = require('pg/lib/defaults')


module.exports = app => {
    const newPassword = async (req, res) =>{
        
        const obterHash = (password, callback) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, null, (err, hash) => callback(hash))
            })
        }
        //verifica se o email e token foram informados
        if(!req.body.email || !req.body.password){
            //se não foram informados, gera erro
           return res.status(204).json({error: "Necessário informar o e-mail e senha"})
        }
        //vai verificar se existe um e-mail cadastrado
        const user = await app.dataBase('userlogin')
            .where({userLogin: req.body.email})
            .first()

        console.log(user)
        if(!user){
            // se o e-mail não estiver cadastrado ele gera erro
            return res.status(204).json({error: "Não foi possivel autenticar"})
        }
            // se houver ele vai criar a senha aleatória e salvar no banco
            var password;
            obterHash(password, hash => {
                password = hash 
                app.dataBase('userlogin')
                    .update({password: password})
                    .where({userLogin: req.body.email})
                    .catch(err => res.statu(204).json({error: "Não foi possível salvar sua senha"}))
                
                return res.status(201).json({success: "Senha salva com sucesso"})
            })
    }
    return {newPassword}
}