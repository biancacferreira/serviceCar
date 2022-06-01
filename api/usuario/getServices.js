const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const getServices = async(req, res) =>{
        console.log("chamou getServices")
        var token = req.headers.authorization
        // verifica se o token foi informado e se o id da empresa tbm
        if(!req.headers.authorization || !req.params.idEmpresa){
            return res.json({
                error: "Informações inválidas"
            })
        }
        // verifica o usuário através do token
        const usuario = await app.dataBase('userlogin')
            .where({token: token})
            .first()

        // se não encontrar retorna erro
        if(!usuario){
            return res.json({
                error: "Não foi possível autenticar o usuário"
            })
        }

        // busca as informações dos serviços da empresa informada
        const services = await app.dataBase('servicoscadastrados')
            .select("idservico", "idempresa", "fromday", "today", "daysservice", "service", "price", "descservice")
            .where('idempresa', req.params.idEmpresa)
    
        // busca quantos horários de cada serviço a empresa possui por dia
        const agenda = await app.dataBase('agenda')
            .count("id")
            .select("dataservico", "idservico")
            .where({idempresa: req.params.idEmpresa})
            .groupBy('dataservico', "idservico")
        
        var horariosDisponiveis;
        var horariosAgendados;
        // cria um atributo dentro de services
        services.map((item, index) =>{
            services[index]["unavailableDays"] = [];
        })
        // se constrar agendamentos, cria um for pela quantidade
        for(var i = 0; i < agenda.length; i++){
            
            var mes = agenda[i].dataservico.getMonth() + 1;
            var dia = agenda[i].dataservico.getDate();
            if(mes < 10){
                mes = "0"+mes;
            }
            if(dia < 10){
                dia = "0"+dia;
            }
            // formata a data do serviço
            var dataServico = agenda[i].dataservico.getFullYear() + '-' + mes + '-' + dia
        
            // verifica a quantidade de horarios cadastrados a empressa possui pelo serviço que foi agendado
            horariosDisponiveis = await app.dataBase("servicoscadastrados")
                .select("hoursservice")
                .where({idservico: agenda[i].idservico})

       
            var resultado = new Array()
            // substitui os caracteres errados.
    
            var re = /{/gi;
            var str = horariosDisponiveis[0].hoursservice;
            var newstr = str.replace(re, '');
            re = /}/gi;
            newstr = newstr.replace(re, '')
            re = /"/gi;
            newstr = newstr.replace(re, '')
            var horarios = newstr.split(",")

            // consulta a quantidade de horários agendados para o dia 
            horariosAgendados = await app.dataBase("agenda")
                .where({idservico: agenda[i].idservico, dataservico: dataServico})
            
            // se a quantidade de horários agendados for igual a quantidade de horas que a empresa pode trabalhar
            if(horarios.length == horariosAgendados.length){
                
                services.map((item, index) =>{
                    if(item.idservico == agenda[i].idservico){
                        console.log("entrou")
                        // retorna a data que a empresa não pode mais agendar aquele serviço
                        services[index].unavailableDays.push(dataServico)
                    }
                })
            }
        }   
        return res.json({
            services
        })
    }
    return {getServices}
}