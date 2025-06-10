import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUserPlus, FaUserGraduate, FaSearch, FaSave, FaTimes, FaUsers, FaPencilAlt, FaChalkboardTeacher, FaCalendarAlt, FaClock } from 'react-icons/fa';

const AsignacionEstudiantes = ({ usuarios, profesores, token, showError, showSuccess }) => {
  // Estados
  const [estudiantes, setEstudiantes] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [cursosProfesores, setCursosProfesores] = useState([]);
  const [capacidadCursos, setCapacidadCursos] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    estudianteId: '',
    profesorId: '',
    asignacionId: '' // ID de la asignación curso-profesor
  });
  const [showForm, setShowForm] = useState(false);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [animacionActiva, setAnimacionActiva] = useState(false);

  // Obtener estudiantes del listado de usuarios
  useEffect(() => {
    if (usuarios && Array.isArray(usuarios)) {
      setEstudiantes(usuarios.filter(u => u.rol === 'estudiante'));
    }
  }, [usuarios]);

  // Efecto para la animación
  useEffect(() => {
    setAnimacionActiva(true);
    const timer = setTimeout(() => {
      setAnimacionActiva(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  // Cargar asignaciones actuales
  const fetchAsignaciones = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/asignaciones-estudiantes`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Para cada asignación, buscar los detalles del curso-profesor
      const asignacionesConDetalles = await Promise.all(response.data.map(async (asignacion) => {
        try {
          // Obtener los detalles de la asignación curso-profesor
          const detallesResponse = await axios.get(
            `${process.env.REACT_APP_API_URL || 'http://localhost:3007'}/asignaciones/${asignacion.asignacionId}`,
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
          return { ...asignacion, detallesCurso: detallesResponse.data };
        } catch (error) {
          console.error('Error obteniendo detalles del curso:', error);
          return asignacion;
        }
      }));
      
      setAsignaciones(asignacionesConDetalles);
      
      // Calcular la capacidad actual de cada curso
      const capacidadActual = {};
      asignacionesConDetalles.forEach(asignacion => {
        if (asignacion.asignacionId) {
          const cursoId = asignacion.asignacionId;
          capacidadActual[cursoId] = (capacidadActual[cursoId] || 0) + 1;
        }
      });
      setCapacidadCursos(capacidadActual);
      
    } catch (error) {
      showError(error.response?.data?.message || 'Error al cargar las asignaciones de estudiantes');
      console.error('Error cargando asignaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar cursos con profesores
  const fetchCursosProfesores = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:3007'}/cursos-con-profesor`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCursosProfesores(response.data);
    } catch (error) {
      console.error('Error cargando cursos con profesores:', error);
      showError('Error al cargar los cursos disponibles');
    }
  };

  useEffect(() => {
    fetchAsignaciones();
    fetchCursosProfesores();
  }, [token]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Manejar la creación de una nueva asignación
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Verificar si el curso está lleno
    const cursoSeleccionado = cursosProfesores.find(cp => cp.id.toString() === formData.asignacionId);
    const capacidadActual = capacidadCursos[formData.asignacionId] || 0;
    
    if (cursoSeleccionado && capacidadActual >= cursoSeleccionado.max_alumnos) {
      showError('Este curso ya ha alcanzado su capacidad máxima de alumnos');
      setLoading(false);
      return;
    }
    
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/asignaciones-estudiantes`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      showSuccess('Estudiante asignado correctamente');
      setFormData({ estudianteId: '', profesorId: '', asignacionId: '' });
      setShowForm(false);
      fetchAsignaciones();
      setAnimacionActiva(true);
      setTimeout(() => setAnimacionActiva(false), 3000);
    } catch (error) {
      showError(error.response?.data?.message || 'Error al asignar estudiante');
      console.error('Error en asignación:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar asignación
  const handleDeleteAsignacion = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta asignación?')) return;
    
    setLoading(true);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/asignaciones-estudiantes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      showSuccess('Asignación eliminada correctamente');
      fetchAsignaciones();
    } catch (error) {
      showError(error.response?.data?.message || 'Error al eliminar la asignación');
      console.error('Error eliminando asignación:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar asignaciones por término de búsqueda
  const filteredAsignaciones = asignaciones.filter(asignacion => {
    const estudiante = estudiantes.find(e => e._id === asignacion.estudianteId);
    const profesor = profesores.find(p => p._id === asignacion.profesorId);
    
    const estudianteNombre = estudiante ? estudiante.nombre.toLowerCase() : '';
    const profesorNombre = profesor ? profesor.nombre.toLowerCase() : '';
    
    return estudianteNombre.includes(searchTerm.toLowerCase()) || 
           profesorNombre.includes(searchTerm.toLowerCase());
  });

  // Obtener nombre de estudiante por ID
  const getEstudianteNombre = (id) => {
    const estudiante = estudiantes.find(e => e._id === id);
    return estudiante ? estudiante.nombre : 'Estudiante desconocido';
  };

  // Obtener nombre de profesor por ID
  const getProfesorNombre = (id) => {
    const profesor = profesores.find(p => p._id === id);
    return profesor ? profesor.nombre : 'Profesor desconocido';
  };

  // Mostrar detalles de un curso específico
  const verDetallesCurso = (curso) => {
    setCursoSeleccionado(curso);
  };

  return (
    <div className="container-fluid py-4 position-relative">
      <div className="row g-4">
        {/* Panel principal - Asignaciones */}
        <div className="col-lg-9">
          <div className="card shadow border-0 rounded-4 h-100">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center rounded-top-4">
              <h5 className="mb-0">
                <FaUserGraduate className="me-2" />
                Asignación de Estudiantes a Profesores
              </h5>
              <button 
                className="btn btn-light btn-sm rounded-pill px-3"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? <><FaTimes className="me-1" /> Cancelar</> : <><FaUserPlus className="me-1" /> Nueva Asignación</>}
              </button>
            </div>
            
            <div className="card-body">
              {/* Formulario para agregar nueva asignación */}
              {showForm && (
                <div className="card mb-4 border-0 shadow-sm rounded-3 animate__animated animate__fadeIn">
                  <div className="card-header bg-primary bg-opacity-10 border-0 rounded-top-3">
                    <h6 className="mb-0 fw-bold text-primary">
                      <FaUserPlus className="me-2" />
                      Nueva Asignación de Estudiante
                    </h6>
                  </div>
                  <div className="card-body bg-light bg-opacity-50 rounded-bottom-3">
                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label htmlFor="estudianteId" className="form-label fw-medium">
                            <FaUserGraduate className="me-1 text-primary" />
                            Estudiante
                          </label>
                          <select
                            id="estudianteId"
                            name="estudianteId"
                            className="form-select border-0 shadow-sm"
                            value={formData.estudianteId}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Seleccionar Estudiante</option>
                            {estudiantes.map(estudiante => (
                              <option key={estudiante._id} value={estudiante._id}>
                                {estudiante.nombre}
                              </option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="col-md-6">
                          <label htmlFor="asignacionId" className="form-label fw-medium">
                            <FaChalkboardTeacher className="me-1 text-primary" />
                            Curso-Profesor
                          </label>
                          <select
                            id="asignacionId"
                            name="asignacionId"
                            className="form-select border-0 shadow-sm"
                            value={formData.asignacionId}
                            onChange={(e) => {
                              const selectedCursoProfesor = cursosProfesores.find(cp => cp.id.toString() === e.target.value);
                              setFormData({
                                ...formData,
                                asignacionId: e.target.value,
                                profesorId: selectedCursoProfesor ? profesores.find(p => p.nombre === selectedCursoProfesor.profesor)?._id : ''
                              });
                            }}
                            required
                          >
                            <option value="">Seleccionar Curso y Profesor</option>
                            {cursosProfesores.map(cp => {
                              const capacidadActual = capacidadCursos[cp.id] || 0;
                              const estaLleno = capacidadActual >= cp.max_alumnos;
                              
                              return (
                                <option 
                                  key={cp.id} 
                                  value={cp.id}
                                  disabled={estaLleno}
                                  className={estaLleno ? "text-danger" : ""}
                                >
                                  {cp.nombre} - {cp.profesor} ({cp.dia_semana}, {cp.hora_inicio}-{cp.hora_fin})
                                  {estaLleno ? ' [LLENO]' : ` [${capacidadActual}/${cp.max_alumnos}]`}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                        
                        <div className="col-md-2 d-flex align-items-end">
                          <button 
                            type="submit" 
                            className="btn btn-primary w-100 rounded-pill shadow-sm"
                            disabled={loading}
                          >
                            {loading ? (
                              <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                            ) : (
                              <FaSave className="me-1" />
                            )}
                            Guardar
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
              
              {/* Buscador */}
              <div className="mb-4">
                <div className="input-group shadow-sm rounded-pill overflow-hidden">
                  <span className="input-group-text border-0 bg-light">
                    <FaSearch className="text-muted" />
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 bg-light"
                    placeholder="Buscar por nombre de estudiante o profesor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Tabla de asignaciones */}
              <div className="table-responsive rounded-3 shadow-sm">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th className="border-0">Estudiante</th>
                      <th className="border-0">Profesor</th>
                      <th className="border-0">Curso</th>
                      <th className="border-0">Horario</th>
                      <th className="border-0">Período</th>
                      <th className="border-0">Capacidad</th>
                      <th className="border-0">Fecha Asignación</th>
                      <th className="border-0 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div className="spinner-grow text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                          </div>
                          <p className="text-muted mt-3">Cargando asignaciones...</p>
                        </td>
                      </tr>
                    ) : filteredAsignaciones.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-5">
                          <div className="text-muted">
                            <FaUsers className="fs-1 mb-3 text-secondary opacity-50" />
                            <p>No hay asignaciones disponibles</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredAsignaciones.map((asignacion) => (
                        <tr key={asignacion._id} className="align-middle">
                          <td className="fw-medium">{getEstudianteNombre(asignacion.estudianteId)}</td>
                          <td>{getProfesorNombre(asignacion.profesorId)}</td>
                          <td>
                            <span className="badge bg-info bg-opacity-25 text-info px-2 py-1 fw-normal">
                              {asignacion.detallesCurso?.curso_nombre || 'No disponible'}
                            </span>
                          </td>
                          <td>
                            {asignacion.detallesCurso ? (
                              <div className="d-flex align-items-center">
                                <FaClock className="text-secondary me-1" />
                                <span>
                                  {asignacion.detallesCurso.dia_semana}<br />
                                  {asignacion.detallesCurso.hora_inicio} - {asignacion.detallesCurso.hora_fin}
                                </span>
                              </div>
                            ) : 'No disponible'}
                          </td>
                          <td>
                            {asignacion.detallesCurso ? (
                              <div className="d-flex align-items-center">
                                <FaCalendarAlt className="text-secondary me-1" />
                                <span>
                                  {new Date(asignacion.detallesCurso.fecha_inicio).toLocaleDateString()} -<br />
                                  {new Date(asignacion.detallesCurso.fecha_fin).toLocaleDateString()}
                                </span>
                              </div>
                            ) : 'No disponible'}
                          </td>
                          <td className="text-center">
                            {asignacion.detallesCurso?.max_alumnos || 'N/A'}
                          </td>
                          <td>
                            {new Date(asignacion.fechaAsignacion).toLocaleDateString()}
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-danger rounded-pill"
                              onClick={() => handleDeleteAsignacion(asignacion._id)}
                              disabled={loading}
                            >
                              <FaTimes className="me-1" />
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        
        {/* Panel lateral - Capacidad de los cursos */}
        <div className="col-lg-3">
          <div className="card shadow border-0 rounded-4 h-100">
            <div className="card-header bg-info text-white rounded-top-4">
              <h5 className="mb-0">
                <FaUsers className="me-2" />
                Capacidad de Cursos
              </h5>
            </div>
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                {cursosProfesores.map(curso => {
                  const capacidadActual = capacidadCursos[curso.id] || 0;
                  const porcentajeOcupacion = (capacidadActual / curso.max_alumnos) * 100;
                  
                  let claseProgreso = "bg-success";
                  if (porcentajeOcupacion >= 90) claseProgreso = "bg-danger";
                  else if (porcentajeOcupacion >= 70) claseProgreso = "bg-warning";
                  
                  const estaSeleccionado = cursoSeleccionado && cursoSeleccionado.id === curso.id;
                  
                  return (
                    <li 
                      key={curso.id} 
                      className={`list-group-item border-0 border-bottom ${estaSeleccionado ? 'bg-light' : ''} px-3 py-3`}
                      onClick={() => verDetallesCurso(curso)}
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => e.currentTarget.classList.add('bg-light')}
                      onMouseLeave={(e) => !estaSeleccionado && e.currentTarget.classList.remove('bg-light')}
                    >
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <h6 className="mb-0 fw-bold">{curso.nombre}</h6>
                        <span className="badge bg-primary rounded-pill px-2">{curso.profesor}</span>
                      </div>
                      <div className="text-muted small d-flex align-items-center mb-2">
                        <FaClock className="me-1" />
                        {curso.dia_semana}, {curso.hora_inicio} - {curso.hora_fin}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <span className="small fw-medium">
                          {capacidadActual} de {curso.max_alumnos} alumnos
                        </span>
                        <span className={`badge ${capacidadActual >= curso.max_alumnos ? "bg-danger" : "bg-success"} rounded-pill px-2`}>
                          {capacidadActual >= curso.max_alumnos ? "Lleno" : "Disponible"}
                        </span>
                      </div>
                      <div className="progress mt-2 rounded-pill" style={{height: "6px"}}>
                        <div 
                          className={`progress-bar ${claseProgreso} rounded-pill`} 
                          role="progressbar" 
                          style={{width: `${Math.min(100, porcentajeOcupacion)}%`}}
                          aria-valuenow={capacidadActual} 
                          aria-valuemin="0" 
                          aria-valuemax={curso.max_alumnos}
                        ></div>
                      </div>
                    </li>
                  );
                })}
                {cursosProfesores.length === 0 && (
                  <li className="list-group-item text-center text-muted py-5 border-0">
                    <div className="text-center">
                      <FaChalkboardTeacher className="display-5 text-muted opacity-25 mb-3" />
                      <p>No hay cursos disponibles</p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animación del lápiz escribiendo en la esquina inferior derecha */}
      <div 
        className="position-fixed bottom-0 end-0 mb-4 me-4"
        style={{ zIndex: 1000, pointerEvents: 'none' }}
      >
        <div className={`writing-animation ${animacionActiva ? 'active' : ''}`}>
          <div className="pencil-container">
            <div className="pencil">
              <div className="pencil-cap"></div>
              <div className="pencil-body"></div>
              <div className="pencil-point"></div>
            </div>
            <div className="paper">
              <div className="paper-content">
                <div className="line line-1"></div>
                <div className="line line-2"></div>
                <div className="line line-3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estilos para la animación del lápiz */}
      <style jsx>{`
        .writing-animation {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .writing-animation.active {
          opacity: 1;
          transform: translateY(0);
        }
        
        .pencil-container {
          position: relative;
          width: 120px;
          height: 120px;
        }
        
        .pencil {
          position: absolute;
          width: 14px;
          height: 80px;
          top: 0;
          left: 50px;
          transform: rotate(45deg);
          animation: write 2s linear infinite;
          transform-origin: bottom;
        }
        
        .pencil-cap {
          position: absolute;
          width: 14px;
          height: 8px;
          background: #ff6b6b;
          top: 0;
          border-radius: 2px 2px 0 0;
        }
        
        .pencil-body {
          position: absolute;
          width: 14px;
          height: 60px;
          background: #4dabf7;
          top: 8px;
        }
        
        .pencil-point {
          position: absolute;
          width: 14px;
          height: 12px;
          background: #495057;
          bottom: 0;
          clip-path: polygon(0 0, 100% 0, 50% 100%);
        }
        
        .paper {
          position: absolute;
          width: 100px;
          height: 80px;
          background: #f8f9fa;
          border-radius: 3px;
          bottom: 0;
          left: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        
        .paper-content {
          padding: 15px 10px;
        }
        
        .line {
          height: 3px;
          background: #e9ecef;
          margin-bottom: 10px;
          border-radius: 2px;
          animation: line-width 2s infinite alternate;
        }
        
        .line-1 {
          width: 60%;
        }
        
        .line-2 {
          width: 80%;
          animation-delay: 0.5s;
        }
        
        .line-3 {
          width: 40%;
          animation-delay: 1s;
        }
        
        @keyframes write {
          0%, 100% { transform: rotate(45deg) translateY(-5px); }
          50% { transform: rotate(45deg) translateY(5px); }
        }
        
        @keyframes line-width {
          0% { width: 20%; }
          100% { width: 80%; }
        }
      `}</style>
      
      {/* Modal para detalles del curso */}
      {cursoSeleccionado && (
        <div 
          className="modal fade show" 
          style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} 
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow rounded-4">
              <div className="modal-header bg-info text-white border-0 rounded-top-4">
                <h5 className="modal-title">
                  <FaChalkboardTeacher className="me-2" />
                  Detalles del Curso
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setCursoSeleccionado(null)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between mb-3">
                  <h4 className="fw-bold mb-0">{cursoSeleccionado.nombre}</h4>
                  <span className="badge bg-primary rounded-pill fs-6">{cursoSeleccionado.profesor}</span>
                </div>
                
                <div className="card bg-light border-0 rounded-3 mb-3">
                  <div className="card-body">
                    <div className="mb-3">
                      <h6 className="text-muted mb-2">Horario</h6>
                      <div className="d-flex align-items-center">
                        <FaClock className="text-info me-2 fs-5" />
                        <span className="fs-5">{cursoSeleccionado.dia_semana}, {cursoSeleccionado.hora_inicio} - {cursoSeleccionado.hora_fin}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h6 className="text-muted mb-2">Período</h6>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="text-info me-2 fs-5" />
                        <span className="fs-5">
                          {new Date(cursoSeleccionado.fecha_inicio).toLocaleDateString()} - 
                          {new Date(cursoSeleccionado.fecha_fin).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="text-muted mb-2">Capacidad</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fs-5 fw-medium">
                          {(capacidadCursos[cursoSeleccionado.id] || 0)} de {cursoSeleccionado.max_alumnos} alumnos
                        </span>
                        <span className={`badge ${capacidadCursos[cursoSeleccionado.id] >= cursoSeleccionado.max_alumnos ? 
                          "bg-danger" : "bg-success"} fs-6 px-3 py-2`}>
                          {capacidadCursos[cursoSeleccionado.id] >= cursoSeleccionado.max_alumnos ? "Lleno" : "Disponible"}
                        </span>
                      </div>
                      
                      <div className="progress mt-3 rounded-pill" style={{height: "10px"}}>
                        <div 
                          className={`progress-bar ${
                            capacidadCursos[cursoSeleccionado.id] >= cursoSeleccionado.max_alumnos ? "bg-danger" :
                            (capacidadCursos[cursoSeleccionado.id] || 0) / cursoSeleccionado.max_alumnos >= 0.7 ? "bg-warning" : "bg-success"
                          } rounded-pill`} 
                          role="progressbar" 
                          style={{width: `${Math.min(100, ((capacidadCursos[cursoSeleccionado.id] || 0) / cursoSeleccionado.max_alumnos) * 100)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button 
                  type="button" 
                  className="btn btn-secondary rounded-pill px-4" 
                  onClick={() => setCursoSeleccionado(null)}
                >
                  Cerrar
                </button>
                {(capacidadCursos[cursoSeleccionado.id] || 0) < cursoSeleccionado.max_alumnos && (
                  <button 
                    type="button" 
                    className="btn btn-primary rounded-pill px-4" 
                    onClick={() => {
                      setFormData({
                        ...formData,
                        asignacionId: cursoSeleccionado.id.toString(),
                        profesorId: profesores.find(p => p.nombre === cursoSeleccionado.profesor)?._id || ''
                      });
                      setShowForm(true);
                      setCursoSeleccionado(null);
                    }}
                  >
                    <FaUserPlus className="me-1" />
                    Asignar Estudiante
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AsignacionEstudiantes;