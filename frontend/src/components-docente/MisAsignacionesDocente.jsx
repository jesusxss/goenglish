import React, { useState, useEffect } from 'react';
import { 
  FaBook, FaCalendarAlt, FaClock, FaMapMarkerAlt, 
  FaUsers, FaChalkboardTeacher, FaRegStar, 
  FaStar, FaCalendarDay, FaChevronRight 
} from 'react-icons/fa';
import axios from 'axios';
import { Card, Badge, Row, Col, Alert, Button, Spinner, Accordion } from 'react-bootstrap';

const MisAsignacionesDocente = ({   
  asignaciones: initialAsignaciones,
  loading: parentLoading,
  error: parentError,
  token,
  userInfo,
  showError,
  showSuccess 
}) => {
  console.log("Asignaciones recibidas:", initialAsignaciones); // Para depuración
  
  const [localAsignaciones, setLocalAsignaciones] = useState(initialAsignaciones || []);
  const [loading, setLoading] = useState(parentLoading);
  const [error, setError] = useState(parentError);
  const [cursosPorDia, setCursosPorDia] = useState({});
  const [horarioActivo, setHorarioActivo] = useState(true);

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

  // Obtener el color para cada día
  const getColorForDay = (day) => {
    const colors = {
      "Lunes": "#28a745",      // Verde
      "Martes": "#007bff",     // Azul
      "Miércoles": "#6f42c1",  // Púrpura
      "Jueves": "#fd7e14",     // Naranja
      "Viernes": "#e83e8c",    // Rosa
      "Sábado": "#20c997",     // Verde agua
      "Domingo": "#dc3545"     // Rojo
    };
    return colors[day] || "#28a745"; // Verde por defecto
  };

  // Función para obtener el día actual de la semana en español
  const getDiaActual = () => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[new Date().getDay()];
  };

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
    </div>
  );
};

export default MisAsignacionesDocente;