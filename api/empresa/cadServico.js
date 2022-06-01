const bcrypt = require('bcrypt-nodejs')
var moment = require('moment');
moment.locale('pt-br')
module.exports = app => {
    const saveServico = async (req, res) => {
        var token = JSON.parse(req.body.token)
        //var token = req.body.token

        // verifica se o token foi informado
        if(!req.body.token){
            return res.json({
                error: "Não foi possivel autenticar"
            })
        }
        //verficia se foi informado todos os campos
        if(!req.body.data.fromDay || !req.body.data.toDay || !req.body.data.fromHour
             || !req.body.data.toHour || !req.body.data.time
             || !req.body.data.desc || !req.body.data.service || !req.body.data.price){
            return res.json({
                error: "Informações incompletas"
            })
        }

        // consulta as info da empresa através to token
        const empresa = await app.dataBase('empresalogin')
            .where({token: token})
            .first()

        // se não encontrar empresa retorna erro
        if(!empresa){
            return res.json({
                error: "Não foi possivel encontrar os dados"
            })
        }
        
        // cria um array com todos os dias que a empresa pode trabalhar
        var arrayDias = new Array();
        for(var i = req.body.data.fromDay; i <= req.body.data.toDay; i++){
            arrayDias.push(parseInt(i));
        }
        
    
        var tempo = req.body.data.time;
        var tempoDe = req.body.data.fromHour;
        var tempoPara = req.body.data.toHour;

        var arrayHoras = new Array();

        // função para calcular todos os horários que a empresa pode trabalhar
        for (var i = tempoDe;  i <= tempoPara; ){
            //soma o tempo inicial com o tempo do serviço
           var resultado = moment(i, 'HH:mm').add(tempo, 'hours').format('HH:mm')
           // concatena o horário inical com o horario final
            var horario = i + '-' + resultado;
            // incrementa o resultado no i
            i = resultado;

            //verifica se o resultado é maior que o tempo final
            if(resultado > req.body.data.toHour){
                break;
            }else{
                arrayHoras.push(horario);
            }
        }

        // insere as informações na tabela do banco
        app.dataBase('servicoscadastrados')
        .insert({idempresa: empresa.idEmpresa, fromday: req.body.data.fromDay, today: req.body.data.toDay,
            fromhour: req.body.data.fromHour, tohour: req.body.data.toHour, timeservice: req.body.data.time,
            descservice: req.body.data.desc, service: req.body.data.service, price: req.body.data.price,
            daysservice: arrayDias, hoursservice: arrayHoras})
        .then(_ => res.status(201).send())
        .catch(err => res.status(500).json(err))


    }
    return {saveServico}
}