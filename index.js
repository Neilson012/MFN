const express = require("express")
const routes = require("./src/routes")
const db = require("./src/db")
const { Tecnico, Time, Jogador } = require("./src/db/models")

const path = require("path")
require("dotenv").config()

const app = express();

const PORT = 3000

app.use(require("cookie-parser")())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, 'src/views'))
app.use(express.static(path.join(__dirname, 'src/public')))

app.use('/', routes);

Tecnico.hasMany(Time, {
    foreignKey: 'tecnico_id',
    as: 'times',
});
Time.belongsTo(Tecnico, {
    foreignKey: 'tecnico_id',
    as: 'tecnico',
});
Time.hasMany(Jogador, {
    foreignKey: 'time_id',
    as: 'jogadores',
});
Jogador.belongsTo(Time, {
    foreignKey: 'time_id',
    as: 'time',
});
db.sync()

app.listen(PORT, () => {
    console.log("server on na porta", PORT)
})
