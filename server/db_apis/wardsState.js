const oracledb = require('oracledb');
const database = require('../services/database');

const baseQuery = `select 
    "Палата" "ward_name",
    "Число занятых мест" "occupied_num",
    "Вместимость" "capacity",
    "Диагноз" "diagnosis"
    from wardsList where 1 = 1`;

async function find() {
    let query = baseQuery;
    const binds = {};

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

module.exports = { find };