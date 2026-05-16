const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  const { name, description, members } = req.body;

  try {
    const project = new Project({
      name,
      description,
      creator: req.user._id,
      members: members ? [...members, req.user._id] : [req.user._id],
    });

    // Automatically make creator an admin if they are not
    if (req.user.role !== 'Admin') {
       const user = await User.findById(req.user._id);
       user.role = 'Admin';
       await user.save();
    }

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all projects for user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    // If admin, they see all projects they created or are part of
    // If member, they see projects they are members of
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find({ $or: [{ creator: req.user._id }, { members: req.user._id }] }).populate('members', 'name email');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('members', 'name email');
    }
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email role')
      .populate('creator', 'name email');

    if (project) {
      // Check access
      if (req.user.role !== 'Admin' && !project.members.some(m => m._id.toString() === req.user._id.toString())) {
         return res.status(403).json({ message: 'Not authorized to view this project' });
      }
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add member to project
// @route   PUT /api/projects/:id/members
// @access  Private/Admin
const addMemberToProject = async (req, res) => {
  const { userId } = req.body;
  
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
       // Only creator or admin can add members
       if (project.creator.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
          return res.status(403).json({ message: 'Not authorized to add members' });
       }
       
       if (!project.members.includes(userId)) {
          project.members.push(userId);
          await project.save();
          res.json(project);
       } else {
          res.status(400).json({ message: 'User is already a member' });
       }
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private/Admin
const removeMemberFromProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
       if (project.creator.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
          return res.status(403).json({ message: 'Not authorized to remove members' });
       }
       
       project.members = project.members.filter(m => m.toString() !== req.params.userId);
       await project.save();
       res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  addMemberToProject,
  removeMemberFromProject
};
