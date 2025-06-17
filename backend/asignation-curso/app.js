const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
<<<<<<< HEAD
  host: 'instenglish-auth.c50qcacwip4o.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'GgAnth17',
  database: 'intenglish_curso',
=======
  host: 'localhost',
  user: 'admingoenglishpe',
  password: 'Ewb-A4Q-KY2-emz',
  database: 'intenglish_estucur',
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
  port: 3306,
});

connection.connect(err => {
  if (err) console.error('DB error:', err);
  else console.log('DB conectada');
});

<<<<<<< HEAD
app.post('/api/asignaciones-curso', (req, res) => {
  console.log('Datos recibidos:', req.body);
  
  const {
    estudianteNombre,
    profesorNombre,
    cursoNombre,
    capacidad,
    hora_inicio,
    hora_fin,
    fecha_inicio,
    aula
  } = req.body;

  // Convertir fecha_inicio al formato correcto
  let fechaFormateada = fecha_inicio;
  if (fecha_inicio && fecha_inicio.includes('T')) {
    fechaFormateada = fecha_inicio.split('T')[0]; // Extrae solo la parte de fecha YYYY-MM-DD
  }

  const insertQuery = `
    INSERT INTO asignacionar_curso
    (estudianteNombre, profesorNombre, cursoNombre, capacidad, hora_inicio, hora_fin, fecha_inicio, aula)
    VALUES (?,?,?,?,?,?,?,?)
  `;

  connection.query(
    insertQuery,
    [estudianteNombre, profesorNombre, cursoNombre, capacidad, hora_inicio, hora_fin, fechaFormateada, aula],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al guardar la asignación' });
      }
      res.status(201).json({ message: 'Asignación creada', id: result.insertId });
=======
// Obtener todos los cursos con profesor, capacidad y cupos disponibles
app.get('/cursos-con-profesor', (req, res) => {
  connection.query(
    `SELECT 
      apc.id,
      c.nombre AS curso_nombre,
      p.nombre AS profesor_nombre,
      apc.dia_semana,
      apc.hora_inicio,
      apc.hora_fin,
      apc.fecha_inicio,
      apc.fecha_fin,
      apc.max_alumnos,
      apc.disponibles
    FROM asignaciones_profesor_curso apc
    JOIN cursos c ON apc.curso_id = c.id
    JOIN profesores p ON apc.profesor_id = p.id
    ORDER BY c.nombre, p.nombre`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
    }
  );
});

<<<<<<< HEAD
app.listen(3009, () => console.log('API de Asignaciones con JWT corriendo en http://3.15.145.16:3009'));
=======
// Asignar estudiante a curso (resta cupo disponible)
app.post('/asignar-estudiante', (req, res) => {
  const { estudiante_id, asignacion_profesor_curso_id } = req.body;
  if (!estudiante_id || !asignacion_profesor_curso_id) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // Verifica cupos disponibles
  connection.query(
    'SELECT disponibles FROM asignaciones_profesor_curso WHERE id = ?',
    [asignacion_profesor_curso_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!results.length) return res.status(404).json({ error: 'Curso no encontrado' });
      if (results[0].disponibles <= 0) return res.status(400).json({ error: 'No hay cupos disponibles' });

      // Asigna estudiante
      connection.query(
        'INSERT INTO asignaciones_estudiante (estudiante_id, asignacion_profesor_curso_id) VALUES (?, ?)',
        [estudiante_id, asignacion_profesor_curso_id],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });

          // Resta cupo
          connection.query(
            'UPDATE asignaciones_profesor_curso SET disponibles = disponibles - 1 WHERE id = ?',
            [asignacion_profesor_curso_id],
            (err3) => {
              if (err3) return res.status(500).json({ error: err3.message });
              res.json({ success: true });
            }
          );
        }
      );
    }
  );
});

// Listar estudiantes asignados a un curso
app.get('/asignados/:asignacion_profesor_curso_id', (req, res) => {
  const { asignacion_profesor_curso_id } = req.params;
  connection.query(
    `SELECT e.id, e.nombre 
     FROM asignaciones_estudiante ae
     JOIN estudiantes e ON ae.estudiante_id = e.id
     WHERE ae.asignacion_profesor_curso_id = ?`,
    [asignacion_profesor_curso_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

app.listen(3009, () => console.log('API de Asignaciones con JWT corriendo en http://18.222.195.94:3009'));
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
