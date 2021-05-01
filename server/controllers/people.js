const people = require('../db_apis/people.js');

async function get(req, res, next) {
      try {
            const context = {};

            context.id = parseInt(req.params.id, 10);
            context.skip = parseInt(req.query.skip, 10);
            context.limit = parseInt(req.query.limit, 10);

            context.sort = req.query.sort;

            context.diagnosis_id = parseInt(req.query.diagnosis_id, 10);
            context.ward_id = parseInt(req.query.ward_id, 10);

            const rows = await people.find(context);

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

function getPeopleFromRec(req) {
    return {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        father_name: req.body.father_name,
        diagnosis_id: req.body.diagnosis_id,
        ward_id: req.body.ward_id
    }
}

async function post(req, res, next) {
    try {
        res.status(201).json(people.create(getPeopleFromRec(req)));
    } catch (err) {
        next(err);
    }
}

async function put(req, res, next) {
    try {
        let person = getPeopleFromRec(req);

        person.id = parseInt(req.params.id, 10);

        person = await people.update(person);

        if (person !== null) {
            res.status(200).json(person);
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

        const success = await people.del(id);

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