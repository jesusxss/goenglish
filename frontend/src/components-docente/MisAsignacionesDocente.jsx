<<<<<<< HEAD
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  FaBook, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
  FaUsers, FaChalkboardTeacher, FaRegBell, FaFilter,
  FaCalendarDay, FaChevronRight, FaInfoCircle, FaRegClock,
  FaCalendarCheck, FaLayerGroup, FaStream, FaGraduationCap,
  FaSyncAlt, FaSearchPlus, FaAngleDown, FaBuilding,
  FaMoon, FaSun, FaRegLightbulb, FaCircle
} from 'react-icons/fa';
import axios from 'axios';
import { Card, Badge, Row, Col, Alert, Button, Spinner, ProgressBar } from 'react-bootstrap';
=======
import React, { useState, useEffect } from 'react';
import { 
  FaBook, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
  FaUsers, FaChalkboardTeacher, FaRegStar, 
  FaStar, FaCalendarDay, FaChevronRight 
} from 'react-icons/fa';
import axios from 'axios';
import { Card, Badge, Row, Col, Alert, Button, Spinner, Accordion } from 'react-bootstrap';
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde

const MisAsignacionesDocente = ({   
  asignaciones: initialAsignaciones,
  loading: parentLoading,
  error: parentError,
  token,
  userInfo,
  showError,
  showSuccess 
}) => {
<<<<<<< HEAD
  // Referencias para evitar actualizaciones innecesarias
  const initialDataProcessed = useRef(false);
  const fetchInProgress = useRef(false);

=======
  console.log("Asignaciones recibidas:", initialAsignaciones); // Para depuración
  
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
  const [localAsignaciones, setLocalAsignaciones] = useState(initialAsignaciones || []);
  const [loading, setLoading] = useState(parentLoading);
  const [error, setError] = useState(parentError);
  const [cursosPorDia, setCursosPorDia] = useState({});
  const [horarioActivo, setHorarioActivo] = useState(true);
<<<<<<< HEAD
  const [filtroActivo, setFiltroActivo] = useState('todos');
  const [modoOscuro, setModoOscuro] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCalendario, setShowCalendario] = useState(true);
  
  // Función para organizar cursos por día
  const organizarCursosPorDia = useCallback((asignaciones) => {
    if (!asignaciones || asignaciones.length === 0) return;
    
    const diasOrden = {
      "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4,
      "Viernes": 5, "Sábado": 6, "Domingo": 7
=======

  // Cargar asignaciones si no tenemos ninguna
  const fetchAsignaciones = async () => {
    if (!token || !userInfo) {
      setError("No hay información de usuario o token disponible");
      return;
    }
    
    setLoading(true);
    try {
      // Usamos la URL para obtener asignaciones directamente del backend específico
      const response = await axios.get('http://18.222.195.94:3007/asignaciones', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Respuesta completa del servidor:", response.data);
      
      // El backend ya filtra por profesor basado en el token
      let asignacionesData = [];
      if (response.data && response.data.data) {
        // Si viene en formato { success: true, data: [...] }
        asignacionesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Si viene como array directo
        asignacionesData = response.data;
      }
      
      console.log("Asignaciones procesadas:", asignacionesData);
      setLocalAsignaciones(asignacionesData);
      
      // Organizar los cursos por día de la semana
      organizarCursosPorDia(asignacionesData);
      
      if (asignacionesData.length === 0) {
        console.log("No se encontraron asignaciones para el profesor:", userInfo.nombre);
      }
      
    } catch (err) {
      console.error('Error al cargar asignaciones:', err);
      
      // Manejo específico del error 403
      if (err.response && err.response.status === 403) {
        setError('No tienes permisos para ver estas asignaciones. Contacta al administrador.');
        showError && showError('Error de permisos: No puedes acceder a estas asignaciones');
      } else {
        setError(err.response?.data?.error || 'Error al cargar las asignaciones.');
        showError && showError('Error al cargar las asignaciones');
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para organizar cursos por día de la semana
  const organizarCursosPorDia = (asignaciones) => {
    const diasOrden = {
      "Lunes": 1,
      "Martes": 2,
      "Miércoles": 3,
      "Jueves": 4,
      "Viernes": 5,
      "Sábado": 6,
      "Domingo": 7
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
    };

    // Agrupar por día
    const porDia = {};
    asignaciones.forEach(asignacion => {
      const dia = asignacion.dia_semana;
      if (!porDia[dia]) {
        porDia[dia] = [];
      }
      porDia[dia].push(asignacion);
    });

    // Ordenar los cursos por hora de inicio para cada día
    Object.keys(porDia).forEach(dia => {
      porDia[dia].sort((a, b) => {
        return a.hora_inicio.localeCompare(b.hora_inicio);
      });
    });

    // Ordenar los días de la semana
    const diasOrdenados = {};
    Object.keys(porDia)
      .sort((a, b) => diasOrden[a] - diasOrden[b])
      .forEach(dia => {
        diasOrdenados[dia] = porDia[dia];
      });

    setCursosPorDia(diasOrdenados);
<<<<<<< HEAD
  }, []);

  // Cargar asignaciones
  const fetchAsignaciones = useCallback(async () => {
    if (!token || !userInfo) {
      setError("No hay información de usuario o token disponible");
      return;
    }
    
    if (fetchInProgress.current) return;
    fetchInProgress.current = true;
    
    setLoading(true);
    try {
      const response = await axios.get('http://3.15.145.16:3007/asignaciones', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let asignacionesData = [];
      if (response.data && response.data.data) {
        asignacionesData = response.data.data;
      } else if (Array.isArray(response.data)) {
        asignacionesData = response.data;
      }
      
      setLocalAsignaciones(asignacionesData);
      organizarCursosPorDia(asignacionesData);
      
      if (asignacionesData.length > 0) {
        showSuccess && showSuccess('Datos de horario actualizados');
      }
    } catch (err) {
      console.error('Error al cargar asignaciones:', err);
      
      if (err.response && err.response.status === 403) {
        setError('No tienes permisos para ver estas asignaciones.');
        showError && showError('Error de permisos al acceder a tus asignaciones');
      } else {
        setError(err.response?.data?.error || 'Error al cargar las asignaciones.');
        showError && showError('Error al cargar tu horario');
      }
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [token, userInfo, organizarCursosPorDia, showError, showSuccess]);

  // Efecto inicial para cargar datos
  useEffect(() => {
    if (!initialDataProcessed.current && initialAsignaciones && initialAsignaciones.length > 0) {
      setLocalAsignaciones(initialAsignaciones);
      organizarCursosPorDia(initialAsignaciones);
      initialDataProcessed.current = true;
    } else if (!initialDataProcessed.current && token && userInfo && !fetchInProgress.current) {
      fetchAsignaciones();
      initialDataProcessed.current = true;
    }
  }, [initialAsignaciones, token, userInfo, fetchAsignaciones, organizarCursosPorDia]);
=======
  };

  // Actualizar cuando cambian las props
  useEffect(() => {
    if (initialAsignaciones && initialAsignaciones.length > 0) {
      console.log("Usando asignaciones proporcionadas como prop:", initialAsignaciones.length);
      setLocalAsignaciones(initialAsignaciones);
      organizarCursosPorDia(initialAsignaciones);
    } else if (token && userInfo) {
      console.log("No hay asignaciones proporcionadas, cargando del servidor...");
      // Solo cargar si tenemos token y no hay datos
      fetchAsignaciones();
    }
  }, [initialAsignaciones, token, userInfo]);
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde

  // Obtener el color para cada día
  const getColorForDay = (day) => {
    const colors = {
<<<<<<< HEAD
      "Lunes": "#4361EE",      // Azul
      "Martes": "#3A0CA3",     // Púrpura
      "Miércoles": "#7209B7",  // Violeta
      "Jueves": "#F72585",     // Rosa
      "Viernes": "#4CC9F0",    // Celeste
      "Sábado": "#4D908E",     // Verde azulado
      "Domingo": "#F94144"     // Rojo
    };
    return colors[day] || "#4361EE"; // Azul por defecto
=======
      "Lunes": "#28a745",      // Verde
      "Martes": "#007bff",     // Azul
      "Miércoles": "#6f42c1",  // Púrpura
      "Jueves": "#fd7e14",     // Naranja
      "Viernes": "#e83e8c",    // Rosa
      "Sábado": "#20c997",     // Verde agua
      "Domingo": "#dc3545"     // Rojo
    };
    return colors[day] || "#28a745"; // Verde por defecto
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
  };

  // Función para obtener el día actual de la semana en español
  const getDiaActual = () => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[new Date().getDay()];
  };

<<<<<<< HEAD
  // Calcular estadísticas
  const getStats = useCallback(() => {
    if (!localAsignaciones || localAsignaciones.length === 0) {
      return { totalCursos: 0, diasUnicos: 0, horasTotales: 0 };
    }
    
    const totalCursos = localAsignaciones.length;
    const diasUnicos = new Set(localAsignaciones.map(a => a.dia_semana)).size;
    const horasTotales = localAsignaciones.reduce((total, curso) => {
      if (!curso.hora_inicio || !curso.hora_fin) return total;
      
      try {
        const [horaIni, minIni] = curso.hora_inicio.split(':').map(Number);
        const [horaFin, minFin] = curso.hora_fin.split(':').map(Number);
        const totalMinIni = horaIni * 60 + minIni;
        const totalMinFin = horaFin * 60 + minFin;
        const diffMin = totalMinFin - totalMinIni;
        return total + diffMin;
      } catch (e) {
        return total;
      }
    }, 0);
    
    return {
      totalCursos,
      diasUnicos,
      horasTotales: Math.round(horasTotales / 60)
    };
  }, [localAsignaciones]);
  
  // Filtrar asignaciones
  const asignacionesFiltradas = useCallback(() => {
    if (filtroActivo === 'todos') {
      return localAsignaciones || [];
    } else if (filtroActivo === 'hoy') {
      return (localAsignaciones || []).filter(a => a.dia_semana === getDiaActual());
    }
    return localAsignaciones || [];
  }, [localAsignaciones, filtroActivo]);

  // Calcular valores una vez por renderizado
  const stats = getStats();
  const asignacionesFiltered = asignacionesFiltradas();
  const diaActual = getDiaActual();

  // Manejador para actualización manual
  const handleManualUpdate = () => {
    initialDataProcessed.current = false;
    fetchAsignaciones();
  };

  // Control del modo oscuro
  const toggleModoOscuro = () => {
    setModoOscuro(!modoOscuro);
  };

  // Ver detalles de un curso
  const handleVerDetalles = (curso) => {
    setSelectedCourse(curso);
  };

  // Cerrar detalles
  const handleCloseDetails = () => {
    setSelectedCourse(null);
  };

  // Clases CSS basadas en el modo oscuro/claro
  const themeClass = modoOscuro ? 'dark-theme' : 'light-theme';
  const bgClass = modoOscuro ? 'bg-dark text-light' : 'bg-light text-dark';
  const cardClass = modoOscuro ? 'bg-dark-card text-light' : 'bg-white';
  const borderClass = modoOscuro ? 'border-dark' : 'border-light';
  
  // Colores del tema
  const themeColors = {
    primary: modoOscuro ? '#6366f1' : '#4361EE',
    secondary: modoOscuro ? '#334155' : '#f9fafb',
    accent: modoOscuro ? '#f472b6' : '#F72585',
    text: modoOscuro ? '#e2e8f0' : '#1e293b',
    border: modoOscuro ? '#334155' : '#e5e7eb',
    cardBg: modoOscuro ? '#1e293b' : '#ffffff',
    cardBorder: modoOscuro ? '#334155' : '#f3f4f6'
  };

  return (
    <div className={`schedule-container ${themeClass}`}>
      {/* Panel lateral y contenido principal */}
      <div className="schedule-layout">
        {/* Panel lateral */}
        <div className="schedule-sidebar">
          <div className="sidebar-header">
            <div className="app-logo">
              <div className="logo-icon">
                <FaChalkboardTeacher size={28} />
              </div>
              <div className="logo-text">
                <h1>GoEnglish</h1>
                <span>Docente</span>
              </div>
            </div>
          </div>

          <div className="sidebar-menu">
            <div className="sidebar-section">
              <span className="section-title">Vistas</span>
              <ul className="menu-list">
                <li className={`menu-item ${horarioActivo ? 'active' : ''}`} onClick={() => setHorarioActivo(true)}>
                  <div className="menu-icon"><FaCalendarCheck /></div>
                  <span>Vista Calendario</span>
                </li>
                <li className={`menu-item ${!horarioActivo ? 'active' : ''}`} onClick={() => setHorarioActivo(false)}>
                  <div className="menu-icon"><FaLayerGroup /></div>
                  <span>Vista Tarjetas</span>
                </li>
              </ul>
            </div>

            <div className="sidebar-section">
              <span className="section-title">Filtros</span>
              <ul className="menu-list">
                <li className={`menu-item ${filtroActivo === 'todos' ? 'active' : ''}`} onClick={() => setFiltroActivo('todos')}>
                  <div className="menu-icon"><FaStream /></div>
                  <span>Todos los días</span>
                </li>
                <li className={`menu-item ${filtroActivo === 'hoy' ? 'active' : ''}`} onClick={() => setFiltroActivo('hoy')}>
                  <div className="menu-icon"><FaCalendarDay /></div>
                  <span>Solo hoy</span>
                </li>
              </ul>
            </div>

            <div className="sidebar-section">
              <span className="section-title">Estadísticas</span>
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-icon"><FaBook /></div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.totalCursos}</span>
                    <span className="stat-label">Cursos</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon"><FaCalendarAlt /></div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.diasUnicos}<span className="of-seven">/7</span></span>
                    <span className="stat-label">Días</span>
                  </div>
                </div>
                
                <div className="stat-item">
                  <div className="stat-icon"><FaClock /></div>
                  <div className="stat-info">
                    <span className="stat-value">{stats.horasTotales}h</span>
                    <span className="stat-label">Semanales</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="sidebar-footer">
            <button className="theme-toggle" onClick={toggleModoOscuro}>
              {modoOscuro ? <FaSun /> : <FaMoon />}
              <span>{modoOscuro ? 'Modo claro' : 'Modo oscuro'}</span>
            </button>
            
            <button className="refresh-button" onClick={handleManualUpdate} disabled={loading || fetchInProgress.current}>
              <FaSyncAlt className={loading ? 'spin' : ''} />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="schedule-content">
          {/* Header */}
          <div className="content-header">
            <div className="header-title">
              <h1>Mi Agenda Docente</h1>
              <p>Gestiona tus clases de manera eficiente</p>
            </div>
            
            <div className="day-indicator">
              <span className="day-label">Hoy es</span>
              <div className="current-day">
                <div className="day-icon" style={{backgroundColor: getColorForDay(diaActual)}}>
                  <FaCalendarDay />
                </div>
                <span className="day-name">{diaActual}</span>
              </div>
            </div>
          </div>

          {/* Mensaje de carga */}
          {loading && (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Cargando tu horario...</p>
            </div>
          )}

          {/* Mensaje de error */}
          {error && !loading && (
            <div className="error-message">
              <div className="error-icon">
                <FaRegBell />
              </div>
              <div className="error-content">
                <h3>No pudimos cargar tu horario</h3>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Estado vacío */}
          {!loading && !error && (!localAsignaciones || localAsignaciones.length === 0) && (
            <div className="empty-state">
              <div className="empty-icon">
                <FaBook />
              </div>
              <h3>No tienes cursos asignados</h3>
              <p>Todavía no se han registrado cursos para ti en el sistema. Cuando se te asignen cursos, aparecerán aquí.</p>
              <Button 
                className="update-button"
                onClick={handleManualUpdate} 
                disabled={loading || fetchInProgress.current}
              >
                <FaSyncAlt /> Actualizar
              </Button>
            </div>
          )}

          {/* Modal para detalles del curso */}
          {selectedCourse && (
            <div className="course-details-modal">
              <div className="modal-backdrop" onClick={handleCloseDetails}></div>
              <div className="modal-content">
                <div className="modal-header" style={{backgroundColor: getColorForDay(selectedCourse.dia_semana)}}>
                  <h3>{selectedCourse.curso_nombre}</h3>
                  <button className="close-button" onClick={handleCloseDetails}>&times;</button>
                </div>
                <div className="modal-body">
                  <div className="detail-group">
                    <div className="detail-icon">
                      <FaCalendarDay />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Día</span>
                      <span className="detail-value">{selectedCourse.dia_semana}</span>
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <div className="detail-icon">
                      <FaClock />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Horario</span>
                      <span className="detail-value">
                        {selectedCourse.hora_inicio?.slice(0,5) || "--:--"} - {selectedCourse.hora_fin?.slice(0,5) || "--:--"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <div className="detail-icon">
                      <FaMapMarkerAlt />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Aula</span>
                      <span className="detail-value">{selectedCourse.aula || "No asignada"}</span>
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <div className="detail-icon">
                      <FaUsers />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Capacidad</span>
                      <span className="detail-value">{selectedCourse.max_alumnos || "N/A"} estudiantes</span>
                    </div>
                  </div>
                  
                  <div className="detail-group">
                    <div className="detail-icon">
                      <FaCalendarAlt />
                    </div>
                    <div className="detail-content">
                      <span className="detail-label">Período</span>
                      <span className="detail-value">
                        {new Date(selectedCourse.fecha_inicio).toLocaleDateString()} - 
                        {new Date(selectedCourse.fecha_fin).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {selectedCourse.notas && (
                    <div className="notes-section">
                      <div className="note-header">
                        <FaInfoCircle />
                        <span>Notas</span>
                      </div>
                      <p>{selectedCourse.notas}</p>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <Button onClick={handleCloseDetails}>Cerrar</Button>
                </div>
              </div>
            </div>
          )}

          {/* Vista de calendario */}
          {horarioActivo && !loading && !error && localAsignaciones.length > 0 && (
            <div className="calendar-view">
              <div className="calendar-header">
                <button className="view-toggle" onClick={() => setShowCalendario(!showCalendario)}>
                  {showCalendario ? 'Vista Compacta' : 'Vista Calendario'}
                </button>
              </div>
              
              {showCalendario ? (
                <div className="calendar-grid">
                  {Object.keys(cursosPorDia).map(dia => (
                    <div className="calendar-day" key={dia}>
                      <div className="day-header" style={{backgroundColor: getColorForDay(dia)}}>
                        <h3>{dia}</h3>
                        <span className="class-count">{cursosPorDia[dia].length} clases</span>
                      </div>
                      
                      <div className="day-classes">
                        {cursosPorDia[dia].map((asignacion, index) => (
                          <div 
                            className="class-block" 
                            key={`${asignacion.id || index}-${dia}`}
                            onClick={() => handleVerDetalles(asignacion)}
                            style={{
                              borderLeft: `4px solid ${getColorForDay(dia)}`,
                              backgroundColor: `${getColorForDay(dia)}10`
                            }}
                          >
                            <div className="class-time">
                              <FaRegClock />
                              <span>{asignacion.hora_inicio?.slice(0,5) || "--:--"} - {asignacion.hora_fin?.slice(0,5) || "--:--"}</span>
                            </div>
                            
                            <div className="class-title">
                              <h4>{asignacion.curso_nombre || "Curso sin nombre"}</h4>
                            </div>
                            
                            <div className="class-details">
                              <div className="detail">
                                <FaBuilding />
                                <span>{asignacion.aula || "Sin aula"}</span>
                              </div>
                              
                              <div className="detail">
                                <FaUsers />
                                <span>{asignacion.max_alumnos || "-"} alumnos</span>
                              </div>
                            </div>
                            
                            <button className="view-details">
                              <span>Ver detalles</span>
                              <FaChevronRight />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="compact-view">
                  <div className="time-column">
                    <div className="time-header">Hora</div>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div className="time-slot" key={`time-${i+8}`}>
                        {`${i+8}:00`}
                      </div>
                    ))}
                  </div>
                  
                  {Object.keys(cursosPorDia).map(dia => (
                    <div className="day-column" key={dia}>
                      <div className="day-header" style={{backgroundColor: getColorForDay(dia)}}>{dia}</div>
                      <div className="day-slots">
                        {Array.from({ length: 12 }).map((_, i) => {
                          const hour = i + 8;
                          const classesInHour = cursosPorDia[dia].filter(c => {
                            const startHour = parseInt(c.hora_inicio?.split(':')[0] || 0);
                            return startHour === hour;
                          });
                          
                          return (
                            <div className="time-slot" key={`${dia}-${hour}`}>
                              {classesInHour.map((c, idx) => (
                                <div 
                                  className="compact-class" 
                                  key={`class-${dia}-${hour}-${idx}`}
                                  style={{backgroundColor: `${getColorForDay(dia)}50`}}
                                  onClick={() => handleVerDetalles(c)}
                                >
                                  <span className="compact-time">
                                    {c.hora_inicio?.slice(0,5)} - {c.hora_fin?.slice(0,5)}
                                  </span>
                                  <span className="compact-title">{c.curso_nombre}</span>
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Vista de tarjetas */}
          {!horarioActivo && !loading && !error && asignacionesFiltered.length > 0 && (
            <div className="cards-view">
              {asignacionesFiltered.map((asignacion, idx) => (
                <div 
                  className="course-card" 
                  key={`${asignacion.id || idx}-${asignacion.dia_semana || 'sin-dia'}`}
                  onClick={() => handleVerDetalles(asignacion)}
                >
                  <div className="card-header" style={{backgroundColor: getColorForDay(asignacion.dia_semana)}}>
                    <div className="day-badge">
                      <FaCalendarDay />
                      <span>{asignacion.dia_semana}</span>
                    </div>
                    <div className="time-badge">
                      <FaClock />
                      <span>{asignacion.hora_inicio?.slice(0,5)} - {asignacion.hora_fin?.slice(0,5)}</span>
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <h3 className="course-title">{asignacion.curso_nombre}</h3>
                    
                    <div className="card-details">
                      <div className="detail">
                        <FaMapMarkerAlt />
                        <span>{asignacion.aula || "Sin aula"}</span>
                      </div>
                      
                      <div className="detail">
                        <FaCalendarAlt />
                        <span>
                          {new Date(asignacion.fecha_inicio).toLocaleDateString()} - 
                          {new Date(asignacion.fecha_fin).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="detail">
                        <FaUsers />
                        <span>{asignacion.max_alumnos || "-"} estudiantes</span>
                      </div>
                    </div>
                    
                    {asignacion.notas && (
                      <div className="card-notes">
                        <FaInfoCircle />
                        <p>{asignacion.notas}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="card-footer">
                    <button className="details-button">
                      <span>Ver detalles</span>
                      <FaChevronRight />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS integrados */}
      <style jsx="true">{`
        /* Estilos base */
        :root {
          --primary-color: ${themeColors.primary};
          --secondary-color: ${themeColors.secondary};
          --accent-color: ${themeColors.accent};
          --text-color: ${themeColors.text};
          --border-color: ${themeColors.border};
          --card-bg: ${themeColors.cardBg};
          --card-border: ${themeColors.cardBorder};
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
          --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
          --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-lg: 16px;
          --transition: all 0.2s ease;
          --sidebar-width: 260px;
        }
        
        .dark-theme {
          --bg-color: #0f172a;
          --bg-secondary: #1e293b;
          --text-color: #e2e8f0;
          --text-secondary: #94a3b8;
          --border-color: #334155;
        }
        
        .light-theme {
          --bg-color: #f8fafc;
          --bg-secondary: #ffffff;
          --text-color: #1e293b;
          --text-secondary: #64748b;
          --border-color: #e2e8f0;
        }
        
        .schedule-container {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          color: var(--text-color);
          background-color: var(--bg-color);
          min-height: 100vh;
        }
        
        /* Layout */
        .schedule-layout {
          display: flex;
          min-height: 100vh;
        }
        
        /* Sidebar */
        .schedule-sidebar {
          width: var(--sidebar-width);
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
        }
        
        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .app-logo {
          display: flex;
          align-items: center;
        }
        
        .logo-icon {
          width: 40px;
          height: 40px;
          background-color: var(--primary-color);
          color: white;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }
        
        .logo-text h1 {
          font-size: 1.2rem;
          font-weight: 600;
          margin: 0;
          line-height: 1.2;
        }
        
        .logo-text span {
          font-size: 0.8rem;
          opacity: 0.8;
        }
        
        .sidebar-menu {
          flex: 1;
          padding: 1.5rem;
        }
        
        .sidebar-section {
          margin-bottom: 2rem;
        }
        
        .section-title {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          opacity: 0.6;
          margin-bottom: 0.75rem;
          display: block;
        }
        
        .menu-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .menu-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .menu-item:hover {
          background-color: rgba(99, 102, 241, 0.1);
        }
        
        .menu-item.active {
          background-color: rgba(99, 102, 241, 0.15);
          font-weight: 500;
          color: var(--primary-color);
        }
        
        .menu-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 12px;
        }
        
        .stats-container {
          background-color: rgba(99, 102, 241, 0.08);
          border-radius: var(--radius-md);
          padding: 1rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 0.5rem;
          border-radius: var(--radius-sm);
          transition: var(--transition);
        }
        
        .stat-item:hover {
          background-color: rgba(99, 102, 241, 0.1);
        }
        
        .stat-icon {
          width: 32px;
          height: 32px;
          background-color: rgba(99, 102, 241, 0.2);
          color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        
        .stat-info {
          text-align: center;
        }
        
        .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
          display: block;
          line-height: 1;
          margin-bottom: 0.25rem;
        }
        
        .of-seven {
          font-size: 0.8rem;
          opacity: 0.7;
          font-weight: normal;
        }
        
        .stat-label {
          font-size: 0.75rem;
          opacity: 0.8;
        }
        
        .sidebar-footer {
          padding: 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        
        .theme-toggle, .refresh-button {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .theme-toggle:hover, .refresh-button:hover {
          background-color: rgba(99, 102, 241, 0.1);
        }
        
        .theme-toggle svg, .refresh-button svg {
          margin-right: 0.75rem;
        }
        
        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spin {
          animation: spin 1s infinite linear;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        /* Content */
        .schedule-content {
          flex: 1;
          padding: 2rem;
          background-color: var(--bg-color);
          overflow-y: auto;
        }
        
        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        
        .header-title h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }
        
        .header-title p {
          margin: 0;
          opacity: 0.7;
        }
        
        .day-indicator {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        
        .day-label {
          font-size: 0.85rem;
          opacity: 0.7;
          margin-bottom: 0.25rem;
        }
        
        .current-day {
          display: flex;
          align-items: center;
          background-color: var(--bg-secondary);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
        }
        
        .day-icon {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
          color: white;
        }
        
        .day-name {
          font-weight: 600;
        }
        
        /* Estado de carga */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          color: var(--text-secondary);
        }
        
        .loader {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(99, 102, 241, 0.2);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 1s infinite linear;
          margin-bottom: 1rem;
        }
        
        /* Mensaje de error */
        .error-message {
          background-color: #fee2e2;
          border: 1px solid #fecaca;
          border-radius: var(--radius-md);
          padding: 1.5rem;
          display: flex;
          align-items: flex-start;
          margin-bottom: 2rem;
        }
        
        .error-icon {
          background-color: #fef2f2;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ef4444;
          margin-right: 1rem;
          flex-shrink: 0;
        }
        
        .error-content h3 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #b91c1c;
          font-size: 1rem;
        }
        
        .error-content p {
          margin: 0;
          color: #991b1b;
        }
        
        /* Estado vacío */
        .empty-state {
          background-color: var(--bg-secondary);
          border-radius: var(--radius-lg);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          max-width: 500px;
          margin: 0 auto;
        }
        
        .empty-icon {
          width: 80px;
          height: 80px;
          background-color: rgba(99, 102, 241, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }
        
        .empty-state h3 {
          margin: 0 0 1rem 0;
          font-size: 1.25rem;
        }
        
        .empty-state p {
          margin: 0 0 1.5rem 0;
          color: var(--text-secondary);
        }
        
        .update-button {
          background-color: var(--primary-color);
          border: none;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: var(--radius-md);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        /* Vista de calendario */
        .calendar-view {
          margin-bottom: 2rem;
        }
        
        .calendar-header {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 1rem;
        }
        
        .view-toggle {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 0.5rem 1rem;
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .view-toggle:hover {
          background-color: rgba(99, 102, 241, 0.1);
        }
        
        /* Calendario normal */
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .calendar-day {
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          height: fit-content;
        }
        
        .day-header {
          padding: 1rem;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .day-header h3 {
          margin: 0;
          font-size: 1.1rem;
        }
        
        .class-count {
          background-color: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
        }
        
        .day-classes {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .class-block {
          padding: 1rem;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-sm);
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .class-block:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }
        
        .class-time {
          display: flex;
          align-items: center;
          color: var(--primary-color);
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        
        .class-time svg {
          margin-right: 0.5rem;
        }
        
        .class-title {
          margin-bottom: 1rem;
        }
        
        .class-title h4 {
          margin: 0;
          font-size: 1.1rem;
          line-height: 1.3;
        }
        
        .class-details {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.85rem;
        }
        
        .detail {
          display: flex;
          align-items: center;
          color: var(--text-secondary);
        }
        
        .detail svg {
          margin-right: 0.5rem;
        }
        
        .view-details {
          background-color: transparent;
          border: none;
          color: var(--primary-color);
          font-weight: 500;
          padding: 0;
          display: flex;
          align-items: center;
          cursor: pointer;
        }
        
        .view-details svg {
          margin-left: 0.5rem;
          font-size: 0.8rem;
        }
        
        /* Vista compacta */
        .compact-view {
          display: flex;
          overflow-x: auto;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-sm);
        }
        
        .time-column, .day-column {
          min-width: 120px;
          border-right: 1px solid var(--border-color);
        }
        
        .time-column {
          min-width: 80px;
        }
        
        .time-header, .day-header {
          padding: 0.75rem;
          text-align: center;
          font-weight: 600;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .day-header {
          color: white;
        }
        
        .time-slot {
          height: 60px;
          padding: 0.25rem;
          border-top: 1px solid var(--border-color);
          font-size: 0.8rem;
        }
        
        .time-column .time-slot {
          padding: 0.25rem 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
        }
        
        .compact-class {
          background-color: var(--primary-color);
          color: white;
          border-radius: var(--radius-sm);
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          cursor: pointer;
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        
        .compact-time {
          font-weight: 600;
          display: block;
          margin-bottom: 0.15rem;
        }
        
        .compact-title {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        /* Vista de tarjetas */
        .cards-view {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .course-card {
          background-color: var(--bg-secondary);
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        
        .card-header {
          padding: 1rem;
          color: white;
          display: flex;
          justify-content: space-between;
        }
        
        .day-badge, .time-badge {
          display: flex;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.8rem;
        }
        
        .day-badge svg, .time-badge svg {
          margin-right: 0.5rem;
        }
        
        .card-body {
          padding: 1rem;
        }
        
        .course-title {
          font-size: 1.25rem;
          margin: 0 0 1rem 0;
        }
        
        .card-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        
        .card-notes {
          background-color: rgba(99, 102, 241, 0.1);
          border-left: 3px solid var(--primary-color);
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: flex-start;
          margin-top: 1rem;
        }
        
        .card-notes svg {
          margin-right: 0.5rem;
          margin-top: 0.25rem;
          color: var(--primary-color);
          flex-shrink: 0;
        }
        
        .card-notes p {
          margin: 0;
          font-size: 0.85rem;
        }
        
        .card-footer {
          padding: 1rem;
          border-top: 1px solid var(--border-color);
        }
        
        .details-button {
          width: 100%;
          background-color: var(--primary-color);
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: var(--radius-sm);
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .details-button svg {
          margin-left: 0.5rem;
        }
        
        /* Modal de detalles */
        .course-details-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
        }
        
        .modal-content {
          position: relative;
          background-color: var(--bg-secondary);
          border-radius: var(--radius-lg);
          width: 90%;
          max-width: 500px;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
          max-height: 90vh;
          display: flex;
          flex-direction: column;
        }
        
        .modal-header {
          padding: 1.5rem;
          color: white;
          position: relative;
        }
        
        .modal-header h3 {
          margin: 0;
          padding-right: 2rem;
        }
        
        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background-color: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }
        
        .detail-group {
          display: flex;
          align-items: flex-start;
          margin-bottom: 1.25rem;
        }
        
        .detail-icon {
          width: 36px;
          height: 36px;
          background-color: rgba(99, 102, 241, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          margin-right: 1rem;
          flex-shrink: 0;
        }
        
        .detail-content {
          flex: 1;
        }
        
        .detail-label {
          display: block;
          font-size: 0.85rem;
          margin-bottom: 0.25rem;
          color: var(--text-secondary);
        }
        
        .detail-value {
          font-weight: 500;
        }
        
        .notes-section {
          margin-top: 1.5rem;
          background-color: rgba(99, 102, 241, 0.08);
          padding: 1rem;
          border-radius: var(--radius-sm);
        }
        
        .note-header {
          display: flex;
          align-items: center;
          color: var(--primary-color);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .note-header svg {
          margin-right: 0.5rem;
        }
        
        .notes-section p {
          margin: 0;
          font-size: 0.9rem;
        }
        
        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border-color);
          display: flex;
          justify-content: flex-end;
        }
        
        /* Media queries */
        @media (max-width: 1024px) {
          .schedule-layout {
            flex-direction: column;
          }
          
          .schedule-sidebar {
            width: 100%;
            height: auto;
            position: relative;
          }
          
          .sidebar-menu {
            padding: 1rem;
          }
          
          .stats-container {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .content-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .day-indicator {
            align-items: flex-start;
            margin-top: 1rem;
          }
          
          .calendar-grid {
            grid-template-columns: 1fr;
          }
          
          .cards-view {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
=======
  return (
    <div className="container-fluid">
      {/* Encabezado con nombre del profesor */}
      <div className="card border-0 shadow-sm mb-4 bg-gradient" 
           style={{
             background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
             borderRadius: '15px'
           }}>
        <div className="card-body p-4 text-white">
          <div className="d-flex align-items-center">
            <div className="bg-white rounded-circle p-3 me-3">
              <FaChalkboardTeacher className="text-success" size={32} />
            </div>
            <div>
              <h1 className="display-6 mb-0">{userInfo?.nombre || "Docente"}</h1>
              <p className="mb-0 opacity-75">
                <FaStar className="me-2" />
                Mi Horario de Clases
              </p>
            </div>
            <div className="ms-auto">
              <Badge 
                bg="light" 
                className="text-success fw-bold py-2 px-3" 
                style={{fontSize: '0.9rem', borderRadius: '20px'}}
              >
                {getDiaActual()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de vista */}
      <div className="d-flex justify-content-center mb-4">
        <div className="btn-group">
          <Button 
            variant={horarioActivo ? "success" : "outline-success"}
            className="px-4"
            onClick={() => setHorarioActivo(true)}
          >
            <FaCalendarDay className="me-2" />
            Vista por días
          </Button>
          <Button 
            variant={!horarioActivo ? "success" : "outline-success"}
            className="px-4"
            onClick={() => setHorarioActivo(false)}
          >
            <FaBook className="me-2" />
            Lista de cursos
          </Button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="success" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="danger" className="d-flex align-items-center">
          <i className="fas fa-exclamation-circle me-2"></i>
          <div>{error}</div>
        </Alert>
      )}

      {/* Empty state */}
      {!loading && !error && (!localAsignaciones || localAsignaciones.length === 0) && (
        <div className="text-center py-5">
          <div className="card shadow-sm border-0 p-4">
            <FaBook size={50} className="text-muted mb-3 mx-auto" />
            <h3 className="h5 text-muted">No tienes cursos asignados</h3>
            <p className="text-muted mb-0">Cuando se te asignen cursos, aparecerán aquí.</p>
          </div>
        </div>
      )}

      {/* Vista por días de la semana */}
      {horarioActivo && !loading && !error && localAsignaciones.length > 0 && (
        <div className="mb-4">
          <Accordion defaultActiveKey={getDiaActual()} className="shadow-sm rounded-3 overflow-hidden">
            {Object.keys(cursosPorDia).map(dia => (
              <Accordion.Item 
                key={dia} 
                eventKey={dia}
                className="border-0"
              >
                <Accordion.Header 
                  className="py-3 border-0"
                  style={{ borderLeft: `5px solid ${getColorForDay(dia)}` }}
                >
                  <div className="d-flex align-items-center w-100">
                    <div 
                      className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        backgroundColor: getColorForDay(dia),
                        color: 'white'
                      }}
                    >
                      <FaCalendarDay />
                    </div>
                    <div className="d-flex justify-content-between align-items-center w-100">
                      <div>
                        <h4 className="mb-0">{dia}</h4>
                        <small className="text-muted">{cursosPorDia[dia].length} curso(s)</small>
                      </div>
                      <Badge bg="success" pill className="me-3">
                        {cursosPorDia[dia].length}
                      </Badge>
                    </div>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="bg-light">
                  <div className="timeline position-relative">
                    {cursosPorDia[dia].map((asignacion, index) => (
                      <div 
                        key={asignacion.id || `${asignacion.curso_nombre}-${index}`}
                        className="timeline-item mb-4 position-relative"
                      >
                        <div 
                          className="timeline-badge position-absolute rounded-circle d-flex align-items-center justify-content-center"
                          style={{ 
                            left: '-10px', 
                            top: '15px', 
                            width: '20px', 
                            height: '20px', 
                            backgroundColor: getColorForDay(dia)
                          }}
                        ></div>
                        <Card className="timeline-content ms-4 border-0 shadow-sm">
                          <Card.Body>
                            <div className="d-flex align-items-center mb-3">
                              <div 
                                className="me-3 p-2 rounded-circle d-flex align-items-center justify-content-center"
                                style={{ 
                                  backgroundColor: `${getColorForDay(dia)}20`,
                                  width: '48px',
                                  height: '48px'
                                }}
                              >
                                <FaClock style={{ color: getColorForDay(dia) }} size={22} />
                              </div>
                              <div>
                                <h5 className="fw-bold mb-0">{asignacion.hora_inicio?.slice(0,5)} - {asignacion.hora_fin?.slice(0,5)}</h5>
                                <small className="text-muted">Duración: {
                                  (() => {
                                    const [horaIni, minIni] = asignacion.hora_inicio.split(':').map(Number);
                                    const [horaFin, minFin] = asignacion.hora_fin.split(':').map(Number);
                                    const totalMinIni = horaIni * 60 + minIni;
                                    const totalMinFin = horaFin * 60 + minFin;
                                    const diffMin = totalMinFin - totalMinIni;
                                    return `${Math.floor(diffMin/60)}h ${diffMin % 60}min`;
                                  })()
                                }</small>
                              </div>
                            </div>
                            
                            <Card.Title className="d-flex align-items-center">
                              <FaBook className="me-2" style={{ color: getColorForDay(dia) }} />
                              {asignacion.curso_nombre}
                            </Card.Title>
                            
                            <div className="row mt-3">
                              <div className="col-md-6">
                                <div className="mb-2 d-flex align-items-center">
                                  <FaMapMarkerAlt className="text-secondary me-2" />
                                  <span>Aula: <strong>{asignacion.aula || 'No asignada'}</strong></span>
                                </div>
                                <div className="mb-2 d-flex align-items-center">
                                  <FaUsers className="text-secondary me-2" />
                                  <span>Capacidad: <strong>{asignacion.max_alumnos || 'N/A'} estudiantes</strong></span>
                                </div>
                              </div>
                              <div className="col-md-6">
                                <div className="mb-2 d-flex align-items-center">
                                  <FaCalendarAlt className="text-secondary me-2" />
                                  <div>
                                    <small className="d-block">Período:</small>
                                    <strong>{new Date(asignacion.fecha_inicio).toLocaleDateString()} - {new Date(asignacion.fecha_fin).toLocaleDateString()}</strong>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {asignacion.notas && (
                              <div className="mt-3 p-2 bg-light rounded border-start border-3" style={{ borderColor: `${getColorForDay(dia)} !important`}}>
                                <small className="text-muted d-block">Notas:</small>
                                {asignacion.notas}
                              </div>
                            )}
                            
                            <div className="d-flex justify-content-end mt-3">
                              <Button variant="outline-success" size="sm">
                                Ver detalles <FaChevronRight className="ms-1" />
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      )}

      {/* Vista de lista de cursos (diseño original mejorado) */}
      {!horarioActivo && !loading && !error && localAsignaciones.length > 0 && (
        <Row xs={1} md={2} lg={3} className="g-4">
          {localAsignaciones.map((asignacion) => (
            <Col key={asignacion.id || `${asignacion.curso_nombre}-${asignacion.dia_semana}`}>
              <Card className="h-100 shadow-sm border-0 hover-card">
                <Card.Header 
                  className="text-white py-3"
                  style={{ 
                    background: `linear-gradient(135deg, ${getColorForDay(asignacion.dia_semana)} 0%, ${getColorForDay(asignacion.dia_semana)}99 100%)`,
                    borderRadius: '0.5rem 0.5rem 0 0'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div className="bg-white rounded-circle p-2 me-2 d-flex align-items-center justify-content-center" style={{width: '36px', height: '36px'}}>
                      <FaBook style={{ color: getColorForDay(asignacion.dia_semana) }} size={18} />
                    </div>
                    <div>
                      <h3 className="h5 mb-0">{asignacion.curso_nombre}</h3>
                      <Badge bg="light" text="dark" className="opacity-75">
                        {asignacion.dia_semana}
                      </Badge>
                    </div>
                  </div>
                </Card.Header>
                
                <Card.Body>
                  <div className="list-group list-group-flush">
                    <div className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                          style={{ 
                            backgroundColor: `${getColorForDay(asignacion.dia_semana)}20`,
                            width: '36px',
                            height: '36px'
                          }}
                        >
                          <FaClock style={{ color: getColorForDay(asignacion.dia_semana) }} />
                        </div>
                        <div>
                          <small className="text-muted d-block">Horario</small>
                          <strong>{asignacion.hora_inicio?.slice(0,5)} - {asignacion.hora_fin?.slice(0,5)}</strong>
                        </div>
                      </div>
                    </div>

                    {asignacion.aula && (
                      <div className="list-group-item border-0 px-0">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                            style={{ 
                              backgroundColor: `${getColorForDay(asignacion.dia_semana)}20`,
                              width: '36px',
                              height: '36px'
                            }}
                          >
                            <FaMapMarkerAlt style={{ color: getColorForDay(asignacion.dia_semana) }} />
                          </div>
                          <div>
                            <small className="text-muted d-block">Aula</small>
                            <strong>{asignacion.aula}</strong>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="list-group-item border-0 px-0">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                          style={{ 
                            backgroundColor: `${getColorForDay(asignacion.dia_semana)}20`,
                            width: '36px',
                            height: '36px'
                          }}
                        >
                          <FaCalendarAlt style={{ color: getColorForDay(asignacion.dia_semana) }} />
                        </div>
                        <div>
                          <small className="text-muted d-block">Período</small>
                          <strong>
                            {new Date(asignacion.fecha_inicio).toLocaleDateString()} -
                            {new Date(asignacion.fecha_fin).toLocaleDateString()}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {asignacion.max_alumnos && (
                      <div className="list-group-item border-0 px-0">
                        <div className="d-flex align-items-center">
                          <div 
                            className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                            style={{ 
                              backgroundColor: `${getColorForDay(asignacion.dia_semana)}20`,
                              width: '36px',
                              height: '36px'
                            }}
                          >
                            <FaUsers style={{ color: getColorForDay(asignacion.dia_semana) }} />
                          </div>
                          <div>
                            <small className="text-muted d-block">Capacidad</small>
                            <strong>{asignacion.max_alumnos} estudiantes</strong>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {asignacion.notas && (
                    <div className="alert alert-light border mt-3 mb-0">
                      <small className="text-muted d-block mb-1">Notas:</small>
                      <p className="mb-0">{asignacion.notas}</p>
                    </div>
                  )}
                </Card.Body>

                <Card.Footer className="bg-white border-0">
                  <Button 
                    variant="outline-success" 
                    className="w-100"
                    style={{ borderRadius: '30px' }}
                  >
                    Ver detalles del curso
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Botón para recargar en caso de problemas */}
      {(!loading && (error || localAsignaciones.length === 0)) && (
        <div className="text-center mt-3">
          <Button 
            variant="outline-success"
            onClick={fetchAsignaciones} 
            disabled={loading}
            className="px-4 py-2"
          >
            {loading ? <Spinner animation="border" size="sm" /> : 'Recargar cursos'}
          </Button>
        </div>
      )}
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
    </div>
  );
};

export default MisAsignacionesDocente;