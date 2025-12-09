const router = require("express").Router()
const { optionalJWT, verifyJWT } = require("../middlewares")
const { tecnicoController, timeController, jogadorController } = require("./controllers")
console.log(tecnicoController, timeController, jogadorController)

router
    .get("/", optionalJWT, (req, res) => {
        page = req.user ? " " : "home"
        res.render("home", { page })
    })
    .get("/login", tecnicoController.renderLogin)
    .get("/registrar", tecnicoController.renderRegister)
    .post("/login", tecnicoController.login)
    .post("/registrar", tecnicoController.register)
    .get("/logout", tecnicoController.logout)
    .get("/perfil", verifyJWT, tecnicoController.perfil)
    .get("/times", verifyJWT, timeController.renderTimes)
    .get("/times/registrar", verifyJWT, timeController.renderRegister)
    .post("/times/registrar", verifyJWT, timeController.register)
    .get("/times/:id/editar", verifyJWT, timeController.renderEdit)
    .post("/times/:id/editar", verifyJWT, timeController.edit)
    .get("/times/:id/deletar", verifyJWT, timeController.remove)
    .get("/times/:id/jogadores", verifyJWT, jogadorController.renderJogadores)
    .get("/times/:id/jogadores/registrar", verifyJWT, jogadorController.renderRegister)
    .post("/times/:id/jogadores/registrar", verifyJWT, jogadorController.register)
    .get("/jogador/:id", verifyJWT, jogadorController.find)
    .get("/jogador/:id/editar", verifyJWT, jogadorController.renderEdit)
    .post("/jogador/:id/editar", verifyJWT, jogadorController.edit)
    .get("/jogador/:id/e/:time_id/deletar", verifyJWT, jogadorController.remove)

module.exports = router
