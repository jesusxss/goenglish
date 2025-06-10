import React, { useCallback, useEffect } from 'react';
import { FaUser, FaChalkboardTeacher, FaClipboardCheck, FaGraduationCap, FaSignOutAlt, FaUserShield, FaCalendarAlt, FaUserGraduate } from 'react-icons/fa';
import UsuariosList from '../components/UsuariosList';
import ClasesList from '../components/ClasesList';
import AsistenciasList from '../components/AsistenciasList';
import CalificacionesList from '../components/CalificacionesList';
import AsignacionProfesores from '../components/AsignacionProfesores';
import ProfesoresAsignaturas from '../components/ProfesoresAsignaturas';
import AsignacionEstudiantes from '../components/AsignacionEstudiantes'; // Nuevo componente

// ============================================
// DASHBOARD ESPECÍFICO PARA ADMINISTRADORES
// Acceso completo a todas las funcionalidades
// ============================================

const Dashboard = ({
  userInfo,
  activeModule,
  setActiveModule,
  onLogout,
  loading,
  error,
  success,
  setError,
  setSuccess,
  usuarios,
  clases,
  asistencias,
  asignaciones,
  calificaciones,
  token,
  fetchUsuarios,
  fetchClases,
  fetchAsistencias,
  fetchAsignaciones,
  fetchCalificaciones,
  showError,
  showSuccess,
  // <-- eliminado: estudiantes, cursosConProfesor, fetchCursosConProfesorNuevo
}) => {

  // Función para manejar el cambio de módulo con validación
  const handleModuleChange = useCallback((module) => {
    try {
      setActiveModule(module);
    } catch (err) {
      console.error('Error al cambiar módulo:', err);
      showError && showError('Error al cambiar de módulo');
    }
  }, [setActiveModule, showError]);

  // Filtra profesores y cursos desde los props recibidos
  const profesores = Array.isArray(usuarios) ? usuarios.filter(u => u.rol === 'profesor' || u.rol === 'docente') : [];
  const cursos = Array.isArray(clases) ? clases : [];

  // Add this effect after the handleModuleChange definition
 
  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* SIDEBAR ESPECÍFICO PARA ADMINISTRADORES */}
      <nav
        className="d-flex flex-column bg-dark text-white p-3"
        style={{
          width: '250px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          minHeight: '100vh'
        }}
      >
        <div className="d-flex align-items-center mb-4">
          <div className="bg-danger rounded-circle p-2 me-2">
            <FaUserShield size={20} />
          </div>
          <div>
            <h5 className="mb-0">{userInfo?.nombre || 'Usuario'}</h5>
            <small className="text-muted">👨‍💼 {userInfo?.rol || 'Admin'}</small>
          </div>
        </div>
        
        <hr className="my-2" />
        
        {/* MENÚ COMPLETO PARA ADMINISTRADORES */}
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item mb-2">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center ${
                activeModule === 'usuarios' ? 'active bg-danger' : 'text-white'
              }`}
              onClick={() => handleModuleChange('usuarios')}
              disabled={loading}
              style={{
                borderRadius: '10px',
                fontWeight: '500'
              }}
            >
              <FaUser className="me-2" />
              Gestión de Usuarios
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center ${
                activeModule === 'clases' ? 'active bg-danger' : 'text-white'
              }`}
              onClick={() => handleModuleChange('clases')}
              disabled={loading}
              style={{
                borderRadius: '10px',
                fontWeight: '500'
              }}
            >
              <FaChalkboardTeacher className="me-2" />
              Gestión de Clases
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center ${
                activeModule === 'asistencias' ? 'active bg-danger' : 'text-white'
              }`}
              onClick={() => handleModuleChange('asistencias')}
              disabled={loading}
              style={{
                borderRadius: '10px',
                fontWeight: '500'
              }}
            >
              <FaClipboardCheck className="me-2" />
              Gestión de Asistencias
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center ${
                activeModule === 'calificaciones' ? 'active bg-danger' : 'text-white'
              }`}
              onClick={() => handleModuleChange('calificaciones')}
              disabled={loading}
              style={{
                borderRadius: '10px',
                fontWeight: '500'
              }}
            >
              <FaGraduationCap className="me-2" />
              Gestión de Calificaciones
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center ${
                activeModule === 'asignacion' ? 'active bg-danger' : 'text-white'
              }`}
              onClick={() => handleModuleChange('asignacion')}
              disabled={loading}
              style={{
                borderRadius: '10px',
                fontWeight: '500'
              }}
            >
              <FaCalendarAlt className="me-2" />
              Asignación Profesores
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center ${
                activeModule === 'profesores-asignaturas' ? 'active bg-danger' : 'text-white'
              }`}
              onClick={() => handleModuleChange('profesores-asignaturas')}
              disabled={loading}
              style={{
                borderRadius: '10px',
                fontWeight: '500'
              }}
            >
              <FaChalkboardTeacher className="me-2" />
              Profesores & Asignaturas
            </button>
          </li>
          <li className="nav-item mb-2">
            <button
              className={`nav-link w-100 text-start d-flex align-items-center ${
                activeModule === 'asignacion-estudiantes' ? 'active bg-danger' : 'text-white'
              }`}
              onClick={() => handleModuleChange('asignacion-estudiantes')}
              disabled={loading}
              style={{
                borderRadius: '10px',
                fontWeight: '500'
              }}
            >
              <FaUserGraduate className="me-2" />
              Asignación Estudiantes
            </button>
          </li>
        </ul>
        
        <hr className="my-2" />
        
        {/* Botón de cerrar sesión fijo abajo */}
        <div style={{ marginTop: 'auto' }}>
          <button
            className="btn btn-outline-light d-flex align-items-center justify-content-center w-100"
            onClick={onLogout}
            disabled={loading}
          >
            <FaSignOutAlt className="me-2" />
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow-1 p-4 bg-light">
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

        {/* Contenido del módulo activo */}
        <div className="container-fluid py-3">
          {loading && (
            <div className="text-center my-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}
          
          {activeModule === 'usuarios' && !loading && (
            <UsuariosList 
              usuarios={usuarios} 
              token={token} 
              fetchUsuarios={fetchUsuarios} 
              showError={showError} 
              showSuccess={showSuccess} 
            />
          )}
          
          {activeModule === 'clases' && !loading && (
            <ClasesList 
              clases={clases} 
              token={token} 
              fetchClases={fetchClases} 
              showError={showError} 
              showSuccess={showSuccess} 
            />
          )}
          
          {activeModule === 'asistencias' && !loading && (
            <AsistenciasList
              asistencias={asistencias}
              usuarios={usuarios}
              clases={clases}
              token={token}
              fetchAsistencias={fetchAsistencias}
              showError={showError}
              showSuccess={showSuccess}
            />
          )}
          
          {activeModule === 'calificaciones' && !loading && (
            <CalificacionesList
              calificaciones={calificaciones}
              usuarios={usuarios}
              clases={clases}
              token={token}
              fetchCalificaciones={fetchCalificaciones}
              showError={showError}
              showSuccess={showSuccess}
            />
          )}
          
          {activeModule === 'asignacion' && !loading && (
            <AsignacionProfesores
              profesores={profesores}
              cursos={cursos}
              asignaciones={asignaciones}
              fetchAsignaciones={fetchAsignaciones}
              token={token}
              showError={showError}
              showSuccess={showSuccess}
            />
          )}
          
          {activeModule === 'profesores-asignaturas' && !loading && (
            <ProfesoresAsignaturas
              token={token}
              showError={showError}
              showSuccess={showSuccess}
            />
          )}
          {activeModule === 'asignacion-estudiantes' && !loading && (
            <AsignacionEstudiantes
              usuarios={usuarios}
              profesores={profesores}
              token={token}
              showError={showError}
              showSuccess={showSuccess}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;