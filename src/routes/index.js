const express = require('express');
const router = express.Router();
const pool = require('../database');


router.get('/', (req, res) => {
    res.render('layouts/principal')
});

router.get('/personero', async(req, res) => {
    const datos = await pool.query('select * from candidatos where cargo = "Personero"');
    console.log(datos)
    res.render('forms/view_personero', { datos })
});
router.post('/personero/:idPersonero', async(req, res) => {
    const seleccion = req.params.idPersonero
    const datos = await pool.query('select * from candidatos where idCandidato = ?', seleccion);
    let cantidadVotos;
    datos.forEach(element => {
        const votos = element.cantidad_votos
        cantidadVotos = votos + 1;
    });
    console.log(cantidadVotos)
    await pool.query(`UPDATE candidatos set cantidad_votos = ? where idCandidato = ?`, [cantidadVotos, req.params.idPersonero])
    res.redirect('/contralor')
});

router.get('/contralor', async(req, res) => {
    const datos = await pool.query('select * from candidatos where cargo = "Contralor"');
    res.render('forms/view_contralor', { datos })
});
router.post('/contralor/:idContralor', async(req, res) => {
    const seleccion = req.params.idContralor
    const datos = await pool.query('select * from candidatos where idCandidato = ?', seleccion);
    let cantidadVotos;
    datos.forEach(element => {
        const votos = element.cantidad_votos
        cantidadVotos = votos + 1;
    });
    console.log(cantidadVotos)
    await pool.query(`UPDATE candidatos set cantidad_votos = ? where idCandidato = ?`, [cantidadVotos, req.params.idPersonero])
    res.redirect('/representante')
});

router.get('/representante', async(req, res) => {
    const datos = await pool.query('select * from candidatos where cargo = "Representante"');
    res.render('forms/view_representante', { datos })
});
router.post('/representante/:idRepresentante', async(req, res) => {
    const seleccion = req.params.idRepresentante
    const datos = await pool.query('select * from candidatos where idCandidato = ?', seleccion);
    let cantidadVotos;
    datos.forEach(element => {
        const votos = element.cantidad_votos
        cantidadVotos = votos + 1;
    });
    console.log(cantidadVotos)
    await pool.query(`UPDATE candidatos set cantidad_votos = ? where idCandidato = ?`, [cantidadVotos, req.params.idPersonero])
    res.redirect('/final')

});


router.get('/final', (req, res) => {
    res.render('view_final')
})


module.exports = router;