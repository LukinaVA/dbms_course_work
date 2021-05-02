const oracledb = require('oracledb');
const database = require('../services/database.js');

const baseQuery =
    `select 
    id "id",
    name "name"
    from diagnosis where 1 = 1`;

const sortableColumns = ['id', 'name'];

async function find(context) {
    let query = baseQuery;
    const binds = {};

    if (context.id) {
        binds.id = context.id;

        query += '\nand id = :id';
    }

    if (context.name) {
        binds.name = context.name;

        query += '\nand name = :name';
    }

    if (context.sort === undefined) {
        query += '\norder by name asc';
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
    `insert into diagnosis (
    name
  ) values (
    :name
  ) returning id
  into :id`;

async function create(p) {
    const diagnosis = Object.assign({}, p);

    diagnosis.id = {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER
    }

    const result = await database.simpleExecute(createSql, diagnosis);

    diagnosis.id = result.outBinds.id[0];

    return diagnosis;
}

const updateSql =
    `update diagnosis
  set name = :name
  where id = :id`;

async function update(emp) {
    const diagnosis = Object.assign({}, emp);
    const result = await database.simpleExecute(updateSql, diagnosis);

    if (result.rowsAffected && result.rowsAffected === 1) {
        return diagnosis;
    } else {
        return null;
    }
}

const deleteSql =
    `begin
  
    delete from diagnosis
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