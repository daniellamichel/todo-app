const { Pool } = require('pg');

const pool = new Pool({
  user: '[postgresql]',
  host: 'localhost',
  database: 'databasedb',
  password: '3533',
  port: 5432
});

const getTasksFromDatabase = async () => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    return result.rows;
  } catch (error) {
    console.error('Error getting tasks from the database:', error);
    throw error;
  }
};

const addTaskToDatabase = async (task) => {
  try {
    const { task_name, category, completed } = task;
    const result = await pool.query(
      'INSERT INTO tasks (task_name, category, completed) VALUES ($1, $2, $3) RETURNING *',
      [task_name, category, completed]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding task to the database:', error);
    throw error;
  }
};

const updateTaskInDatabase = async (taskId, completed) => {
  try {
    const result = await pool.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [completed, taskId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating task in the database:', error);
    throw error;
  }
};

const deleteTaskFromDatabase = async (taskId) => {
  try {
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [taskId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error deleting task from the database:', error);
    throw error;
  }
};

module.exports = {
  getTasksFromDatabase,
  addTaskToDatabase,
  updateTaskInDatabase,
  deleteTaskFromDatabase,
};