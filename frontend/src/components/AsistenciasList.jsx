import React, { useState } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const AsistenciasList = ({ asistencias, usuarios, clases, token, fetchAsistencias, showError, showSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    estudiante_id: '', 
    materia_id: '', 
    estado: 'presente' 
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
        ? `http://localhost:3003/asistencias/${formData.id}`
        : 'http://localhost:3003/asistencias';
      
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
          estado: formData.estado
        })
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || (editMode ? 'Error al actualizar asistencia' : 'Error al crear asistencia'));
      }
      
      showSuccess(editMode ? 'Asistencia actualizada correctamente' : 'Asistencia creada correctamente');
      fetchAsistencias();
      setShowModal(false);
    } catch (err) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta asistencia?')) return;
    
    try {
      const res = await fetch(`http://localhost:3003/asistencias/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error('Error al eliminar asistencia');
      
      showSuccess('Asistencia eliminada correctamente');
      fetchAsistencias();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleEdit = (asistencia) => {
    setFormData({
      id: asistencia.id,
      estudiante_id: asistencia.estudiante_id,
      materia_id: asistencia.materia_id,
      estado: asistencia.estado
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleAdd = () => {
    setFormData({ 
      estudiante_id: '', 
      materia_id: '', 
      estado: 'presente' 
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
        <h2>Gestión de Asistencias</h2>
        <Button variant="primary" onClick={handleAdd}>
          <FaPlus className="me-2" /> Nueva Asistencia
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Estudiante</th>
            <th>Clase</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asistencias.map(asistencia => (
            <tr key={asistencia.id}>
              <td>{asistencia.id}</td>
              <td>{getUsuarioNombre(asistencia.estudiante_id)}</td>
              <td>{getClaseNombre(asistencia.materia_id)}</td>
              <td>{asistencia.estado}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(asistencia)}>
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(asistencia.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Editar Asistencia' : 'Nueva Asistencia'}</Modal.Title>
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
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                required
              >
                <option value="presente">Presente</option>
                <option value="ausente">Ausente</option>
                <option value="justificado">Justificado</option>
                <option value="tardanza">Tardanza</option>
              </Form.Select>
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

export default AsistenciasList;