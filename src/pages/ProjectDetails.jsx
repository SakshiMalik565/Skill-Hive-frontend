import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiPlusCircle } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import projectService from '../services/projectService';
import taskService from '../services/taskService';
import toast from 'react-hot-toast';
import './ProjectDetails.css';

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProject = async () => {
    try {
      setIsLoading(true);
      const [projectRes, tasksRes] = await Promise.all([
        projectService.getById(id),
        taskService.getByProject(id),
      ]);
      setProject(projectRes.data.data.project);
      setTasks(tasksRes.data.data.tasks || []);
    } catch (error) {
      toast.error(error?.message || 'Unable to load project');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading project..." />;
  }

  if (!project) {
    return (
      <AnimatedPage>
        <section className="project-details-page">
          <div className="container">
            <div className="projects-empty">
              <h3>Project not found</h3>
              <Button variant="teal" onClick={() => navigate('/projects')}>
                Back to Projects
              </Button>
            </div>
          </div>
        </section>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <section className="project-details-page">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>

          <div className="project-details-header">
            <div>
              <h1 className="page-title">{project.name}</h1>
              <p className="page-subtitle">{project.description || 'No description provided.'}</p>
            </div>
            <Link to={`/projects/${project._id}/tasks/new`}>
              <Button variant="primary" icon={<FiPlusCircle />}>
                Create Task
              </Button>
            </Link>
          </div>

          <div className="project-tasks">
            {tasks.length === 0 ? (
              <div className="projects-empty">
                <h3>No tasks yet</h3>
                <p>Create tasks to keep this project on track.</p>
              </div>
            ) : (
              <div className="task-grid">
                {tasks.map((task, index) => (
                  <motion.div
                    key={task._id}
                    className="task-card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <div className="task-card-header">
                      <h3>{task.title}</h3>
                      <span className={`task-status task-${task.status}`}>
                        {STATUS_LABELS[task.status] || task.status}
                      </span>
                    </div>
                    <p>{task.description || 'No description provided.'}</p>
                    <div className="task-card-actions">
                      <Link to={`/tasks/${task._id}/edit`} className="task-link">
                        Edit Task
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
