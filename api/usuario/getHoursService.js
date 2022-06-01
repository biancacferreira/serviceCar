const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const getHoursService = async(req, res) =>{
        var token = req.headers.authorization
        console.log("Chamou getHour")
        
        //verifica se o token foi informado
        if(!req.headers.authorization){
            return res.json({
                error: "Informações inválidas"
            })
        }
        //busca as informações do usuário através do token
        const usuario = await app.dataBase('userlogin')
            .where({token: token})
            .first()

        //se não encontrar retorna erro
        if(!usuario){
            return res.json({
                error: "Não foi possível autenticar o usuário"
            })
        }

        //pega o id do servico informado
        var idSplit = req.params.idServico.split("=")
        
        //busca as horas que a empresa cadastrou para aquele serviço
        const horariosDisponiveis = await app.dataBase('servicoscadastrados')
            .select("hoursservice")
            .where({idservico: idSplit[1]})
        
        
        // pega a data informada
        var dataSplit = req.params.dataServico.split("=")
        //busca as horas cadastradas para o serviço e data informados
        const agenda = await app.dataBase('agenda')
            .select("horaservico")
            .where({dataservico: dataSplit[1], idservico: idSplit[1]})
        
        console.log(agenda)
        var resultado = new Array()
        // substitui os caracteres 

        var re = /{/gi;
        var str = horariosDisponiveis[0].hoursservice;
        var newstr = str.replace(re, '');
        re = /}/gi;
        newstr = newstr.replace(re, '')
        re = /"/gi;
        newstr = newstr.replace(re, '')
        var horarios = newstr.split(",")

      //for pela quantidade de agendamentos encontrados
        if(agenda.length > 0 ){
            for(var i = 0; i < agenda.length; i++){
                //retira os horarios iguais, ou seja retira todos os horários que já foram agendados
                horarios.splice(horarios.indexOf(agenda[i].horaservico), 1);
            }
            //retorna somente os horários que ainda não foram agendados
            return res.status(201).json({
                horarios
            })
        }
        // se não encontrar agendamentos retorna todos os horarios
        return res.status(201).json({
            horarios
        })
    }
    return {getHoursService}
}