const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    let query = {};
    let projects;
    
    // Scoped to what the user can see
    if (req.user.role === 'Admin') {
       // Admins see projects they created or are members of
       projects = await Project.find({ 
         $or: [{ creator: req.user._id }, { members: req.user._id }] 
       }).select('_id');
    } else {
       // Members see projects they are members of
       projects = await Project.find({ members: req.user._id }).select('_id');
    }

    const projectsCount = projects.length;
    const projectIds = projects.map(p => p._id);

    if (req.user.role !== 'Admin') {
       query.$or = [
          { assignedTo: req.user._id },
          { project: { $in: projectIds } }
       ];
    }

    const tasks = await Task.find(query).populate('assignedTo', 'name');

    const totalTasks = tasks.length;
    
    const tasksByStatus = {
      toDo: tasks.filter(t => t.status === 'To Do').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      done: tasks.filter(t => t.status === 'Done').length,
    };

    const tasksByPriority = {
      Low: tasks.filter(t => t.priority === 'Low').length,
      Medium: tasks.filter(t => t.priority === 'Medium').length,
      High: tasks.filter(t => t.priority === 'High').length,
    };

    const tasksPerUser = tasks.reduce((acc, task) => {
      const userName = task.assignedTo ? task.assignedTo.name : 'Unassigned';
      acc[userName] = (acc[userName] || 0) + 1;
      return acc;
    }, {});
    
    // Determine overdue tasks (status not Done and dueDate is past)
    const now = new Date();
    const overdueTasksCount = tasks.filter(t => t.status !== 'Done' && t.dueDate && new Date(t.dueDate) < now).length;

    // Get recent tasks
    const recentTasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('project', 'name')
      .populate('assignedTo', 'name');

    res.json({
      totalTasks,
      totalProjects: projectsCount,
      tasksByStatus,
      tasksByPriority,
      tasksPerUser,
      overdueTasksCount,
      recentTasks
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};
