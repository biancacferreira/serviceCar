const moment = require('moment')
const nodemailer = require('nodemailer')

module.exports = app =>{
    const newCode = async(req, res) =>{
        console.log("Chamou generate code empresa")
        // verifica se o cnpj e token foram informados
        if(!req.body.cnpj || !req.body.email){
            //se não foi informado ele gera erro
            return res.status(204).json({error: "Necessário informar e-mail e CNPJ"})
        }

        //busca as informações do cnpj e e-mail informado
        const user = await app.dataBase('cadempresa')
            .where({email: req.body.email, cnpj: req.body.cnpj})
            .first()

        console.log(user)
        if(!user){
            //se não encontrar informações retorna erro
            return res.status(204).json({error: "Não foi possível encontrar seus dados"})
        }
        //se encontrar ele irá gerar o código aleatório
        var codigo = '';
        var number =  '0123456789';

        for(i = 0; i < 6; i++){
            
           codigo+= Math.floor(Math.random() * number.length)
        }
        //cria o transporter - e-mail que vai servir de servidor
        let transporter = nodemailer.createTransport({ 
            service: 'gmail', 
            auth: { 
                user: 'carservice1028@gmail.com', 
                pass: 'Br159753ulc@' 
                } 
        });
        //informações do e-mail
        console.log("Chegou aqui")
        const mailOptions = {
            from: 'carservice1028@gmail.com',
            to: req.body.email,
            subject: "Alteração de senha",
            html: '<p>Segue seu código para alteração de senha: '+codigo+' <p>'
        };
        
        //vai enviar o e-mail
        transporter.sendMail(mailOptions, (err, info) =>{
            //se der erro ao enviar o e-mail, gera um erro para o usuário
            if(err){
                return res.status(204).json({error: "Não foi possivel enviar o e-mail"})
            }else{
                    app.dataBase('codigo')
                        .insert({codigoreset: codigo})
                        .catch(err => res.status(204).json({error: "Não foi possivel gerar o código"}))

                return res.status(200).json({success: "Código gerado"})
               
            }
        })            
    }
    return {newCode}
}