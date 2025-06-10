import React from 'react';
import {
  FaUser,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaGraduationCap,
  FaSignOutAlt,
  FaUsers,
  FaTasks,
  FaBook
} from 'react-icons/fa';
import ClasesList from '../components/ClasesList';
import AsistenciasList from '../components/AsistenciasList';
import CalificacionesList from '../components/CalificacionesList';
import CursosAsignadosDocente from '../components/ProfesoresAsignaturas';
import ProfesoresAsignaturas from '../components/ProfesoresAsignaturas';
import MisAsignacionesDocente from '../components-docente/MisAsignacionesDocente';

const TeacherDashboard = ({
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
  calificaciones,
  asignaciones,
  token,
  showError,
  showSuccess
}) => {
  const misAsignaciones = Array.isArray(asignaciones)
    ? asignaciones.filter(a => a.profesor_nombre === userInfo.nombre)
    : [];

  const asignaturasUnicas = [...new Set(misAsignaciones.map(a => a.curso_nombre))];

  return (
    <div className="d-flex" style={{ minHeight: '100vh' }}>
      {/* Sidebar navigation - Hacemos que sea fixed */}
      <nav className="position-fixed bg-success text-white p-3" 
        style={{ 
          width: '250px', 
          height: '100vh',
          overflowY: 'auto' // Por si el contenido del sidebar es muy largo
        }}>
        <div className="d-flex flex-column h-100">
          {/* User info */}
          <div className="d-flex align-items-center mb-4">
            <div className="bg-light rounded-circle p-2 me-2">
              <FaChalkboardTeacher size={20} color="#198754" />
            </div>
            <div>
              <h5 className="mb-0">{userInfo.nombre}</h5>
              <small className="text-light opacity-75">👨‍🏫 {userInfo.rol}</small>
            </div>
          </div>

          <hr className="my-2 border-light opacity-25" />

          {/* Navigation menu */}
          <ul className="nav nav-pills flex-column">
            <li className="nav-item mb-2">
              <button
                className={`nav-link w-100 text-start d-flex align-items-center ${
                  activeModule === 'cursos-asignados' ? 'active bg-light text-success' : 'text-white'
                }`}
                onClick={() => setActiveModule('cursos-asignados')}
                style={{ borderRadius: '10px', fontWeight: '500' }}
              >
                <FaBook className="me-2" />
                Cursos Asignados
              </button>
            </li>
          </ul>

          <hr className="my-2 border-light opacity-25" />

          {/* Logout button */}
          <div className="mt-auto">
            <button
              className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
              onClick={onLogout}
              style={{ borderRadius: '25px', fontWeight: '500' }}
            >
              <FaSignOutAlt className="me-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </nav>

      {/* Main content - Agregamos margin-left para compensar el sidebar fijo */}
      <main className="flex-grow-1 p-4" style={{ 
        backgroundColor: '#f8f9fa',
        marginLeft: '250px' // Mismo ancho que el sidebar
      }}>
        {/* Alerts */}
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

        <div className="container-fluid py-3">
          {/* Welcome card */}
          <div className="row mb-4">
            <div className="col">
              <div className="card border-0 shadow-sm bg-gradient"
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)'
                }}>
                <div className="card-body text-center py-4" style={{ color: '#000' }}>
                  <h2 className="mb-2">¡Bienvenido, Profesor {userInfo.nombre}! 📚</h2>
                  <p className="mb-0" style={{ opacity: 0.8 }}>
                    Gestiona tus cursos asignados
                    {asignaturasUnicas.length > 0 && (
                      <span>
                        <br />
                        <strong>Asignatura{asignaturasUnicas.length > 1 ? 's' : ''} asignada{asignaturasUnicas.length > 1 ? 's' : ''}:</strong>{' '}
                        {asignaturasUnicas.join(', ')}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Loading spinner */}
          {loading && (
            <div className="text-center my-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          )}

          {/* Render MisAsignacionesDocente when active */}
          {activeModule === 'cursos-asignados' && (
            <div className="row">
              <div className="col">
                <MisAsignacionesDocente 
                  asignaciones={misAsignaciones}
                  loading={loading}
                  error={error}
                  token={token}
                  userInfo={userInfo}
                  showError={showError}
                  showSuccess={showSuccess}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;