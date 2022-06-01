const { authSecret } = require('../.env')
const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')

module.exports = app => {

    const signinUser = async(req, res) =>{
        //verifica se email e senha foram informados
        console.log("Chamou para autenticar")
        if(!req.body.email || !req.body.password){
            //se não foi informado retorna erro de dados incompletos
            return res.status(400).send('Dados incompletos')
        }
        //consulta as informações no banco através do e-mail informado
        const user = await app.dataBase('userlogin')
            .where({userLogin: req.body.email})
            .first()
        // verifica se encontrou alguma informação no banco de dados
        if(!user){
            //se não encontrou cadastro ele retorna erro
            return res.status(400).send('E-mail não encontrado')
        }
        // caso encontre ele utiliza o id do usuário para criar o token
        const payload = {id: user.id}
        const token = jwt.encode(payload, authSecret)
        const infoUser = await app.dataBase('cadusers')
            .where({id: user.idUser})
            .first()

            //compara se as senhas são iguais
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
            //se não forem iguais ele gera erro de senha inválida
            if(err || !isMatch){
                return res.json({
                    error: "Senha inválida"
                })                     
            }
            app.dataBase('userlogin')
            .update({token: token})
            .where({id: user.id})
            .catch(err => res.json({
                error: 'Não foi possível cadastrar o token, tente novamente'
            }))

            //se for correta ele retorna o json com as informações do usuário
            res.json({
                email: user.userLogin, 
                token: token,
                nomeCompleto: infoUser.nomeCompleto,
                telefone: infoUser.telefone
            })    
           
        })     
    }
    return {signinUser}
}
 