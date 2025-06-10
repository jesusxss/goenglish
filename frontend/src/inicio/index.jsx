import React from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import ParticlesBackground from '../components/ParticlesBackground';

const Login = ({ onLogin, error }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    onLogin(email, password);
  };

  return (
    <div style={{ 
      position: 'relative', 
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #0d6efd 0%, #6610f2 100%)'
    }}>
      <ParticlesBackground />
      
      <div className="card shadow-lg p-4" style={{ 
        width: '100%', 
        maxWidth: '400px',
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(5px)',
        animation: 'fadeIn 0.6s ease-out forwards'
      }}>
        <div className="card-body text-center">
          <div style={{
            marginBottom: '2rem',
            color: '#4a4a4a'
          }}>
            <h2 style={{
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#343a40'
            }}>
              <span style={{ color: '#0d6efd' }}>GO</span>English
            </h2>
            <p style={{ color: '#6c757d' }}>Sistema de Gestión Académica</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text" style={{
                  backgroundColor: '#f8f9fa',
                  borderRight: 'none',
                  borderTopLeftRadius: '10px',
                  borderBottomLeftRadius: '10px'
                }}>
                  <FaEnvelope style={{ color: '#6c757d' }} />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Correo electrónico"
                  required
                  style={{
                    borderLeft: 'none',
                    padding: '10px 15px',
                    backgroundColor: '#f8f9fa',
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '10px'
                  }}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="input-group">
                <span className="input-group-text" style={{
                  backgroundColor: '#f8f9fa',
                  borderRight: 'none',
                  borderTopLeftRadius: '10px',
                  borderBottomLeftRadius: '10px'
                }}>
                  <FaLock style={{ color: '#6c757d' }} />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Contraseña"
                  required
                  style={{
                    borderLeft: 'none',
                    padding: '10px 15px',
                    backgroundColor: '#f8f9fa',
                    borderTopRightRadius: '10px',
                    borderBottomRightRadius: '10px'
                  }}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2"
              style={{
                borderRadius: '25px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(13, 110, 253, 0.3)',
                border: 'none',
                marginBottom: '1rem'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Iniciar sesión
            </button>
            
            {error && (
              <div className="alert alert-danger mt-3" style={{
                borderRadius: '10px',
                border: 'none'
              }}>
                {error}
              </div>
            )}
          </form>
          
          <div className="mt-4" style={{ color: '#6c757d', fontSize: '0.9rem' }}>
            <p>¿Problemas para ingresar? <a href="#" style={{ color: '#0d6efd', textDecoration: 'none' }}>Contacta al administrador</a></p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .input-group:focus-within .input-group-text {
          background-color: #e9ecef !important;
        }
        
        .input-group:focus-within .form-control {
          background-color: white !important;
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Login;