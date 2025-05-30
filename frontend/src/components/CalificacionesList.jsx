import React, { useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

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
        ? `http://localhost:3004/calificaciones/${formData.id}`
        : 'http://localhost:3004/calificaciones';
      
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
      const res = await fetch(`http://localhost:3004/calificaciones/${id}`, {
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
              <Form.Select
                name="estudiante_id"
                value={formData.estudiante_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar estudiante</option>
                {usuarios.filter(u => u.rol === 'estudiante').map(usuario => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Clase</Form.Label>
              <Form.Select
                name="materia_id"
                value={formData.materia_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Seleccionar clase</option>
                {clases.map(clase => (
                  <option key={clase.id} value={clase.id}>{clase.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Calificación</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="0.1"
                name="calificacion"
                value={formData.calificacion}
                onChange={handleInputChange}
                required
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
  );
};

export default CalificacionesList;