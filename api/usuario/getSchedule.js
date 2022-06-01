const bcrypt = require('bcrypt-nodejs')
const { response } = require('express')

module.exports = app => {
    const getSchedule = async(req, res) =>{
        // verifica se o token foi informado
        var token = req.headers.authorization
        if(!req.headers.authorization){
            return res.status(204).json({error: "Informações inválidas"})
        }
        // consulta o usuário através do token
        const user = await app.dataBase("userlogin")
            .where({token: token})
            .first()
        //se não encontrar retorna erro
        if(!user){
            return res.status(204).json({error: "Usuário não encontrado"})
        }
        
        //busca as informações da empresa, do serviço e do agendamento que o usuário possui
        const schedule = await app.dataBase('cadempresa')
            .join('servicoscadastrados', 'servicoscadastrados.idempresa', '=', 'cadempresa.id')
            .join('agenda', 'agenda.idservico', '=', 'servicoscadastrados.idservico')
            .select('agenda.id', 'servicoscadastrados.price', 'agenda.horaservico', 'agenda.dataservico', 
            'cadempresa.nomeEmpresa', 'agenda.statusagenda', 'servicoscadastrados.service')
            .where('agenda.idusuario', user.id)

        const cancelados = await app.dataBase('cadempresa')
            .join('servicoscadastrados', 'servicoscadastrados.idempresa', '=', 'cadempresa.id')
            .join('servicoscancelados', 'servicoscancelados.idservico', '=', 'servicoscadastrados.idservico')
            .select('servicoscancelados.id', 'servicoscadastrados.price', 'servicoscancelados.horaservico', 'servicoscancelados.dataservico', 
            'cadempresa.nomeEmpresa',  'servicoscadastrados.service')
        .where('servicoscancelados.idusuario', user.id)
        
        return res.status(200).json({
            scheduled: schedule,
            cancelados: cancelados
        })
    }
    return {getSchedule}
}
    