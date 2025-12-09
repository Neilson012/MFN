const { Time, Jogador, Tecnico } = require("../db/models")

async function renderTimes(req, res) {
    const times = await Time.findAll({
        where: { tecnico_id: req.user.id },
        include: [
            { model: Jogador, as: "jogadores" },
            { model: Tecnico, as: "tecnicos" },
        ]
    })
    res.render("times/index", { times, tecnico: req.user.nome })
}

function renderRegister(_, res) {
    res.render("times/registrar")
}

async function register(req, res) {
    const { nome, cidade } = req.body

    if (!nome || !cidade)
        return res.redirect("/times/registrar?msg=Preencha%20todos%20os%20campos")

    try {
        await Time.create({
            nome,
            cidade,
            tecnico_id: req.user.id
        })

        res.redirect("/times?msg=Time%20registrado%20com%20sucesso&status=success")
    } catch (err) {
        res.redirect("/times")
    }
}

function renderEdit(req, res) {
    Time.findByPk(req.params.id, {
        include: [
            { model: Jogador, as: "jogadores" },
            { model: Tecnico, as: "tecnicos" }
        ]
    }).then(time => {
        if (!time) return res.redirect("/times")
        console.log(time.dataValues)
        res.render("times/editar", { ...time.dataValues })
    })
}

async function edit(req, res) {
    const { nome, cidade } = req.body

    if (!nome || !cidade)
        return res.redirect(`/times/${req.params.id}/editar?msg=Preencha%20todos%20os%20campos`)

    try {
        await Time.update(
            { nome, cidade },
            { where: { id: req.params.id } }
        )
        res.redirect("/times?msg=Time%20editado%20com%20sucesso&status=success")
    } catch (err) {
        res.redirect("/times?msg=Erro%20ao%20editar%20time")
    }
}

async function remove(req, res) {
    try {
        await Time.destroy({
            where: { id: req.params.id }
        })
    } catch (err) {
        return res.redirect("/times?msg=Erro%20ao%20excluir%20time")
    }

    res.redirect("/times?msg=Time%20excluido%20com%20sucesso&status=success")
}

module.exports = { renderTimes, renderRegister, register, renderEdit, edit, remove }
