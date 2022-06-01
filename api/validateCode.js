const moment = require('moment')
module.exports = app =>{
    const validateCode = async(req, res) =>{
        // verifica se o código foi informado
        if(!req.params.code){
            return res.status(204).json({error: "Necessário informar o código"})
        }
        //consulta se há código cadastrado
        const codigo = await app.dataBase('codigo')
                    .where({codigoreset: req.params.code})

        //se não encontrar retorna erro
        if(codigo == '' || codigo == null){
            console.log("Entrou")
            return res.status(204).json({error: "Código não encontrado"})
        }
        //se  encontrar deleta o código para não ser mais usado
        const deleteCode = await app.dataBase('codigo')            
        .where({codigoreset: req.params.code})
        .del()
        // retorna que o código é valido
        return res.status(200).json({success: "Código válido"})
    }

    return {validateCode}
}