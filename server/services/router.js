const express = require('express');
const router = new express.Router();
const employees = require('../controllers/people.js');

router.route('/people/:id?')
    .get(employees.get);

module.exports = router;