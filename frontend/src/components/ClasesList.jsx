import React, { useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const ClasesList = ({ clases, token, fetchClases, showError, showSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: '', descripcion: '' });
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
        ? `http://localhost:3005/materias/${formData.id}`
        : 'http://localhost:3005/materias';
      
      const method = editMode ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) throw new Error(editMode ? 'Error al actualizar clase' : 'Error al crear clase');
      
      showSuccess(editMode ? 'Clase actualizada correctamente' : 'Clase creada correctamente');
      fetchClases();
      setShowModal(false);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta clase?')) return;
    
    try {
      const res = await fetch(`http://localhost:3005/materias/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Error al eliminar clase');
      
      showSuccess('Clase eliminada correctamente');
      fetchClases();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleEdit = (clase) => {
    setFormData({
      id: clase.id,
      nombre: clase.nombre,
      descripcion: clase.descripcion
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setFormData({ nombre: '', descripcion: '' });
    setEditMode(false);
    setShowModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h2>Gestión de Clases</h2>
        <Button variant="primary" onClick={handleAdd}>
          <FaPlus className="me-2" /> Nueva Clase
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clases.map(clase => (
            <tr key={clase.id}>
              <td>{clase.id}</td>
              <td>{clase.nombre}</td>
              <td>{clase.descripcion}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(clase)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(clase.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Clase' : 'Nueva Clase'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
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

export default ClasesList;