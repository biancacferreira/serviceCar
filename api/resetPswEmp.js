const moment = require('moment')
const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const { password } = require('pg/lib/defaults')


module.exports = app => {
    const newPassword = async (req, res) =>{

        const obterHash = (password, callback) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, null, (err, hash) => callback(hash))
            })
        }
        // verifica se o cnpj e senha foram informados
        if(!req.body.cnpj || !req.body.password){
            return res.status(204).json({error: 'Erro ao validar'})
        }

        //consulta a empresa através do cnpj
        const empresa = await app.dataBase('empresalogin')
            .where({empresaLogin: req.body.cnpj})
            .first()

        // se não encontrar retorna erro
        if(!empresa){
            return res.status(204).json({error: "Não foi possivel autenticar"})
        }

        var password;     
        obterHash(password, hash => {
            console.log(hash)
            password = hash 
            //criptografa a senha e salva no banco
            app.dataBase('empresalogin')
                .update({password: password})
                .where({empresaLogin: empresa.empresaLogin})
                .catch(err => res.status(204).json({error: "Não foi possivel salvar sua senha"}))
                
           
        })
        return res.status(201).json({success: "Senha alterada"})
    }

    return {newPassword}
}
