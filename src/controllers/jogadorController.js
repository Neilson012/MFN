const { Time, Jogador } = require("../db/models")

async function renderJogadores(req, res) {
    const time = await Time.findByPk(req.params.id, {
        include: [{ model: Jogador, as: "jogadores" }],
        attributes: ["id", "nome"]
    })
    res.render("jogadores/index", { jogadores: time.jogadores, time: time.nome, time_id: time.id })
}

function renderRegister(req, res) {
    res.render("jogadores/registrar", { time_id: req.params.id })
}

async function register(req, res) {
    const paginaJogadores = `/times/${req.params.id}/jogadores`
    const { nome, numero_camisa, email, cpf } = req.body
    console.log(req.body)
    if (!nome || !numero_camisa || !email || !cpf) return res.redirect(paginaJogadores)

    try {
        await Jogador.create({ nome, numero_camisa, email, cpf, time_id: req.params.id })
        res.redirect(paginaJogadores + "?msg=Jogador%20registrado%20com%20sucesso&status=success")
    } catch (err) {
        res.redirect(paginaJogadores + "?msg=Erro%20ao%20registrar%20jogador")
    }
}

function find(req, res) {
    Jogador.findByPk(req.params.id)
        .then((jogador) => {
            if (!jogador) return res.redirect("/times?msg=Jogador%20não%20encontrado")
            res.render("jogadores/dados", { ...jogador.dataValues })
        })
}

function renderEdit(req, res) {
    Jogador.findByPk(req.params.id)
        .then((jogador) => {
            if (!jogador) return res.redirect("/times?msg=Jogador%20não%20encontrado")
            res.render("jogadores/editar", { ...jogador.dataValues })
        })
}

async function edit(req, res) {
    const { nome, numero_camisa, email } = req.body
    if (!nome || !numero_camisa || !email)
        return res.redirect(`/jogador/${req.params.id}/editar?msg=Preencha%20todos%20os%20campos`)

    try {
        await Jogador.update(
            { nome, numero_camisa, email },
            { where: { id: req.params.id } }
        )
        res.redirect(`/times?msg=Jogador%20editado%20com%20sucesso&status=success`)
    } catch (err) {
        res.redirect("/times?msg=Erro%20ao%20editar%20jogador")
    }
}

async function remove(req, res) {
    try {
        await Jogador.destroy({
            where: { id: req.params.id }
        })
    } catch (err) {
        return res.redirect(`/times/${req.params.time_id}/jogadores?msg=Erro%20ao%20excluir%20jogador`)
    }
    res.redirect(`/times/${req.params.time_id}/jogadores?msg=Jogador%20excluido%20com%20sucesso&status=success`)
}

module.exports = { renderJogadores, renderRegister, register, find, renderEdit, edit, remove }
