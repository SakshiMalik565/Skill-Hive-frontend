import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import projectService from '../services/projectService';
import toast from 'react-hot-toast';
import './CreateProject.css';

export default function CreateProject() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) {
      toast.error('Project name is required');
      return;
    }

    try {
      setLoading(true);
      const res = await projectService.create({
        name: name.trim(),
        description: description.trim(),
      });
      const project = res.data.data.project;
      navigate(`/projects/${project._id}`);
    } catch (error) {
      toast.error(error?.message || 'Unable to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <section className="create-project-page">
        <div className="container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FiArrowLeft /> Back
          </button>

          <motion.div
            className="create-project-card card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="page-title">Create Project</h1>
            <p className="page-subtitle">Set up a new project and start planning tasks.</p>

            <form className="create-project-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter project name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Describe your project goals"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={<FiSave />}
              >
                Create Project
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
