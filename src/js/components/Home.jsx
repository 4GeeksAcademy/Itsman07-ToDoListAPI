import React, { useState, useEffect } from 'react';

function Home() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username] = useState('Itsman07');
  const [isLoading, setIsLoading] = useState(false);

  // Cargar tareas al iniciar
  useEffect(() => {
    fetchUserTasks();
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTask = async () => {
    if (inputValue.trim() !== '') {
      setIsLoading(true);
      try {
        // POST para añadir tarea
        const response = await fetch(`https://playground.4geeks.com/todo/todos/${username}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            label: inputValue,
            is_done: false
          })
        });

        if (!response.ok) throw new Error('Error al agregar la tarea');

        // Actualizar lista después de añadir
        await fetchUserTasks();
        setInputValue('');
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteTask = async (id) => {
    setIsLoading(true);
    try {
      // DELETE para eliminar tarea
      const response = await fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Error al eliminar la tarea');

      // Actualizar lista después de eliminar
      await fetchUserTasks();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserTasks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://playground.4geeks.com/todo/users/${username}`);
      if (!response.ok) throw new Error('Error al obtener las tareas');
      
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='Todo'>
      <h1>Lista de Tareas</h1>
      
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Añadir nueva tarea..."
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          disabled={isLoading}
        />
        <button 
          onClick={handleAddTask} 
          disabled={isLoading || !inputValue.trim()}
        >
          {isLoading ? 'Añadiendo...' : 'Añadir Tarea'}
        </button>
      </div>

      {isLoading && todos.length === 0 ? (
        <p>Cargando tareas...</p>
      ) : (
        <ul>
          {todos.map(todo => (
            <li key={todo.id}>
              {todo.label}
              <button 
                onClick={() => handleDeleteTask(todo.id)} 
                disabled={isLoading}
              >
                {isLoading ? 'Eliminando...' : 'Eliminar'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;