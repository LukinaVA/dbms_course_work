const oracledb = require('oracledb');
const database = require('../services/database');

const baseQuery = `select * from wards where 1 = 1`;

const sortableColumns = ['name', 'max_count'];

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

    if (context.max_count) {
        binds.max_count = context.max_count;

        query += '\nand max_count = :max_count';
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
    `insert into wards (
    name,
    max_count
  ) values (
    :name
  ) returning id
  into :id`;

async function create(w) {
    const ward = Object.assign({}, w);

    ward.id = {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER
    }

    const result = await database.simpleExecute(createSql, ward);

    ward.id = result.outBinds.id[0];

    return ward;
}

const updateSql =
    `update wards
  set name = :name,
    max_count = :max_count
  where id = :id`;

async function update(w) {
    const ward = Object.assign({}, w);
    const result = await database.simpleExecute(updateSql, ward);

    if (result.rowsAffected && result.rowsAffected === 1) {
        return ward;
    } else {
        return null;
    }
}

const deleteSql =
    `begin
  
    delete from wards
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