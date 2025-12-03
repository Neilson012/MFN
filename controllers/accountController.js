const jwt = require('jsonwebtoken');
const { Membro } = require("../db/models");
const bcrypt = require("bcrypt");

function renderLogin(_, res) {
    res.render("login");
}

function renderRegister(_, res) {
    res.render("registrar");
}

async function login(req, res) {
    const { email, senha } = req.body;
    const membro = await Membro.findOne({ where: { email } });

    if (!membro) {
        return res.redirect("/login?msg=Usu%C3%A1rio%20n%C3%A3o%20encontrado");
    }

    const correctPassword = await bcrypt.compare(senha, membro.senha);
    if (!correctPassword) {
        return res.redirect("/login?msg=Senha%20incorreta");
    }

    const token = jwt.sign({ membroID: membro.id }, process.env.SECRET, { expiresIn: "1h" });

    res.cookie('auth', token, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 3600000
    });

    res.redirect("/perfil");
}

async function register(req, res) {
    const { nome, email, senha, confirmarSenha, tipoMembro } = req.body;

    if (!nome || !email || !senha || !confirmarSenha || !tipoMembro) {
        return res.redirect("/registrar?msg=Preencha%20todos%20os%20campos");
    }

    // Agora só aceitamos jogador, tecnico ou time
    const tiposValidos = ["jogador", "tecnico", "time"];
    if (!tiposValidos.includes(tipoMembro)) {
        return res.redirect("/registrar?msg=Tipo%20inv%C3%A1lido");
    }
    
    if (senha !== confirmarSenha) {
        return res.redirect("/registrar?msg=As%20senhas%20não%20conferem");
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);

        const membro = await Membro.create({ 
            nome, 
            email, 
            senha: hashedPassword, 
            tipoMembro  // agora contém "jogador", "tecnico" ou "time"
        });

        const token = jwt.sign({ membroID: membro.id }, process.env.SECRET, { expiresIn: "1h" });

        res.cookie('auth', token, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 3600000
        });

        res.redirect("/perfil");
    } catch (err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.redirect("/registrar?msg=Esse%20email%20j%C3%A1%20est%C3%A1%20em%20uso");
        }
        res.redirect("/");
    }
}

function logout(_, res) {
    res.clearCookie("auth");
    res.redirect("/?msg=Desconectado&status=success");
}

function perfil(req, res) {
    res.render("perfil", { ...req.user });
}

module.exports = { renderLogin, renderRegister, login, register, logout, perfil };
