import React, { useState, useEffect } from 'react';

function AsistenciaForm({ token, onSave, usuarios, clases, editingAsistencia, onCancel }) {
  const [form, setForm] = useState({ estudiante_id: '', materia_id: '', estado: '' });

  useEffect(() => {
    if (editingAsistencia) {
      setForm({
        estudiante_id: editingAsistencia.estudiante_id || '',
        materia_id: editingAsistencia.materia_id || '',
        estado: editingAsistencia.estado || '',
      });
    } else {
      setForm({ estudiante_id: '', materia_id: '', estado: '' });
    }
  }, [editingAsistencia]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>{editingAsistencia ? 'Editar Asistencia' : 'Agregar Asistencia'}</h3>
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

      <select name="estado" value={form.estado} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }}>
        <option value="">Seleccionar Estado</option>
        <option value="presente">Presente</option>
        <option value="ausente">Ausente</option>
        <option value="justificado">Justificado</option>
      </select>

      <button type="submit" style={{ width: '100%', padding: 10, marginBottom: 10 }}>
        {editingAsistencia ? 'Guardar Cambios' : 'Agregar Asistencia'}
      </button>

      {editingAsistencia && (
        <button type="button" onClick={onCancel} style={{ width: '100%', padding: 10, backgroundColor: '#ccc' }}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default AsistenciaForm;
