import React, { useState, useEffect } from 'react';

function UsuarioForm({ token, onSave, editingUser, onCancel }) {
  const [form, setForm] = useState({ nombre: '', email: '', password: '', rol: '' });

  useEffect(() => {
    if (editingUser) {
      setForm({
        nombre: editingUser.nombre || '',
        email: editingUser.email || '',
        password: '',
        rol: editingUser.rol || '',
      });
    } else {
      setForm({ nombre: '', email: '', password: '', rol: '' });
    }
  }, [editingUser]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>{editingUser ? 'Editar Usuario' : 'Agregar Usuario'}</h3>
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required={!editingUser}
        disabled={!!editingUser}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <input
        type="password"
        name="password"
        placeholder={editingUser ? "Nueva contraseña (dejar vacío para no cambiar)" : "Contraseña"}
        value={form.password}
        onChange={handleChange}
        required={!editingUser}
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      />
      <select
        name="rol"
        value={form.rol}
        onChange={handleChange}
        required
        style={{ width: '100%', marginBottom: 10, padding: 8 }}
      >
        <option value="">Seleccionar rol</option>
        <option value="administrativo">Administrativo</option>
        <option value="estudiante">Estudiante</option>
        <option value="profesor">Profesor</option>
      </select>
      <button type="submit" style={{ width: '100%', padding: 10, marginBottom: 10 }}>
        {editingUser ? 'Guardar Cambios' : 'Agregar Usuario'}
      </button>
      {editingUser && (
        <button type="button" onClick={onCancel} style={{ width: '100%', padding: 10, backgroundColor: '#ccc' }}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default UsuarioForm;
