const moment = require('moment')
const nodemailer = require('nodemailer')

module.exports = app =>{
    const newCode = async(req, res) =>{
        console.log("Chamou generateCode user")
        // verifica se o email foi informado
        if(!req.body.email){
            return res.status(204).json({ error: "Necessário informar o e-mail"})
        }
        //consulta o usuario atraves do email
        const user = await app.dataBase('userlogin')
            .where({userLogin: req.body.email})
            .first()

        // se não encontrar retorna erro
        if(!user){
            return res.status(204).json({error: "Usuário não encontrado"})
        }
        // cria o código
        var codigo = '';
        var number =  '0123456789';

        for(i = 0; i < 6; i++){
            
           codigo+= Math.floor(Math.random() * number.length)
        }
        //configura o servidor
        let transporter = nodemailer.createTransport({ 
            service: 'gmail', 
            auth: { 
                user: 'carservice1028@gmail.com', 
                pass: 'Br159753ulc@' 
                } 
        });
        //informações do e-mail
        const mailOptions = {
            from: 'carservice1028@gmail.com',
            to: req.body.email,
            subject: "Alteração de senha",
            html: '<p>Segue seu código para alteração de senha: '+codigo+' <p>'
        };

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