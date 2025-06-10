import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = 'http://localhost:3007/asignaciones';
const PROFESORES_URL = 'http://localhost:3007/profesores';

// Iconos SVG personalizados
const Icons = {
  Edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="m18.5 2.5 a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  Trash: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3,6 5,6 21,6"/>
      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </svg>
  ),
  Plus: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  X: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  GraduationCap: () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12,6 12,12 16,14"/>
    </svg>
  ),
  MapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14,2 14,8 20,8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10,9 9,9 8,9"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
};

const DIAS_SEMANA = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'
];

const ProfesoresAsignaturas = ({ token }) => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    profesor_nombre: '',
    curso_nombre: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
    fecha_inicio: '',
    fecha_fin: '',
    aula: '',
    notas: '',
    max_alumnos: ''
  });

  // Filtros y búsqueda
  const [search, setSearch] = useState('');
  const [filtroClase, setFiltroClase] = useState('');
  const [filtroDia, setFiltroDia] = useState('');

  // Toast state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const toastTimeout = useRef();

  // Toast helpers
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    clearTimeout(toastTimeout.current);
    toastTimeout.current = setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  // Fetch asignaciones
  const fetchAsignaciones = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setAsignaciones(data.data || []);
    } catch (err) {
      showToast('Error al cargar asignaciones', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Fetch profesores para el select
  const fetchProfesores = async () => {
    try {
      const res = await fetch(PROFESORES_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProfesores(data || []);
    } catch (err) {
      showToast('Error al cargar profesores', 'danger');
    }
  };

  // Fetch clases/asignaturas para filtro
  const fetchClases = async () => {
    try {
      const res = await fetch('http://localhost:3007/cursos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setClases(data || []);
    } catch (err) {
      showToast('Error al cargar clases', 'danger');
    }
  };

  useEffect(() => {
    fetchAsignaciones();
    fetchProfesores();
    fetchClases();
    return () => clearTimeout(toastTimeout.current);
    // eslint-disable-next-line
  }, []);

  // Handlers
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = idx => {
    setEditIdx(idx);
    setShowForm(true);
    setForm({ ...asignacionesFiltradas[idx], max_alumnos: asignacionesFiltradas[idx].max_alumnos || '' });
  };

  const handleCancel = () => {
    setEditIdx(null);
    setShowForm(false);
    setForm({
      profesor_nombre: '',
      curso_nombre: '',
      dia_semana: '',
      hora_inicio: '',
      hora_fin: '',
      fecha_inicio: '',
      fecha_fin: '',
      aula: '',
      notas: '',
      max_alumnos: ''
    });
  };

  // Agregar estados para el modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Modificar el handleDelete
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Asignación eliminada', 'success');
      fetchAsignaciones();
      handleCancel();
    } catch {
      showToast('Error al eliminar', 'danger');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = {
        profesorNombre: form.profesor_nombre,
        cursoNombre: form.curso_nombre,
        diaSemana: form.dia_semana,
        horaInicio: form.hora_inicio,
        horaFin: form.hora_fin,
        fechaInicio: form.fecha_inicio,
        fechaFin: form.fecha_fin,
        aula: form.aula,
        notas: form.notas,
        maxAlumnos: form.max_alumnos
      };
      let res;
      if (editIdx !== null) {
        res = await fetch(`${API_URL}/${asignacionesFiltradas[editIdx].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });
      }
      if (!res.ok) throw new Error();
      showToast(editIdx !== null ? 'Asignación actualizada' : 'Asignación creada', 'success');
      fetchAsignaciones();
      handleCancel();
    } catch {
      showToast('Error al guardar', 'danger');
    } finally {
      setLoading(false);
    }
  };

  // Filtro y búsqueda
  const asignacionesFiltradas = asignaciones.filter(a => {
    const matchSearch =
      a.profesor_nombre.toLowerCase().includes(search.toLowerCase()) ||
      a.curso_nombre.toLowerCase().includes(search.toLowerCase());
    const matchClase = !filtroClase || a.curso_nombre === filtroClase;
    const matchDia = !filtroDia || a.dia_semana === filtroDia;
    return matchSearch && matchClase && matchDia;
  });

  return (
    <div className="container py-4">
      {/* Toast */}
      <div
        className="position-fixed top-0 end-0 p-3"
        style={{ zIndex: 1055, minWidth: 300 }}
      >
        <div
          className={`toast align-items-center text-bg-${toast.type} border-0 ${toast.show ? 'show' : ''}`}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="d-flex">
            <div className="toast-body">{toast.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Close"
              onClick={() => setToast({ ...toast, show: false })}
            ></button>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white rounded-circle p-3 me-3 d-flex align-items-center justify-content-center" style={{width: 56, height: 56}}>
              <Icons.GraduationCap />
            </div>
            <div>
              <h1 className="h3 mb-1">Gestión de Asignaciones</h1>
              <p className="text-muted mb-0">Administra las asignaciones de profesores y asignaturas</p>
            </div>
          </div>
          {/* Botón de Nueva Asignación eliminado */}
        </div>
      </div>

      {/* Buscador y filtros */}
      <div className="row g-2 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por profesor o asignatura..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filtroClase}
            onChange={e => setFiltroClase(e.target.value)}
          >
            <option value="">Todas las clases</option>
            {clases.map((c, i) => (
              <option key={i} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={filtroDia}
            onChange={e => setFiltroDia(e.target.value)}
          >
            <option value="">Todos los días</option>
            {DIAS_SEMANA.map(dia => (
              <option key={dia} value={dia}>{dia}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2 className="h5 mb-0">{editIdx !== null ? 'Editar Asignación' : 'Nueva Asignación'}</h2>
            <button onClick={handleCancel} className="btn btn-link text-muted p-0">
              <Icons.X />
            </button>
          </div>
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Profesor */}
              <div className="col-md-4">
                <label className="form-label">
                  <Icons.User /> Profesor
                </label>
                <select
                  name="profesor_nombre"
                  value={form.profesor_nombre}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-select"
                >
                  <option value="">Seleccione un profesor...</option>
                  {profesores.map((p, i) => (
                    <option key={i} value={p.nombre}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              {/* Asignatura */}
              <div className="col-md-4">
                <label className="form-label">
                  <Icons.GraduationCap /> Asignatura
                </label>
                <input
                  type="text"
                  name="curso_nombre"
                  value={form.curso_nombre}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-control"
                  placeholder="Nombre de la asignatura"
                />
              </div>
              {/* Día */}
              <div className="col-md-4">
                <label className="form-label">
                  <Icons.Calendar /> Día de la semana
                </label>
                <select
                  name="dia_semana"
                  value={form.dia_semana}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-select"
                >
                  <option value="">Seleccione un día...</option>
                  {DIAS_SEMANA.map(dia => (
                    <option key={dia} value={dia}>{dia}</option>
                  ))}
                </select>
              </div>
              {/* Hora inicio */}
              <div className="col-md-3">
                <label className="form-label">
                  <Icons.Clock /> Hora inicio
                </label>
                <input
                  type="time"
                  name="hora_inicio"
                  value={form.hora_inicio}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-control"
                />
              </div>
              {/* Hora fin */}
              <div className="col-md-3">
                <label className="form-label">
                  <Icons.Clock /> Hora fin
                </label>
                <input
                  type="time"
                  name="hora_fin"
                  value={form.hora_fin}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-control"
                />
              </div>
              {/* Fecha inicio */}
              <div className="col-md-3">
                <label className="form-label">
                  <Icons.Calendar /> Fecha inicio
                </label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={form.fecha_inicio}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-control"
                />
              </div>
              {/* Fecha fin */}
              <div className="col-md-3">
                <label className="form-label">
                  <Icons.Calendar /> Fecha fin
                </label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={form.fecha_fin}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  className="form-control"
                />
              </div>
              {/* Aula */}
              <div className="col-md-4">
                <label className="form-label">
                  <Icons.MapPin /> Aula
                </label>
                <input
                  type="text"
                  name="aula"
                  value={form.aula}
                  onChange={handleChange}
                  disabled={loading}
                  className="form-control"
                  placeholder="Número o nombre del aula"
                />
              </div>
              {/* Máximo alumnos */}
              <div className="col-md-4">
                <label className="form-label">
                  <Icons.Users /> Máximo alumnos
                </label>
                <input
                  type="number"
                  name="max_alumnos"
                  value={form.max_alumnos}
                  onChange={handleChange}
                  min="1"
                  disabled={loading}
                  className="form-control"
                  placeholder="Número máximo"
                />
              </div>
              {/* Notas */}
              <div className="col-12">
                <label className="form-label">
                  <Icons.FileText /> Notas adicionales
                </label>
                <textarea
                  name="notas"
                  value={form.notas}
                  onChange={handleChange}
                  rows={3}
                  disabled={loading}
                  className="form-control"
                  placeholder="Información adicional sobre la asignación..."
                />
              </div>
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="btn btn-outline-secondary"
              >
                <Icons.X /> Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                <Icons.Check /> {editIdx !== null ? 'Actualizar' : 'Crear'} Asignación
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de confirmación */}
      <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} 
           style={{ display: showDeleteModal ? 'block' : 'none' }}
           tabIndex="-1"
           aria-labelledby="deleteModalLabel"
           aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-bottom-0">
              <h5 className="modal-title" id="deleteModalLabel">Confirmar Eliminación</h5>
              <button 
                type="button" 
                className="btn-close"
                onClick={() => setShowDeleteModal(false)}
                aria-label="Close">
              </button>
            </div>
            <div className="modal-body py-4">
              <div className="text-center">
                <div className="display-1 text-danger mb-3">
                  <Icons.Trash />
                </div>
                <h4>¿Estás seguro?</h4>
                <p className="text-muted">
                  Esta acción eliminará permanentemente la asignación seleccionada.
                </p>
              </div>
            </div>
            <div className="modal-footer border-top-0">
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="button" 
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Eliminando...
                  </>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay del modal */}
      {showDeleteModal && (
        <div className="modal-backdrop fade show"></div>
      )}

      {/* Cards Grid */}
      <div className="row g-4">
        {asignacionesFiltradas.map((asignacion, idx) => (
          <div key={asignacion.id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <Icons.GraduationCap />
                  <div>
                    <h3 className="h6 mb-0">{asignacion.curso_nombre}</h3>
                    <small className="text-light">{asignacion.profesor_nombre}</small>
                  </div>
                </div>
                <span className="badge bg-light text-primary">{asignacion.dia_semana}</span>
              </div>
              <div className="card-body">
                <div className="mb-2 d-flex align-items-center gap-2 text-muted">
                  <Icons.Clock />
                  {/* Solo muestra hora inicio y fin, sin zona horaria */}
                  <span>
                    {asignacion.hora_inicio?.slice(0,5)} - {asignacion.hora_fin?.slice(0,5)}
                  </span>
                </div>
                {asignacion.aula && (
                  <div className="mb-2 d-flex align-items-center gap-2 text-muted">
                    <Icons.MapPin />
                    <span>{asignacion.aula}</span>
                  </div>
                )}
                <div className="mb-2 d-flex align-items-center gap-2 text-muted">
                  <Icons.Calendar />
                  <span>
                    {asignacion.fecha_inicio?.slice(0,10)} - {asignacion.fecha_fin?.slice(0,10)}
                  </span>
                </div>
                {asignacion.max_alumnos && (
                  <div className="mb-2 d-flex align-items-center gap-2 text-muted">
                    <Icons.Users />
                    <span>Máx. {asignacion.max_alumnos} alumnos</span>
                  </div>
                )}
                {asignacion.notas && (
                  <div className="alert alert-secondary py-2 px-3 mt-2 d-flex align-items-start gap-2">
                    <Icons.FileText />
                    <span>{asignacion.notas}</span>
                  </div>
                )}
              </div>
              <div className="card-footer bg-light d-flex justify-content-end gap-2">
                <button
                  onClick={() => handleEdit(idx)}
                  className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                >
                  <Icons.Edit /> Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(asignacion.id)}
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
                >
                  <Icons.Trash /> Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
        {asignacionesFiltradas.length === 0 && (
          <div className="col-12">
            <div className="text-center py-5">
              <div className="mb-3">
                <Icons.GraduationCap />
              </div>
              <h3 className="h5 mb-2 text-muted">No hay asignaciones registradas</h3>
              <p className="text-secondary mb-4">Comienza creando tu primera asignación de profesor-asignatura</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn btn-primary"
              >
                Crear Primera Asignación
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfesoresAsignaturas;