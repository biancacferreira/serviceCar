const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')
const req = require('express/lib/request')
const { password } = require('pg/lib/defaults')

module.exports = app =>{
    const signinEmpresa = async(req, res) =>{
        // verifica se cnpj e senha foram informados
        if(!req.body.cnpj || !req.body.password){
            //se não foi informado, retorna que os dados estão incompletos
            return res.status(400).send()
        }else{
            //cria uma variável 'user' para receber as informações do cnpj que foi informado
            const user = await app.dataBase('empresalogin')
                .where({empresaLogin: req.body.cnpj})
                .first()

            if(user){
                //cria uma variavel para receber as infos da empresa
                const infoEmpresa = await app.dataBase("cadempresa")
                    .where({cnpj: req.body.cnpj})
                    .first()
                
                //se o usuário foi encontrado entra no IF
                bcrypt.compare(req.body.password, user.password, (err, isMatch) =>{
                    //faz a comparação entre a senha informado e a senha criptografada do banco de dados
                    
                    if(err || !isMatch){
                        //se não forem iguais retorna erro
                        return res.status(400).send()
                    }else{
                        //se forem iguais, pega o id do usuário para criar o token
                        const payload = {id: user.id}
                        const token = jwt.encode(payload, authSecret)
                        //cadastra o token que foi gerado na tabela 'empresa login', 
                        //caso não for possível ele retorna erro
                        
                        app.dataBase('empresalogin')
                            .update({token: token})
                            .where({id: user.id})
                            .catch(err => res.status(500).json(err))

                        res.setHeader('token', token)
                        res.json(
                            {
                                token: token,
                                user: {
                                    cnpj: user.empresaLogin,
                                    nome: infoEmpresa.nomeEmpresa,
                                    id: infoEmpresa.id.toString(),
                                    email: infoEmpresa.email
                                }
                            }
                        )
                    }
                })
            }else{
                //se não houver cnpj cadastrado, retorna erro
                return res.status(400).send()
            }
        }
    }
   return {signinEmpresa}
}