const { Time, Jogador, Tecnico, Presidente } = require("../bdd/models")

async function renderTimes(req, res) {
    const times = await Time.findAll({
        where: { administrador_id: req.user.id },
        include: [
            { model: Jogador, as: "jogadores" },
            { model: Tecnico, as: "tecnico" },
            { model: Presidente, as: "presidente" }
        ]
    })
    res.render("times/index", { times })
}

function renderRegister(_, res) {
    res.render("times/registrar")
}

async function register(req, res) {
    const { nome, cidade, presidente, tecnico, telefone } = req.body

    if (!nome || !cidade || !presidente || !tecnico || !telefone)
        return res.redirect("/times/registrar?msg=Preencha%20todos%20os%20campos")

    try {
        const time = await Time.create({
            nome,
            cidade,
            telefone,
            administrador_id: req.user.id
        })

        await Presidente.create({
            nome: presidente,
            time_id: time.id
        })

        await Tecnico.create({
            nome: tecnico,
            time_id: time.id
        })

        res.redirect("/times?msg=Time%20registrado%20com%20sucesso&status=success")
    } catch (err) {
        res.redirect("/times?msg=Erro%20ao%20registrar%20time")
    }
}

function renderEdit(req, res) {
    Time.findByPk(req.params.id, {
        include: [
            { model: Jogador, as: "jogadores" },
            { model: Tecnico, as: "tecnico" },
            { model: Presidente, as: "presidente" }
        ]
    }).then(time => {
        if (!time) return res.redirect("/times")
        res.render("times/editar", { ...time.dataValues })
    })
}

async function edit(req, res) {
    const { nome, cidade, telefone } = req.body

    if (!nome || !cidade || !telefone)
        return res.redirect(`/times/${req.params.id}/editar?msg=Preencha%20todos%20os%20campos`)

    try {
        await Time.update(
            { nome, cidade, telefone },
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
