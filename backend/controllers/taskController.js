const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
  const { title, description, dueDate, priority, project, assignedTo } = req.body;

  try {
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      project,
      assignedTo,
      createdBy: req.user._id,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    
    let query = {};
    
    if (projectId) {
       query.project = projectId;
    }
    
    if (status) {
       query.status = status;
    }

    // Admin sees all based on query. Members see tasks assigned to them or in projects they are part of.
    if (req.user.role !== 'Admin') {
       // Find projects user is part of
       const projects = await Project.find({ members: req.user._id }).select('_id');
       const projectIds = projects.map(p => p._id);
       
       query.$or = [
          { assignedTo: req.user._id },
          { project: { $in: projectIds } }
       ];
    }

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('project', 'name');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update task status or details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      // Check authorization (Admin or Assignee can update)
      if (req.user.role !== 'Admin' && task.assignedTo?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }

      task.status = req.body.status || task.status;
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.dueDate = req.body.dueDate || task.dueDate;
      task.priority = req.body.priority || task.priority;
      task.assignedTo = req.body.assignedTo || task.assignedTo;

      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      if (req.user.role !== 'Admin') {
         return res.status(403).json({ message: 'Not authorized to delete tasks' });
      }
      await task.deleteOne();
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
