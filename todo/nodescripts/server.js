const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
var cors = require('cors')

const app = express();
app.use(cors())
const PORT = 5000;

app.use(bodyParser.json());

const tasksFile = 'server/tasks.json';

// Read tasks from the JSON file
const readTasks = async () => {
  try {
    const data = await fs.readFile(tasksFile);
    // console.log(JSON.parse(data))
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tasks:', error.message);
    return [];
  }
};

// Write tasks to the JSON file
const writeTasks = async (tasks) => {
  try {
    await fs.writeFile(tasksFile, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks:', error.message);
  }
};

// Get tasks
app.get('/tasks', async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
});

// Add a new task
app.post('/tasks', async (req, res) => {
  const { id, title, description, status } = req.body;
  const tasks = await readTasks();
  const newTask = { id, title, description, status };
  tasks.push(newTask);
  await writeTasks(tasks);
  res.json(newTask);  
});


// Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const tasks = await readTasks();
  const updatedTasks = tasks.filter((task) => task.id !== parseInt(id));
  if (updatedTasks.length !== tasks.length) {
    await writeTasks(updatedTasks);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});