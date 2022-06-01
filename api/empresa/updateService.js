const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')
var moment = require('moment');
moment.locale('pt-br')

module.exports = app => {
    const updateService = async(req, res) =>{
      // verifica se o token foi informado
        if(!req.headers.authorization){
            return res.json({
                error: "Token inválido"
            })
        }
        // consulta a empresa atraves do token
        var token = JSON.parse(req.headers.authorization)
        const usuario = await app.dataBase('empresalogin')
            .where({token: token})
            .first()
        // se não encontrar retorna erro
        if(!usuario){
            return res.json({
                error: "Não foi possível autenticar o usuário"
            })
        }
        //cria o array com os dias que a empresa pode trabalhar
        var arrayDias = new Array();
        for(var i = req.body.data.fromDay; i <= req.body.data.toDay; i++){
            arrayDias.push(i);
        }

        var tempo = req.body.data.time;
        var tempoDe = req.body.data.fromHour;
        var tempoPara = req.body.data.toHour;

        var arrayHoras = new Array();

        for (var i = tempoDe;  i <= tempoPara; ){
            //soma o tempo DE com o tempo do serviço
           var resultado = moment(i, 'HH:mm').add(tempo, 'hours').format('HH:mm')

           // concatena o horário inical com o horario final
            var horario = i + '-' + resultado;
            // incrementa o resultado no i
            i = resultado;

            //verifica se o resultado é maior que o tempo PARA
            if(resultado > req.body.data.toHour){
                break;
            }else{
                arrayHoras.push(horario);
            }
        }
        // update na tabela, insere todos os campos novamente
        const servico = await app.dataBase('servicoscadastrados')
            .update({fromday: req.body.data.fromDay, today: req.body.data.toDay, fromhour: req.body.data.fromHour,
            tohour: req.body.data.toHour, timeservice: req.body.data.time, descservice: req.body.data.desc, 
            service: req.body.data.service, price: req.body.data.price, daysservice: arrayDias, hoursservice: arrayHoras})
            .where({idservico: req.params.id, idempresa: usuario.idEmpresa})
            .then(success => res.status(200).json({success: "Serviço Atualizado"}))
            .catch(err => res.status(204).json({error: "Serviço não atualizado"}))
    }
    return {updateService}
}

