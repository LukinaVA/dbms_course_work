const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
    `select 
    id "id",
    first_name "first_name",
    last_name "last_name",
    father_name "father_name",
    diagnosis_id "diagnosis_id",
    ward_id "ward_id"
    from people where 1 = 1`;

const sortableColumns = ['id', 'last_name'];

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if (context.id) {
        binds.id = context.id;

        query += '\nand id = :id';
    }

    if (context.diagnosis_id) {
        binds.diagnosis_id = context.diagnosis_id;

        query += '\nand diagnosis_id = :diagnosis_id';
    }

    if (context.ward_id) {
        binds.ward_id = context.ward_id;

        query += '\nand ward_id = :ward_id';
    }

    if (context.sort === undefined) {
        query += '\norder by last_name asc';
    } else {
        let [column, order] = context.sort.split(':');

        if (!sortableColumns.includes(column)) {
            throw new Error('Invalid "sort" column');
        }

        if (order === undefined) {
            order = 'asc';
        }

        if (order !== 'asc' && order !== 'desc') {
            throw new Error('Invalid "sort" order');
        }

        query += `\norder by ${column} ${order}`;
    }

    if (context.skip) {
        binds.row_offset = context.skip;

        query += '\noffset :row_offset rows';
    }

    binds.row_limit = (context.limit > 0) ? context.limit : 30;

    query += '\nfetch next :row_limit rows only';

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