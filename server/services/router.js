const express = require('express');
const router = new express.Router();

const people = require('../controllers/people');
const wards = require('../controllers/wards');
const diagnosis = require('../controllers/diagnosis');

router.route('/people/:id?')
    .get(people.get)
    .post(people.post)
    .put(people.put)
    .delete(people.del);

router.route('/wards/:id?')
    .get(wards.get)
    .post(wards.post)
    .put(wards.put)
    .delete(wards.del);

router.route('/diagnosis/:id?')
    .get(diagnosis.get)
    .post(diagnosis.post)
    .put(diagnosis.put)
    .delete(diagnosis.del);

module.exports = router;