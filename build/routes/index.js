const express = require('express');

const router = express.Router();

const pool = require('../database');

const passport = require('passport');

const {
  isLoggedIn
} = require('../lib/auth');

let id;
let currentPersonero;
let currentContralor;
let currentRepresentante;
router.get('/', (req, res) => {
  res.render('layouts/principal');
});
router.post('/signin', async (req, res) => {
  const datos = await pool.query(`SELECT * FROM usuarios where identificacion = ${req.body.username}`);
  datos.forEach(element => {
    id = element.identificacion;
    currentPersonero = element.status_personero;
    currentContralor = element.status_contralor;
    currentRepresentante = element.status_representante;
  });

  if (id) {
    res.redirect('/personero');
  } else {
    res.redirect('/');
  }
});
router.get('/personero', async (req, res) => {
  if (currentPersonero == '0') {
    const datos = await pool.query('select * from candidatos where cargo = "Personero"');
    res.render('forms/view_personero', {
      datos
    });
  } else if (currentPersonero == '1') {
    res.redirect('/contralor');
  } else {
    res.redirect('/');
  }
});
router.post('/personero/:idPersonero', async (req, res) => {
  const seleccion = req.params.idPersonero;
  const datos = await pool.query('select * from candidatos where idCandidato = ?', seleccion);
  let cantidadVotos;
  datos.forEach(element => {
    const votos = element.cantidad_votos;
    cantidadVotos = votos + 1;
  });
  await pool.query("update usuarios set status_personero = 1 where identificacion = ?", [id]);
  await pool.query(`UPDATE candidatos set cantidad_votos = ? where idCandidato = ?`, [cantidadVotos, req.params.idPersonero]);
  res.redirect('/contralor');
});
router.get('/contralor', async (req, res) => {
  if (currentContralor == 0) {
    const datos = await pool.query('select * from candidatos where cargo = "Contralor"');
    res.render('forms/view_contralor', {
      datos
    });
  } else if (currentContralor == 1) {
    res.redirect('/representante');
  } else {
    res.redirect('/');
  }
});
router.post('/contralor/:idContralor', async (req, res) => {
  const seleccion = req.params.idContralor;
  const datos = await pool.query('select * from candidatos where idCandidato = ?', seleccion);
  let cantidadVotos;
  datos.forEach(element => {
    const votos = element.cantidad_votos;
    cantidadVotos = votos + 1;
  });
  console.log(cantidadVotos);
  await pool.query(`UPDATE candidatos set cantidad_votos = ? where idCandidato = ?`, [cantidadVotos, req.params.idPersonero]);
  await pool.query("update usuarios set status_contralor = 1 where identificacion = ?", [id]);
  res.redirect('/representante');
});
router.get('/representante', async (req, res) => {
  if (currentRepresentante == 0) {
    // SELECT grado FROM `usuarios` WHERE identificacion = "1079185089"
    let codigoCurso;
    const curso = await pool.query('select grado from usuarios where identificacion = ?', [id]);
    curso.forEach(element => {
      codigoCurso = element.grado;
    });
    const datos = await pool.query('select * from candidatos where cargo = "Representante" and curso = ?', [codigoCurso]);
    res.render('forms/view_representante', {
      datos
    });
  } else if (currentRepresentante == 1) {
    res.redirect('/final');
  } else {
    res.redirect('/');
  }
});
router.post('/representante/:idRepresentante', async (req, res) => {
  const seleccion = req.params.idRepresentante;
  const datos = await pool.query('select * from candidatos where idCandidato = ?', seleccion);
  let cantidadVotos;
  datos.forEach(element => {
    const votos = element.cantidad_votos;
    cantidadVotos = votos + 1;
  });
  console.log(cantidadVotos);
  await pool.query(`UPDATE candidatos set cantidad_votos = ? where idCandidato = ?`, [cantidadVotos, req.params.idPersonero]);
  await pool.query("update usuarios set status_representante = 1 where identificacion = ?", [id]);
  res.redirect('/final');
});
router.get('/final', (req, res) => {
  res.render('view_final');
});
module.exports = router;