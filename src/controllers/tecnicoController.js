const jwt = require('jsonwebtoken');
const { Tecnico } = require("../db/models");
const bcrypt = require("bcrypt");

function renderLogin(_, res) {
    res.render("login");
}

function renderRegister(_, res) {
    res.render("registrar");
}

async function login(req, res) {
    const { email, senha } = req.body;
    const tecnico = await Tecnico.findOne({ where: { email } });

    if (!tecnico) {
        return res.redirect("/login?msg=Usu%C3%A1rio%20n%C3%A3o%20encontrado");
    }

    const correctPassword = await bcrypt.compare(senha, tecnico.senha);
    if (!correctPassword) {
        return res.redirect("/login?msg=Senha%20incorreta");
    }

    const token = jwt.sign({ tecnicoID: tecnico.id }, process.env.SECRET, { expiresIn: "1h" });

    res.cookie('auth', token, {
        httpOnly: true,
        sameSite: 'Strict',
        maxAge: 3600000
    });

    res.redirect("/perfil");
}

async function register(req, res) {
    const { nome, email, senha, confirmarSenha } = req.body;

    if (!nome || !email || !senha || !confirmarSenha) {
        return res.redirect("/registrar?msg=Preencha%20todos%20os%20campos");
    }
    
    if (senha !== confirmarSenha) {
        return res.redirect("/registrar?msg=As%20senhas%20não%20conferem");
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10);

        const tecnico = await Tecnico.create({ 
            nome, 
            email, 
            senha: hashedPassword, 
        });

        const token = jwt.sign({ tecnicoID: tecnico.id }, process.env.SECRET, { expiresIn: "1h" });

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
    console.log(req.user)
    res.render("perfil", { ...req.user });
}

module.exports = { renderLogin, renderRegister, login, register, logout, perfil };
