import React, { useState, useEffect } from 'react';

function CalificacionForm({ token, onSave, usuarios, clases, editingCalificacion, onCancel }) {
  const [form, setForm] = useState({ estudiante_id: '', materia_id: '', calificacion: '' });

  useEffect(() => {
    if (editingCalificacion) {
      setForm({
        estudiante_id: editingCalificacion.estudiante_id || '',
        materia_id: editingCalificacion.materia_id || '',
        calificacion: editingCalificacion.calificacion || '',
      });
    } else {
      setForm({ estudiante_id: '', materia_id: '', calificacion: '' });
    }
  }, [editingCalificacion]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>{editingCalificacion ? 'Editar Calificación' : 'Agregar Calificación'}</h3>
      <select name="estudiante_id" value={form.estudiante_id} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }}>
        <option value="">Seleccionar Estudiante</option>
        {usuarios.map(u => (
          <option key={u.id} value={u.id}>{u.nombre} ({u.email})</option>
        ))}
      </select>

      <select name="materia_id" value={form.materia_id} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }}>
        <option value="">Seleccionar Clase</option>
        {clases.map(c => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>

      <input
        type="number"
        name="calificacion"
        placeholder="Calificación"
        value={form.calificacion}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />

      <button type="submit" style={{ width: '100%', padding: 10, marginBottom: 10 }}>
        {editingCalificacion ? 'Guardar Cambios' : 'Agregar Calificación'}
      </button>

      {editingCalificacion && (
        <button type="button" onClick={onCancel} style={{ width: '100%', padding: 10, backgroundColor: '#ccc' }}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default CalificacionForm;
