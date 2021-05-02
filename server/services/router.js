const express = require('express');
const router = new express.Router();

const people = require('../controllers/people.js');
const wards = require('../controllers/wards');

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

module.exports = router;