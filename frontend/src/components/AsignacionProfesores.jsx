import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { 
  FaCalendarAlt, 
  FaTrash, 
  FaEdit, 
  FaPlus, 
  FaSave, 
  FaTimes, 
  FaUser, 
  FaBook, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaChalkboardTeacher, 
  FaClipboardList,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUndo 
} from 'react-icons/fa';
=======
import { FaCalendarAlt, FaTrash, FaEdit, FaPlus, FaSave, FaTimes, FaUser, FaBook, FaClock, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde

const diasSemana = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

function getFechasEntreDias(fechaInicio, fechaFin, diaSemana) {
  const fechas = [];
  const dias = {
    'Domingo': 0, 'Lunes': 1, 'Martes': 2, 'Miércoles': 3,
    'Jueves': 4, 'Viernes': 5, 'Sábado': 6
  };
  let actual = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  actual.setHours(0,0,0,0);
  fin.setHours(0,0,0,0);

  // Buscar el primer día correcto
  while (actual.getDay() !== dias[diaSemana]) {
    actual.setDate(actual.getDate() + 1);
  }
  // Agregar todos los días correctos
  while (actual <= fin) {
    fechas.push(new Date(actual));
    actual.setDate(actual.getDate() + 7);
  }
  return fechas;
}

const AsignacionProfesores = ({
  profesores = [],
  cursos = [],
  asignaciones = [],
  fetchAsignaciones,
  token,
  showError,
  showSuccess
}) => {
  const [form, setForm] = useState({
    profesor: '',
    curso: '',
    dia: '',
    horaInicio: '',
    horaFin: '',
    fechaInicio: '',
    fechaFin: '',
    aula: '',
    notas: '',
    maxAlumnos: ''
  });
  const [errores, setErrores] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [ultimoRegistro, setUltimoRegistro] = useState(null);

  // Limpiar mensaje después de 5 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  // Validaciones en tiempo real
  const validar = (f = form) => {
    const e = {};
    if (!f.profesor) e.profesor = 'Seleccione un profesor';
    if (!f.curso) e.curso = 'Seleccione un curso';
    if (!f.dia) e.dia = 'Seleccione un día';
    if (!f.horaInicio) e.horaInicio = 'Ingrese la hora de inicio';
    if (!f.horaFin) e.horaFin = 'Ingrese la hora de fin';
    if (!f.fechaInicio) e.fechaInicio = 'Ingrese la fecha de inicio';
    if (!f.fechaFin) e.fechaFin = 'Ingrese la fecha de fin';
    
    // Validaciones de fechas
    if (f.fechaInicio && f.fechaFin && new Date(f.fechaFin) < new Date(f.fechaInicio)) {
      e.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }
    
    // Validaciones de horas
    if (f.horaInicio && f.horaFin && f.horaFin <= f.horaInicio) {
      e.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
    }
    
    // Validación de máximo de alumnos
    if (!f.maxAlumnos) {
      e.maxAlumnos = 'Ingrese la cantidad máxima de alumnos';
    } else if (isNaN(f.maxAlumnos) || parseInt(f.maxAlumnos) <= 0) {
      e.maxAlumnos = 'Ingrese una cantidad válida mayor a 0';
    }
    
    return e;
  };

  const handleChange = e => {
    const { name, value } = e.target;
    const newForm = { ...form, [name]: value };
    setForm(newForm);
    
    // Validar en tiempo real
    const nuevosErrores = validar(newForm);
    setErrores(nuevosErrores);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validar formulario
    const eValid = validar();
    setErrores(eValid);
    if (Object.keys(eValid).length > 0) {
      setMensaje('Por favor corrija los errores en el formulario');
      return;
    }

    setLoading(true);
    setMensaje('');
    
    try {
      // Preparar datos para enviar
      const profesorSeleccionado = profesores.find(p => String(p.id) === String(form.profesor));
      const cursoSeleccionado = cursos.find(c => String(c.id) === String(form.curso));

      if (!profesorSeleccionado) {
        throw new Error('Profesor no encontrado');
      }
      if (!cursoSeleccionado) {
        throw new Error('Curso no encontrado');
      }

      const body = {
        profesorId: parseInt(form.profesor),
        profesorNombre: profesorSeleccionado.nombre,
        cursoId: parseInt(form.curso),
        cursoNombre: cursoSeleccionado.nombre,
        diaSemana: form.dia,
        horaInicio: form.horaInicio,
        horaFin: form.horaFin,
        fechaInicio: form.fechaInicio,
        fechaFin: form.fechaFin,
        aula: form.aula.trim(),
        notas: form.notas.trim(),
        maxAlumnos: parseInt(form.maxAlumnos)
      };

<<<<<<< HEAD
      let url = 'http://3.15.145.16:3007/asignaciones';
=======
      let url = 'http://18.222.195.94:3007/asignaciones';
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
      let method = 'POST';
      
      // Si estamos editando, usar PUT y agregar el ID
      if (editIndex !== null && editId) {
<<<<<<< HEAD
        url = `http://3.15.145.16:3007/asignaciones/${editId}`;
=======
        url = `http://18.222.195.94:3007/asignaciones/${editId}`;
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
        method = 'PUT';
      }

      const res = await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Error HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      // Mostrar datos del registro recién creado o editado
      setUltimoRegistro({
        ...body,
        id: data.id || editId,
        profesor_nombre: body.profesorNombre,
        curso_nombre: body.cursoNombre,
      });

      const mensajeExito = editIndex !== null ? 'Asignación actualizada exitosamente' : 'Asignación creada exitosamente';
      setMensaje(mensajeExito);
      showSuccess && showSuccess(mensajeExito);

      // Recargar asignaciones
      if (fetchAsignaciones) {
        await fetchAsignaciones();
      }

      // Limpiar formulario
      handleReset();

    } catch (err) {
      console.error('Error en handleSubmit:', err);
      const mensajeError = err.message || 'Error de conexión con el servidor';
      setMensaje(mensajeError);
      showError && showError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (idx) => {
    if (idx < 0 || idx >= asignaciones.length) {
      showError && showError('Asignación no válida');
      return;
    }

    const a = asignaciones[idx];
    
    // Buscar IDs de profesor y curso
    const profesorId = a.profesor_id || profesores.find(p => p.nombre === (a.profesor_nombre || a.profesor))?.id || '';
    const cursoId = a.curso_id || cursos.find(c => c.nombre === (a.curso_nombre || a.curso))?.id || '';

    setForm({
      profesor: String(profesorId),
      curso: String(cursoId),
      dia: a.dia_semana || a.dia || '',
      horaInicio: a.hora_inicio || a.horaInicio || '',
      horaFin: a.hora_fin || a.horaFin || '',
      fechaInicio: a.fecha_inicio || a.fechaInicio || '',
      fechaFin: a.fecha_fin || a.fechaFin || '',
      aula: a.aula || '',
      notas: a.notas || '',
      maxAlumnos: String(a.max_alumnos || a.maxAlumnos || '')
    });
    
    setEditIndex(idx);
    setEditId(a.id);
    setErrores({});
    setMensaje('');
  };

  const handleDelete = async (idx) => {
    if (idx < 0 || idx >= asignaciones.length) {
      showError && showError('Asignación no válida');
      return;
    }

    const asignacion = asignaciones[idx];
    
    if (!asignacion.id) {
      showError && showError('ID de asignación no válido');
      return;
    }

    if (!window.confirm('¿Está seguro de que desea eliminar esta asignación?')) return;
    
    setLoading(true);
    setMensaje('');
    
    try {
<<<<<<< HEAD
      const res = await fetch(`http://3.15.145.16:3006/asignaciones/${asignacion.id}`, { 
=======
      const res = await fetch(`http://18.222.195.94:3006/asignaciones/${asignacion.id}`, { 
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Error HTTP ${res.status}: ${res.statusText}`);
      }
      
      const mensajeExito = 'Asignación eliminada exitosamente';
      setMensaje(mensajeExito);
      showSuccess && showSuccess(mensajeExito);
      
      // Recargar asignaciones
      if (fetchAsignaciones) {
        await fetchAsignaciones();
      }
      
    } catch (err) {
      console.error('Error en handleDelete:', err);
      const mensajeError = err.message || 'Error de conexión al eliminar';
      setMensaje(mensajeError);
      showError && showError(mensajeError);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm({
      profesor: '',
      curso: '',
      dia: '',
      horaInicio: '',
      horaFin: '',
      fechaInicio: '',
      fechaFin: '',
      aula: '',
      notas: '',
      maxAlumnos: ''
    });
    setErrores({});
    setEditIndex(null);
    setEditId(null);
    setMensaje('');
  };

  const cancelEdit = () => {
    handleReset();
  };

  // Componente para mostrar la última asignación con diseño más integrado
  const UltimaAsignacionCard = ({ registro, onClose }) => (
<<<<<<< HEAD
    <div className="mt-4 bg-white border rounded-3 shadow-sm overflow-hidden">
      <div className="bg-success bg-gradient bg-opacity-10 p-3 border-bottom">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-success text-white rounded-circle p-2" style={{width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <FaCheckCircle size={16} />
            </div>
            <div>
              <h6 className="fw-bold mb-0 text-success">Asignación Registrada</h6>
              <small className="text-muted">ID #{registro.id}</small>
            </div>
          </div>
          <button className="btn btn-sm btn-light rounded-circle" onClick={onClose} title="Cerrar">
            <FaTimes />
          </button>
        </div>
      </div>
      
      <div className="p-3">
        <div className="row g-3 mb-2">
          <div className="col-md-6">
            <div className="card h-100 border-0 bg-light">
              <div className="card-body py-2 px-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <FaChalkboardTeacher className="text-primary" size={16} />
                  <h6 className="card-title mb-0 fw-bold">Profesor</h6>
                </div>
                <p className="card-text mb-0">{registro.profesor_nombre}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 bg-light">
              <div className="card-body py-2 px-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <FaBook className="text-info" size={16} />
                  <h6 className="card-title mb-0 fw-bold">Curso</h6>
                </div>
                <p className="card-text mb-0">{registro.curso_nombre}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="row g-3">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-warning bg-opacity-10 p-1 rounded">
                <FaClock className="text-warning" size={14} />
              </div>
              <div>
                <div className="fw-semibold small">Horario</div>
                <span className="small">{registro.diaSemana || registro.dia} • {registro.horaInicio} - {registro.horaFin}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-danger bg-opacity-10 p-1 rounded">
                <FaMapMarkerAlt className="text-danger" size={14} />
              </div>
              <div>
                <div className="fw-semibold small">Ubicación</div>
                <span className="small">{registro.aula || 'No especificada'}</span>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary bg-opacity-10 p-1 rounded">
                <FaUsers className="text-primary" size={14} />
              </div>
              <div>
                <div className="fw-semibold small">Capacidad</div>
                <span className="small">Máx. {registro.maxAlumnos} alumnos</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-2 border-top">
          <div className="d-flex gap-3">
            <div className="small text-muted">
              <FaCalendarAlt className="me-1" size={12} /> Desde: {registro.fechaInicio}
            </div>
            <div className="small text-muted">
              <FaCalendarAlt className="me-1" size={12} /> Hasta: {registro.fechaFin}
            </div>
          </div>
          {registro.notas && (
            <div className="small text-muted mt-2">
              <FaClipboardList className="me-1" size={12} /> {registro.notas}
            </div>
          )}
        </div>
=======
    <div className="mt-4 p-3 bg-light border-start border-success border-4 rounded">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="d-flex align-items-center">
          <div className="bg-success text-white rounded-circle p-2 me-2" style={{width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <FaCalendarAlt size={14} />
          </div>
          <span className="fw-bold text-success small">ASIGNACIÓN REGISTRADA</span>
        </div>
        <button className="btn btn-sm btn-outline-secondary border-0" onClick={onClose} title="Cerrar">
          <FaTimes size={12} />
        </button>
      </div>
      
      <div className="row g-2">
        <div className="col-md-6">
          <div className="d-flex align-items-center mb-1">
            <FaUser className="text-primary me-2" size={14} />
            <small className="fw-bold">{registro.profesor_nombre}</small>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center mb-1">
            <FaBook className="text-info me-2" size={14} />
            <small className="fw-bold">{registro.curso_nombre}</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="d-flex align-items-center mb-1">
            <FaClock className="text-warning me-2" size={14} />
            <small>{registro.diaSemana || registro.dia} • {registro.horaInicio}-{registro.horaFin}</small>
          </div>
        </div>
        <div className="col-md-4">
          {registro.aula && (
            <div className="d-flex align-items-center mb-1">
              <FaMapMarkerAlt className="text-danger me-2" size={14} />
              <small>{registro.aula}</small>
            </div>
          )}
        </div>
        <div className="col-md-4">
          <div className="d-flex align-items-center mb-1">
            <FaUsers className="text-secondary me-2" size={14} />
            <small>Máx. {registro.maxAlumnos}</small>
          </div>
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-top">
        <small className="text-muted">
          Período: {registro.fechaInicio} al {registro.fechaFin}
          {registro.notas && ` • ${registro.notas}`}
        </small>
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
      </div>
    </div>
  );

  // Modifica fetchAsignaciones para limpiar ultimoRegistro si no hay asignaciones
  useEffect(() => {
    if (asignaciones && asignaciones.length === 0) {
      setUltimoRegistro(null);
    }
  }, [asignaciones]);

  return (
<<<<<<< HEAD
    <div className="container-fluid p-0">
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-primary bg-gradient text-white py-3">
          <div className="d-flex align-items-center">
            <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3" style={{width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <FaCalendarAlt size={18} className="text-white" />
            </div>
            <div>
              <h5 className="mb-0 fw-bold">
                {editIndex !== null ? 'Editar Asignación' : 'Nueva Asignación de Profesor'}
              </h5>
              <small className="opacity-75">Complete el formulario para {editIndex !== null ? 'actualizar' : 'crear'} una asignación</small>
            </div>
          </div>
        </div>

        <div className="card-body p-4">
          {mensaje && (
            <div className={`alert ${mensaje.includes('exitosamente') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show d-flex align-items-center gap-2 mb-4`}>
              <div className={`rounded-circle p-1 ${mensaje.includes('exitosamente') ? 'bg-success' : 'bg-danger'} bg-opacity-25`}>
                {mensaje.includes('exitosamente') ? <FaCheckCircle size={16} /> : <FaExclamationTriangle size={16} />}
              </div>
              <div className="flex-grow-1">{mensaje}</div>
              <button type="button" className="btn-close" onClick={() => setMensaje('')} aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3 mb-4">
              <div className="col-12">
                <h6 className="fw-bold text-primary mb-3 border-bottom pb-2">
                  <FaUser className="me-2" size={14} />
                  Información del Profesor y Curso
                </h6>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-semibold">Profesor *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaChalkboardTeacher size={16} />
                  </span>
                  <select
                    className={`form-select ${errores.profesor ? 'is-invalid' : ''}`}
                    name="profesor"
                    value={form.profesor}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Seleccione un profesor...</option>
                    {profesores.map((p) => (
                      <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                  </select>
                  {errores.profesor && <div className="invalid-feedback">{errores.profesor}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-semibold">Curso/Materia *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaBook size={16} />
                  </span>
                  <select
                    className={`form-select ${errores.curso ? 'is-invalid' : ''}`}
                    name="curso"
                    value={form.curso}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Seleccione un curso...</option>
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                  {errores.curso && <div className="invalid-feedback">{errores.curso}</div>}
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              <div className="col-12">
                <h6 className="fw-bold text-primary mb-3 border-bottom pb-2">
                  <FaClock className="me-2" size={14} />
                  Horario y Período
                </h6>
              </div>
              
              <div className="col-md-4">
                <label className="form-label fw-semibold">Día *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaCalendarAlt size={16} />
                  </span>
                  <select 
                    className={`form-select ${errores.dia ? 'is-invalid' : ''}`}
                    name="dia" 
                    value={form.dia} 
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Seleccione...</option>
                    {diasSemana.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errores.dia && <div className="invalid-feedback">{errores.dia}</div>}
                </div>
              </div>
              
              <div className="col-md-4">
                <label className="form-label fw-semibold">Hora Inicio *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaClock size={16} />
                  </span>
                  <input 
                    type="time" 
                    className={`form-control ${errores.horaInicio ? 'is-invalid' : ''}`}
                    name="horaInicio" 
                    value={form.horaInicio} 
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errores.horaInicio && <div className="invalid-feedback">{errores.horaInicio}</div>}
                </div>
              </div>
              
              <div className="col-md-4">
                <label className="form-label fw-semibold">Hora Fin *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaClock size={16} />
                  </span>
                  <input 
                    type="time" 
                    className={`form-control ${errores.horaFin ? 'is-invalid' : ''}`}
                    name="horaFin" 
                    value={form.horaFin} 
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errores.horaFin && <div className="invalid-feedback">{errores.horaFin}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-semibold">Fecha Inicio *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaCalendarAlt size={16} />
                  </span>
                  <input 
                    type="date" 
                    className={`form-control ${errores.fechaInicio ? 'is-invalid' : ''}`}
                    name="fechaInicio" 
                    value={form.fechaInicio} 
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errores.fechaInicio && <div className="invalid-feedback">{errores.fechaInicio}</div>}
                </div>
              </div>
              
              <div className="col-md-6">
                <label className="form-label fw-semibold">Fecha Fin *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaCalendarAlt size={16} />
                  </span>
                  <input 
                    type="date" 
                    className={`form-control ${errores.fechaFin ? 'is-invalid' : ''}`}
                    name="fechaFin" 
                    value={form.fechaFin} 
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errores.fechaFin && <div className="invalid-feedback">{errores.fechaFin}</div>}
                </div>
              </div>
            </div>
            
            <div className="row g-3 mb-4">
              <div className="col-12">
                <h6 className="fw-bold text-primary mb-3 border-bottom pb-2">
                  <FaMapMarkerAlt className="me-2" size={14} />
                  Detalles Adicionales
                </h6>
              </div>
              
              <div className="col-md-4">
                <label className="form-label fw-semibold">Aula</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaMapMarkerAlt size={16} />
                  </span>
                  <input 
                    type="text" 
                    className="form-control"
                    name="aula" 
                    value={form.aula} 
                    onChange={handleChange}
                    placeholder="Ej: Aula 101"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="col-md-4">
                <label className="form-label fw-semibold">Máx. Alumnos *</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaUsers size={16} />
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    className={`form-control ${errores.maxAlumnos ? 'is-invalid' : ''}`}
                    name="maxAlumnos"
                    value={form.maxAlumnos}
                    onChange={handleChange}
                    placeholder="30"
                    disabled={loading}
                  />
                  {errores.maxAlumnos && <div className="invalid-feedback">{errores.maxAlumnos}</div>}
                </div>
              </div>
              
              <div className="col-md-4">
                <label className="form-label fw-semibold">Notas</label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaClipboardList size={16} />
                  </span>
                  <input 
                    type="text" 
                    className="form-control"
                    name="notas" 
                    value={form.notas} 
                    onChange={handleChange}
                    placeholder="Información adicional (opcional)"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
            
            <div className="d-flex gap-2 justify-content-end border-top pt-4 mt-2">
              <button type="button" className="btn btn-outline-secondary" onClick={handleReset} disabled={loading}>
                <FaTimes className="me-1" size={14} />
=======
    <div className="p-0">
      {/* Header más simple y integrado */}
      <div className="d-flex align-items-center mb-3">
        <div className="bg-primary text-white rounded p-2 me-3" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <FaCalendarAlt size={18} />
        </div>
        <div>
          <h5 className="mb-0">
            {editIndex !== null ? 'Editar Asignación' : 'Nueva Asignación'}
          </h5>
          <small className="text-muted">Gestión de horarios y profesores</small>
        </div>
      </div>

      {/* Mensaje de estado más discreto */}
      {mensaje && (
        <div className={`alert ${mensaje.includes('exitosamente') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show border-0 shadow-sm`} style={{fontSize: '0.9rem'}}>
          {mensaje}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setMensaje('')}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Formulario en card más simple */}
      <div className="bg-white rounded border shadow-sm p-3 mb-3">
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold small">Profesor *</label>
            <select
              className={`form-select form-select-sm ${errores.profesor ? 'is-invalid' : ''}`}
              name="profesor"
              value={form.profesor}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Seleccione un profesor...</option>
              {profesores.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
            {errores.profesor && <div className="invalid-feedback small">{errores.profesor}</div>}
          </div>
          
          <div className="col-md-6">
            <label className="form-label fw-semibold small">Curso/Materia *</label>
            <select
              className={`form-select form-select-sm ${errores.curso ? 'is-invalid' : ''}`}
              name="curso"
              value={form.curso}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Seleccione un curso...</option>
              {cursos.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
            {errores.curso && <div className="invalid-feedback small">{errores.curso}</div>}
          </div>
          
          <div className="col-md-4">
            <label className="form-label fw-semibold small">Día *</label>
            <select 
              className={`form-select form-select-sm ${errores.dia ? 'is-invalid' : ''}`}
              name="dia" 
              value={form.dia} 
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">Seleccione...</option>
              {diasSemana.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {errores.dia && <div className="invalid-feedback small">{errores.dia}</div>}
          </div>
          
          <div className="col-md-4">
            <label className="form-label fw-semibold small">Hora Inicio *</label>
            <input 
              type="time" 
              className={`form-control form-control-sm ${errores.horaInicio ? 'is-invalid' : ''}`}
              name="horaInicio" 
              value={form.horaInicio} 
              onChange={handleChange}
              disabled={loading}
            />
            {errores.horaInicio && <div className="invalid-feedback small">{errores.horaInicio}</div>}
          </div>
          
          <div className="col-md-4">
            <label className="form-label fw-semibold small">Hora Fin *</label>
            <input 
              type="time" 
              className={`form-control form-control-sm ${errores.horaFin ? 'is-invalid' : ''}`}
              name="horaFin" 
              value={form.horaFin} 
              onChange={handleChange}
              disabled={loading}
            />
            {errores.horaFin && <div className="invalid-feedback small">{errores.horaFin}</div>}
          </div>
          
          <div className="col-md-6">
            <label className="form-label fw-semibold small">Fecha Inicio *</label>
            <input 
              type="date" 
              className={`form-control form-control-sm ${errores.fechaInicio ? 'is-invalid' : ''}`}
              name="fechaInicio" 
              value={form.fechaInicio} 
              onChange={handleChange}
              disabled={loading}
            />
            {errores.fechaInicio && <div className="invalid-feedback small">{errores.fechaInicio}</div>}
          </div>
          
          <div className="col-md-6">
            <label className="form-label fw-semibold small">Fecha Fin *</label>
            <input 
              type="date" 
              className={`form-control form-control-sm ${errores.fechaFin ? 'is-invalid' : ''}`}
              name="fechaFin" 
              value={form.fechaFin} 
              onChange={handleChange}
              disabled={loading}
            />
            {errores.fechaFin && <div className="invalid-feedback small">{errores.fechaFin}</div>}
          </div>
          
          <div className="col-md-4">
            <label className="form-label fw-semibold small">Aula</label>
            <input 
              type="text" 
              className="form-control form-control-sm"
              name="aula" 
              value={form.aula} 
              onChange={handleChange}
              placeholder="Ej: Aula 101"
              disabled={loading}
            />
          </div>
          
          <div className="col-md-4">
            <label className="form-label fw-semibold small">Máx. Alumnos *</label>
            <input
              type="number"
              min="1"
              max="100"
              className={`form-control form-control-sm ${errores.maxAlumnos ? 'is-invalid' : ''}`}
              name="maxAlumnos"
              value={form.maxAlumnos}
              onChange={handleChange}
              placeholder="30"
              disabled={loading}
            />
            {errores.maxAlumnos && <div className="invalid-feedback small">{errores.maxAlumnos}</div>}
          </div>
          
          <div className="col-md-4">
            <label className="form-label fw-semibold small">Notas</label>
            <input 
              type="text" 
              className="form-control form-control-sm"
              name="notas" 
              value={form.notas} 
              onChange={handleChange}
              placeholder="Opcional"
              disabled={loading}
            />
          </div>
          
          {/* Botones más compactos */}
          <div className="col-12 pt-2">
            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleReset} disabled={loading}>
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
                Limpiar
              </button>
              
              {editIndex !== null && (
<<<<<<< HEAD
                <button type="button" className="btn btn-warning" onClick={cancelEdit} disabled={loading}>
                  <FaUndo className="me-1" size={14} />
                  Cancelar Edición
                </button>
              )}
              
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
=======
                <button type="button" className="btn btn-warning btn-sm" onClick={cancelEdit} disabled={loading}>
                  <FaTimes className="me-1" size={12} />
                  Cancelar
                </button>
              )}
              
              <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" style={{width: '12px', height: '12px'}}></span>
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
                    Procesando...
                  </>
                ) : (
                  <>
<<<<<<< HEAD
                    {editIndex !== null ? <FaSave className="me-1" size={14} /> : <FaPlus className="me-1" size={14} />}
                    {editIndex !== null ? 'Actualizar Asignación' : 'Crear Asignación'}
=======
                    {editIndex !== null ? <FaSave className="me-1" size={12} /> : <FaPlus className="me-1" size={12} />}
                    {editIndex !== null ? 'Actualizar' : 'Guardar'}
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
                  </>
                )}
              </button>
            </div>
<<<<<<< HEAD
          </form>
          
          {ultimoRegistro && (
            <div className="mt-4">
              <UltimaAsignacionCard
                registro={ultimoRegistro}
                onClose={() => setUltimoRegistro(null)}
              />
            </div>
          )}
        </div>
=======
          </div>
        </form>

        {/* Mostrar la última asignación de forma más integrada */}
        {ultimoRegistro && (
          <UltimaAsignacionCard
            registro={ultimoRegistro}
            onClose={() => setUltimoRegistro(null)}
          />
        )}
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
      </div>
    </div>
  );
};

export default AsignacionProfesores;