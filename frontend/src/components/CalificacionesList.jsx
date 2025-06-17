import React, { useState } from 'react';
<<<<<<< HEAD
import { FaEdit, FaTrash, FaPlus, FaStar, FaUser, FaBook, FaTrophy, FaGraduationCap } from 'react-icons/fa';
import { Modal, Button, Form, Card, Container, Row, Col, Badge, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
=======
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde

const CalificacionesList = ({ calificaciones, usuarios, clases, token, fetchCalificaciones, showError, showSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    estudiante_id: '', 
    materia_id: '', 
    calificacion: '' 
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editMode 
<<<<<<< HEAD
        ? `http://3.15.145.16:3004/calificaciones/${formData.id}`
        : 'http://3.15.145.16:3004/calificaciones';
=======
        ? `http://18.222.195.94:3004/calificaciones/${formData.id}`
        : 'http://18.222.195.94:3004/calificaciones';
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
      
      const method = editMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          estudiante_id: formData.estudiante_id,
          materia_id: formData.materia_id,
          calificacion: parseFloat(formData.calificacion)
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || (editMode ? 'Error al actualizar calificación' : 'Error al crear calificación'));
      }
      
      showSuccess(editMode ? 'Calificación actualizada correctamente' : 'Calificación creada correctamente');
      fetchCalificaciones();
      setShowModal(false);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta calificación?')) return;
    
    try {
<<<<<<< HEAD
      const res = await fetch(`http://3.15.145.16:3004/calificaciones/${id}`, {
=======
      const res = await fetch(`http://18.222.195.94:3004/calificaciones/${id}`, {
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Error al eliminar calificación');
      
      showSuccess('Calificación eliminada correctamente');
      fetchCalificaciones();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleEdit = (calificacion) => {
    setFormData({
      id: calificacion.id,
      estudiante_id: calificacion.estudiante_id,
      materia_id: calificacion.materia_id,
      calificacion: calificacion.calificacion
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setFormData({ 
      estudiante_id: '', 
      materia_id: '', 
      calificacion: '' 
    });
    setEditMode(false);
    setShowModal(true);
  };

  const getUsuarioNombre = (id) => {
    const usuario = usuarios.find(u => u.id === id);
    return usuario ? usuario.nombre : 'Desconocido';
  };

  const getClaseNombre = (id) => {
    const clase = clases.find(c => c.id === id);
    return clase ? clase.nombre : 'Desconocida';
  };

<<<<<<< HEAD
  const getGradeBadgeVariant = (grade) => {
    if (grade >= 90) return 'success';
    if (grade >= 80) return 'warning';
    if (grade >= 70) return 'info';
    return 'danger';
  };

  const getGradeIcon = (grade) => {
    if (grade >= 90) return <FaTrophy className="me-1" />;
    if (grade >= 80) return <FaGraduationCap className="me-1" />;
    return <FaStar className="me-1" />;
  };

  const getGradeText = (grade) => {
    if (grade >= 90) return 'Excelente';
    if (grade >= 80) return 'Muy Bueno';
    if (grade >= 70) return 'Bueno';
    return 'Necesita Mejorar';
  };

  return (
    <Container fluid className="py-4">
      <style jsx>{`
        .grade-card {
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }
        
        .grade-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        
        .fade-in-card {
          animation-delay: var(--delay);
        }
        
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .grade-badge-large {
          font-size: 1.5rem;
          padding: 12px 20px;
          border-radius: 15px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 80px;
        }
        
        .action-btn {
          transition: all 0.2s ease;
          border-radius: 8px;
          border: none;
          padding: 8px 12px;
          margin: 0 2px;
        }
        
        .action-btn:hover {
          transform: translateY(-2px);
        }
        
        .header-title {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 700;
        }
        
        .add-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          border-radius: 12px;
          transition: all 0.3s ease;
        }
        
        .add-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        
        .info-row {
          margin-bottom: 8px;
          padding: 8px 0;
        }
        
        .modal-content {
          border: none;
          border-radius: 20px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        
        .modal-header {
          border-bottom: 1px solid #e9ecef;
          border-radius: 20px 20px 0 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .spinner-border-sm {
          width: 1rem;
          height: 1rem;
        }
      `}</style>

      {/* Header */}
      <Row className="mb-5">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="header-title display-4 mb-2">
                <FaStar className="me-3" />
                Calificaciones
              </h1>
              <p className="text-muted lead">Gestiona las calificaciones de tus estudiantes</p>
            </div>
            <Button 
              className="add-btn d-flex align-items-center"
              size="lg"
              onClick={handleAdd}
            >
              <FaPlus className="me-2" />
              Nueva Calificación
            </Button>
          </div>
        </Col>
      </Row>

      {/* Cards Grid */}
      <Row className="g-4">
        {calificaciones.map((calificacion, index) => (
          <Col key={calificacion.id} xl={4} lg={6} md={6} sm={12}>
            <Card 
              className="grade-card fade-in-card h-100"
              style={{ '--delay': `${index * 0.1}s` }}
            >
              <Card.Header className="bg-light border-0 d-flex justify-content-between align-items-center">
                <Badge 
                  className="grade-badge-large"
                  bg={getGradeBadgeVariant(calificacion.calificacion)}
                >
                  {getGradeIcon(calificacion.calificacion)}
                  {calificacion.calificacion}
                </Badge>
                <div>
                  <Button
                    variant="outline-warning"
                    size="sm"
                    className="action-btn me-2"
                    onClick={() => handleEdit(calificacion)}
                  >
                    <FaEdit />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="action-btn"
                    onClick={() => handleDelete(calificacion.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </Card.Header>
              
              <Card.Body>
                <div className="text-center mb-3">
                  <Badge 
                    bg={getGradeBadgeVariant(calificacion.calificacion)}
                    className="mb-2"
                  >
                    {getGradeText(calificacion.calificacion)}
                  </Badge>
                </div>
                
                <div className="info-row d-flex align-items-center">
                  <FaUser className="text-primary me-3" />
                  <div>
                    <small className="text-muted d-block">Estudiante</small>
                    <strong>{getUsuarioNombre(calificacion.estudiante_id)}</strong>
                  </div>
                </div>
                
                <div className="info-row d-flex align-items-center">
                  <FaBook className="text-info me-3" />
                  <div>
                    <small className="text-muted d-block">Clase</small>
                    <strong>{getClaseNombre(calificacion.materia_id)}</strong>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
        size="md"
      >
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>
            {editMode ? 'Editar Calificación' : 'Nueva Calificación'}
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <FaUser className="me-2 text-primary" />
                Estudiante
              </Form.Label>
=======
  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h2>Gestión de Calificaciones</h2>
        <Button variant="primary" onClick={handleAdd}>
          <FaPlus className="me-2" /> Nueva Calificación
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Estudiante</th>
            <th>Clase</th>
            <th>Calificación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {calificaciones.map(calificacion => (
            <tr key={calificacion.id}>
              <td>{calificacion.id}</td>
              <td>{getUsuarioNombre(calificacion.estudiante_id)}</td>
              <td>{getClaseNombre(calificacion.materia_id)}</td>
              <td>{calificacion.calificacion}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(calificacion)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(calificacion.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Calificación' : 'Nueva Calificación'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Estudiante</Form.Label>
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
              <Form.Select
                name="estudiante_id"
                value={formData.estudiante_id}
                onChange={handleInputChange}
                required
<<<<<<< HEAD
                className="form-control-lg"
=======
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
              >
                <option value="">Seleccionar estudiante</option>
                {usuarios.filter(u => u.rol === 'estudiante').map(usuario => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
<<<<<<< HEAD
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">
                <FaBook className="me-2 text-info" />
                Clase
              </Form.Label>
=======
            <Form.Group className="mb-3">
              <Form.Label>Clase</Form.Label>
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
              <Form.Select
                name="materia_id"
                value={formData.materia_id}
                onChange={handleInputChange}
                required
<<<<<<< HEAD
                className="form-control-lg"
=======
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
              >
                <option value="">Seleccionar clase</option>
                {clases.map(clase => (
                  <option key={clase.id} value={clase.id}>{clase.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
<<<<<<< HEAD
            
            <Form.Group className="mb-4">
              <Form.Label className="fw-semibold">
                <FaStar className="me-2 text-warning" />
                Calificación
              </Form.Label>
=======
            <Form.Group className="mb-3">
              <Form.Label>Calificación</Form.Label>
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="0.1"
                name="calificacion"
                value={formData.calificacion}
                onChange={handleInputChange}
                required
<<<<<<< HEAD
                className="form-control-lg"
                placeholder="Ingresa la calificación (0-100)"
              />
              <Form.Text className="text-muted">
                La calificación debe estar entre 0 y 100
              </Form.Text>
            </Form.Group>
            
            <div className="d-flex gap-3 justify-content-end">
              <Button 
                variant="secondary" 
                onClick={() => setShowModal(false)}
                size="lg"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="primary"
                disabled={loading}
                size="lg"
                className="px-4"
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2" role="status" />
                    Guardando...
                  </>
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
=======
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
>>>>>>> 1992e56078084cfec23482be0219a6497c145bde
  );
};

export default CalificacionesList;