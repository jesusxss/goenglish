import React, { useState, useEffect } from 'react';

function ClaseForm({ token, onSave, editingClase, onCancel }) {
  const [form, setForm] = useState({ nombre: '', descripcion: '' });

  useEffect(() => {
    if (editingClase) {
      setForm({
        nombre: editingClase.nombre || '',
        descripcion: editingClase.descripcion || '',
      });
    } else {
      setForm({ nombre: '', descripcion: '' });
    }
  }, [editingClase]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>{editingClase ? 'Editar Clase' : 'Agregar Clase'}</h3>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre de la clase"
        value={form.nombre}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <textarea
        name="descripcion"
        placeholder="Descripción"
        value={form.descripcion}
        onChange={handleChange}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <button type="submit" style={{ width: '100%', padding: 10, marginBottom: 10 }}>
        {editingClase ? 'Guardar Cambios' : 'Agregar Clase'}
      </button>
      {editingClase && (
        <button type="button" onClick={onCancel} style={{ width: '100%', padding: 10, backgroundColor: '#ccc' }}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default ClaseForm;
