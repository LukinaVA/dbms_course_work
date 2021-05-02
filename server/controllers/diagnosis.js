const diagnosis = require('../db_apis/diagnosis');

async function get(req, res, next) {
    try {
        const context = {};

        context.id = parseInt(req.params.id, 10);
        context.skip = parseInt(req.query.skip, 10);
        context.limit = parseInt(req.query.limit, 10);

        context.sort = req.query.sort;

        context.name = parseInt(req.query.name, 10);

        const rows = await diagnosis.find(context);

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

function getDiagnosisFromRec(req) {
    return {
        name: req.body.name
    }
}

async function post(req, res, next) {
    try {
        res.status(201).json(diagnosis.create(getDiagnosisFromRec(req)));
    } catch (err) {
        next(err);
    }
}

async function put(req, res, next) {
    try {
        let diag = getDiagnosisFromRec(req);

        diag.id = parseInt(req.params.id, 10);

        diag = await diagnosis.update(diag);

        if (diag !== null) {
            res.status(200).json(diag);
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

        const success = await diagnosis.del(id);

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