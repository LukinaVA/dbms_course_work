const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
    `select * from people`;

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if (context.id) {
        binds.id = context.id;

        query += `\nwhere id = :id`;
    }

    const result = await database.simpleExecute(query, binds);

    return result.rows;
}

const createSql =
    `insert into people (
    first_name,
    last_name,
    father_name,
    diagnosis_id,
    ward_id
  ) values (
    :first_name,
    :last_name,
    :father_name,
    :diagnosis_id,
    :ward_id
  ) returning id
  into :id`;

async function create(p) {
    const people = Object.assign({}, p);

    people.id = {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER
    }

    const result = await database.simpleExecute(createSql, people);

    people.id = result.outBinds.id[0];

    return people;
}

const updateSql =
    `update people
  set first_name = :first_name,
    last_name = :last_name,
    father_name = :father_name,
    diagnosis_id = :diagnosis_id,
    ward_id = :ward_id
  where id = :id`;

async function update(emp) {
    const people = Object.assign({}, emp);
    const result = await database.simpleExecute(updateSql, people);

    if (result.rowsAffected && result.rowsAffected === 1) {
        return people;
    } else {
        return null;
    }
}

const deleteSql =
    `begin
  
    delete from people
    where id = :id;
 
    :rowcount := sql%rowcount;
 
    end;`

async function del(id) {
    const binds = {
        id: id,
        rowcount: {
            dir: oracledb.BIND_OUT,
            type: oracledb.NUMBER
        }
    }
    const result = await database.simpleExecute(deleteSql, binds);

    return result.outBinds.rowcount === 1;
}

module.exports = { find, create, update, del };