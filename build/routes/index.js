const express = require('express');

const router = express.Router();

const pool = require('../database');

router.get('/', (req, res) => {
    res.render('layouts/principal');
});
router.get('/personero', async(req, res) => {
    // const datos = await pool.query('select * from candidatos');
    // console.log(datos);
    res.render('forms/forms/view_personero');
});
router.post('/personero', (req, res) => {
    res.render('forms/view_personero');
});
router.get('/contralor', (req, res) => {
    res.render('forms/view_contralor');
});
router.post('/contralor', (req, res) => {
    res.render('forms/view_contralor');
});
router.get('/representante', (req, res) => {
    res.render('forms/view_representante');
});
router.post('/representante', (req, res) => {
    res.render('forms/representante');
});
module.exports = router;