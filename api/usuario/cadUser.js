const bcrypt = require('bcrypt-nodejs')
const { password } = require('pg/lib/defaults')

module.exports = app => {
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const saveUser =  async (req, res) => {        
        // verifica se as informações de email, password, name e telefone foram informados
        if(!req.body.email || !req.body.password || !req.body.name || !req.body.phone){
                //se estiverem em branco retorna erro
                return res.json({
                    error: "Dados em branco"
                })
        }else{
            // se não, ele consulta se o email informado já está cadastrado
            const verificaUser = await app.dataBase('cadusers')
            .where({email: req.body.email})
            .first()
            
            if(verificaUser){
                // se o email já estiver cadastrado ele gera erro
                return res.json({
                    error: 'E-mail já cadastrado'
                })
            }else{
                //se não houver e-mail cadastrado ele irá salvar as informações.
                app.dataBase('cadusers')
                    .insert({nomeCompleto: req.body.name, email: req.body.email, telefone: req.body.phone})
                    .catch(err => res.json({
                        error: 'Não foi possível cadastrar'
                    }))
                //irá pegar o id do usuário recem cadastrado
                const idUser = await app.dataBase('cadusers').where({email: req.body.email}).first()
                // vai cadastrar se encontrar o usuário
                if(idUser){
                    obterHash(req.body.password, hash => {
                        //criptografa a senha e salva na tabela de login do usuário
                        const password = hash                         
                        app.dataBase('userlogin')
                            .insert({userLogin: req.body.email, password: password, idUser: idUser.id})
                            .then(_ => res.status(204).json(success))
                            .catch(err => res.status(400).json(err))
                    })
                
                }
            }
        }
    }
    return {saveUser}
}