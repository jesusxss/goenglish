const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'intenglish_estucur',
  port: 3306,
});

connection.connect(err => {
  if (err) console.error('DB error:', err);
  else console.log('DB conectada');
});

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
    }
  );
});

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

app.listen(3009, () => console.log('API de Asignaciones con JWT corriendo en http://localhost:3009'));