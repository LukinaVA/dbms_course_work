const express = require('express');
const router = new express.Router();

const people = require('../controllers/people.js');

router.route('/people/:id?')
    .get(people.get)
    .post(people.post)
    .put(people.put)
    .delete(people.del);

module.exports = router;