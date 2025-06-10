import React from 'react';
import { FaUser, FaClipboardCheck, FaGraduationCap, FaSignOutAlt, FaBookOpen } from 'react-icons/fa';
import ClasesList from '../components/ClasesList';
import CalificacionesList from '../components/CalificacionesList';
import AsistenciasList from '../components/AsistenciasList';        
//import
// ============================================
// DASHBOARD ESPECÍFICO PARA ESTUDIANTES
// Solo muestra funcionalidades relevantes para alumnos
// ============================================

const StudentDashboard = ({
  userInfo,
  activeModule,
  setActiveModule,
  onLogout,
  loading,
  error,
  success,
  setError,
  setSuccess,
  // Props específicas para estudiantes
  misAsistencias = [],
  misCalificaciones = [],
  misClases = [],
  token,
  showError,
  showSuccess
}) => {
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* SIDEBAR ESPECÍFICO PARA ESTUDIANTES */}
      <nav className="d-flex flex-column bg-primary text-white p-3" style={{ width: '250px' }}>
        <div className="d-flex align-items-center mb-4">
          <div className="bg-light rounded-circle p-2 me-2">
            <FaUser size={20} color="#0d6efd" />
          </div>
          <div>
            <h5 className="mb-0">{userInfo.nombre}</h5>
            <small className="text-light opacity-75">👨‍🎓 {userInfo.rol}</small>
          </div>
        </div>
        
        <hr className="my-2 border-light opacity-25" />
        
        {/* MENÚ LIMITADO PARA ESTUDIANTES */}
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-2">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center ${
                activeModule === 'mis-clases' ? 'active bg-light text-primary' : 'text-white'
              }`}
              onClick={() => setActiveModule('mis-clases')}
              style={{
                borderRadius: '10px',
                fontWeight: '500'
              }}
            >
              <FaBookOpen className="me-2" />
              Mis Clases
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center ${
                activeModule === 'mis-asistencias' ? 'active bg-light text-primary' : 'text-white'
              }`}
              onClick={() => setActiveModule('mis-asistencias')}
              style={{
                borderRadius: '10px',
                fontWeight: '500'
              }}
            >
              <FaClipboardCheck className="me-2" />
              Mi Asistencia
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center ${
                activeModule === 'mis-calificaciones' ? 'active bg-light text-primary' : 'text-white'
              }`}
              onClick={() => setActiveModule('mis-calificaciones')}
              style={{
                borderRadius: '10px',
                fontWeight: '500'
              }}
            >
              <FaGraduationCap className="me-2" />
              Mis Calificaciones
            </button>
          </li>
        </ul>
        
        <hr className="my-2 border-light opacity-25" />
        
        <button 
          className="btn btn-outline-light mt-auto d-flex align-items-center justify-content-center"
          onClick={onLogout}
          style={{
            borderRadius: '25px',
            fontWeight: '500'
          }}
        >
          <FaSignOutAlt className="me-2" />
          Cerrar sesión
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL PARA ESTUDIANTES */}
      <main className="flex-grow-1 p-4" style={{ backgroundColor: '#f8f9fa' }}>
        {/* Notificaciones flotantes */}
        {error && (
          <div className="position-fixed top-0 end-0 m-4" style={{ zIndex: 1000 }}>
            <div className="alert alert-danger alert-dismissible fade show shadow" role="alert">
              <strong>Error!</strong> {error}
              <button type="button" className="btn-close" onClick={() => setError('')}></button>
            </div>
          </div>
        )}
        
        {success && (
          <div className="position-fixed top-0 end-0 m-4" style={{ zIndex: 1000 }}>
            <div className="alert alert-success alert-dismissible fade show shadow" role="alert">
              <strong>Éxito!</strong> {success}
              <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
            </div>
          </div>
        )}

        {/* CONTENIDO ESPECÍFICO SEGÚN EL MÓDULO SELECCIONADO */}
        <div className="container-fluid py-3">
          {/* Header con bienvenida personalizada */}
          <div className="row mb-4">
            <div className="col">
              <div className="card border-0 shadow-sm bg-gradient" style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
              }}>
                <div className="card-body text-white text-center py-4">
                  <h2 className="mb-2">¡Bienvenido, {userInfo.nombre}! 👋</h2>
                  <p className="mb-0 opacity-75">Aquí puedes consultar tu progreso académico</p>
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}
          
          {/* MÓDULO: MIS CLASES */}
          {activeModule === 'mis-clases' && (
            <ClasesList
              clases={misClases}
              token={token}
              // Puedes pasar funciones para manejar clicks o recargar datos
              onClaseClick={(clase) => {
                // Acción al hacer clic en una clase
                console.log('Clase seleccionada:', clase);
              }}
              showError={showError}
              showSuccess={showSuccess}
            />
          )}
          
          {/* MÓDULO: MIS ASISTENCIAS */}
          {activeModule === 'mis-asistencias' && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-success text-white">
                <h4 className="mb-0"><FaClipboardCheck className="me-2" />Mi Registro de Asistencia</h4>
              </div>
              <div className="card-body">
                {misAsistencias.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>Fecha</th>
                          <th>Clase</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {misAsistencias.map((asistencia, index) => (
                          <tr key={index}>
                            <td>{new Date(asistencia.fecha).toLocaleDateString()}</td>
                            <td>{asistencia.nombreClase}</td>
                            <td>
                              <span className={`badge ${
                                asistencia.presente ? 'bg-success' : 'bg-danger'
                              }`}>
                                {asistencia.presente ? '✓ Presente' : '✗ Ausente'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center text-muted py-5">
                    <FaClipboardCheck size={50} className="mb-3 opacity-50" />
                    <p>No hay registros de asistencia disponibles</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* MÓDULO: MIS CALIFICACIONES */}
          {activeModule === 'mis-calificaciones' && (
            <div className="card shadow-sm border-0">
              <div className="card-header bg-warning text-dark">
                <h4 className="mb-0"><FaGraduationCap className="me-2" />Mis Calificaciones</h4>
              </div>
              <div className="card-body">
                {misCalificaciones.length > 0 ? (
                  <div className="row">
                    {misCalificaciones.map((calificacion, index) => (
                      <div key={index} className="col-md-6 col-lg-4 mb-3">
                        <div className="card h-100 border-0 shadow-sm">
                          <div className="card-body text-center">
                            <h5 className="card-title">{calificacion.nombreClase}</h5>
                            <div className="display-4 mb-2" style={{
                              color: calificacion.nota >= 7 ? '#28a745' : 
                                     calificacion.nota >= 5 ? '#ffc107' : '#dc3545'
                            }}>
                              {calificacion.nota}
                            </div>
                            <p className="text-muted">{calificacion.tipo}</p>
                            <small className="text-muted">
                              {new Date(calificacion.fecha).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted py-5">
                    <FaGraduationCap size={50} className="mb-3 opacity-50" />
                    <p>No hay calificaciones disponibles</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;