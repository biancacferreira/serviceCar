const bcrypt = require('bcrypt-nodejs')
const { password } = require('pg/lib/defaults')

module.exports = app =>{
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash))
        })
    }

    const saveEmpresa = async (req, res) => {
        //verifica se cnpj, email, password foram informados
        if(!req.body.cnpj || !req.body.email || !req.body.password){
            //se não foi informado ele retorna erro de dados em branco
            return res.status(400).send("CNPJ, email ou senha inválidos")            
        }else{
            //consulta no banco se o cnpj informado já está cadastrado
            const verificarEmpresa = await app.dataBase('empresalogin')
                .where({empresaLogin: req.body.cnpj})
                .first()
            if(verificarEmpresa){
                //se o cnpj já estiver cadastrado ele gera erro
                return res.status(204).json({error : "CNPJ já cadastrado"})
            }else{
                //se não estiver cadastrado ele insere na tabela as informações da empresa
               const cadastro = await  app.dataBase('cadempresa')
                    .insert({nomeEmpresa: req.body.name, cnpj: req.body.cnpj, 
                        telefone: req.body.phone, cidade: req.body.city, rua: req.body.street,
                        email: req.body.email, especialidade: req.body.specialty, bairro:  req.body.district
                    })
                    .catch(err => res.status(500).json(err))
                
                
                //consulta as informações do usuário que foi cadastrado
                const idCadastrado =await app.dataBase('cadempresa')
                    .where({cnpj: req.body.cnpj})
                    .first()
                
                
                if(idCadastrado){
                    //se houver informação
                    obterHash(req.body.password, hash =>{
                        // vai criptografar a senha e salvar na tabela de login
                        const password = hash
                        app.dataBase('empresalogin')
                            .insert({empresaLogin: req.body.cnpj, password: password, idEmpresa: idCadastrado.id})
                            .then(_ => res.status(201).send())
                            .catch(err => res.status(500).json(err))
                            
                    })
                }
            }
        }
    }
    return {saveEmpresa}
}