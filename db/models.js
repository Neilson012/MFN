const { Sequelize } = require("sequelize")
const db = require("./index")

const Tecnico = db.define('Tecnico', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
    },
    senha: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, { tableName: 'tecnicos' })

const Time = db.define('Time', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    tecnico: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    cidade: {
        type: Sequelize.STRING,
        allowNull: true,
    },
}, { tableName: 'times' })

const Jogador = db.define('Jogador', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nome: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    numero_camisa: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
}, { tableName: 'jogadores' })

module.exports = { Tecnico, Time, Jogador }
