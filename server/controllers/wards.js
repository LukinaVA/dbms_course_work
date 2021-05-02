const wards = require('../db_apis/wards');

async function get(req, res, next) {
    try {
        const context = {};

        context.id = parseInt(req.params.id, 10);
        context.skip = parseInt(req.query.skip, 10);
        context.limit = parseInt(req.query.limit, 10);

        context.sort = req.query.sort;

        context.name = parseInt(req.query.name, 10);
        context.max_count = parseInt(req.query.max_count, 10);

        const rows = await wards.find(context);

        if (req.params.id) {
            if (rows.length === 1) {
                res.status(200).json(rows[0]);
            } else {
                res.status(404).end();
            }
        } else {
            res.status(200).json(rows);
        }
    } catch (err) {
        next(err);
    }
}

function getWardFromRec(req) {
    return {
        name: req.body.name,
        max_count: req.body.max_count
    }
}

async function post(req, res, next) {
    try {
        res.status(201).json(wards.create(getWardFromRec(req)));
    } catch (err) {
        next(err);
    }
}

async function put(req, res, next) {
    try {
        let ward = getWardFromRec(req);

        ward.id = parseInt(req.params.id, 10);

        ward = await wards.update(ward);

        if (ward !== null) {
            res.status(200).json(ward);
        } else {
            res.status(404).end();
        }
    } catch (err) {
        next(err);
    }
}

async function del(req, res, next) {
    try {
        const id = parseInt(req.params.id, 10);

        const success = await wards.del(id);

        if (success) {
            res.status(204).end();
        } else {
            res.status(404).end();
        }
    } catch (err) {
        next(err);
    }
}

module.exports = { get, post, put, del };