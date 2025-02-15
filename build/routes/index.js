const express = require('express');

const router = express.Router();

const pool = require('../database');

const passport = require('passport');

const {
  isLoggedIn
} = require('../lib/auth');

let id;
let idConsejo;
let currentPersonero;
let currentContralor;
let currentRepresentante;
router.get('/', (req, res) => {
  const IniHora = "08";
  const IniMinutos = "00";
  const finHora = "16";
  const finMinutos = "00";
  var fechaHora = new Date();
  var horas = fechaHora.getHours();
  var minutos = fechaHora.getMinutes();

  if (horas == IniHora && minutos == IniMinutos) {
    res.render('layouts/principal');
  } else if (horas == finHora && minutos == finMinutos) {
    res.redirect('/final');
  } else {
    res.render('view_bienvenido');
  }
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
    const perfil = await pool.query(`SELECT * FROM usuarios where identificacion = ${id}`);
    const datos = await pool.query('select * from candidatos where cargo = "Personero"');
    res.render('forms/view_personero', {
      datos,
      perfil
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
    const perfil = await pool.query(`SELECT * FROM usuarios where identificacion = ${id}`);
    const datos = await pool.query('select * from candidatos where cargo = "Contralor"');
    res.render('forms/view_contralor', {
      datos,
      perfil
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
  await pool.query(`UPDATE candidatos set cantidad_votos = ? where idCandidato = ?`, [cantidadVotos, req.params.idContralor]);
  await pool.query("update usuarios set status_contralor = 1 where identificacion = ?", [id]);
  res.redirect('/representante');
});
router.get('/representante', async (req, res) => {
  if (currentRepresentante == 0) {
    // SELECT grado FROM `usuarios` WHERE identificacion = "1079185089"
    let codigoCurso;
    const perfil = await pool.query(`SELECT * FROM usuarios where identificacion = ${id}`);
    const curso = await pool.query('select grado from usuarios where identificacion = ?', [id]);
    curso.forEach(element => {
      codigoCurso = element.grado;
    });
    const datos = await pool.query('select * from candidatos where cargo = "Representante" and curso = ?', [codigoCurso]);
    res.render('forms/view_representante', {
      datos,
      perfil
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
  await pool.query(`UPDATE candidatos set cantidad_votos = ? where idCandidato = ?`, [cantidadVotos, req.params.idRepresentante]);
  await pool.query("update usuarios set status_representante = 1 where identificacion = ?", [id]);
  res.redirect('/final');
});
router.get('/resultados', async (req, res) => {
  res.render('dashboard/view_index');
});
router.post('/resultados', async (req, res) => {
  idConsejo = req.body.username;
  const perfil = await pool.query(`SELECT * FROM consejo where identificacion = ${idConsejo}`);

  if (perfil) {
    res.redirect('/estadisticas');
  } else {
    res.render('dashboard/view_index');
  }
});
router.get('/estadisticas', async (req, res) => {
  const datosConsejo = await pool.query(`select * from consejo where identificacion = ${idConsejo}`);
  const Personero = await pool.query('select * from candidatos where cargo = "Personero"');
  const Contralor = await pool.query('select * from candidatos where cargo = "Contralor"');
  const Representante3 = await pool.query('select * from candidatos where cargo = "Representante" and curso = 3');
  const Representante4 = await pool.query('select * from candidatos where cargo = "Representante" and curso = 4');
  const Representante5 = await pool.query('select * from candidatos where cargo = "Representante" and curso = 5');
  const Representante6 = await pool.query('select * from candidatos where cargo = "Representante" and curso = 6');
  const Representante7 = await pool.query('select * from candidatos where cargo = "Representante" and curso = 7');
  const Representante8 = await pool.query('select * from candidatos where cargo = "Representante" and curso = 8');
  const Representante9 = await pool.query('select * from candidatos where cargo = "Representante" and curso = 9');
  const Representante10 = await pool.query('select * from candidatos where cargo = "Representante" and curso = 10');
  const Representante11 = await pool.query('select * from candidatos where cargo = "Representante" and curso = 11');
  res.render('dashboard/view_resultados', {
    Personero,
    Contralor,
    Representante3,
    Representante4,
    Representante5,
    Representante6,
    Representante7,
    Representante8,
    Representante9,
    Representante10,
    Representante11,
    datosConsejo
  });
});
router.get('/final', (req, res) => {
  res.render('view_final');
});
module.exports = router;