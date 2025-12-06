const jwt = require('jsonwebtoken');
const { Tecnico } = require("./db/models")

function verifyJWT(req, res, next){
    const token = req.cookies.auth;
    if (!token) return res.redirect("/");

    jwt.verify(token, process.env.SECRET, async (e, decoded) => {
        if (e) return res.redirect("/");
        const user = await Tecnico.findByPk(decoded?.userID)
        req.user = user?.dataValues

        next();
    });
}

function optionalJWT(req, res, next){
    const token = req.cookies.auth;
    if (!token) next();

    jwt.verify(token, process.env.SECRET, async (e, decoded) => {
        if (e) next();
        const user = await Tecnico.findByPk(decoded?.userID)
        req.user = user?.dataValues

        next();
    });
}

module.exports = { verifyJWT, optionalJWT }
