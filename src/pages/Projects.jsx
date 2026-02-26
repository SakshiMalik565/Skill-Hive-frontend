import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlusCircle, FiSearch } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import projectService from '../services/projectService';
import toast from 'react-hot-toast';
import './Projects.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const params = useMemo(
    () => ({
      page: pagination.page,
      limit: 8,
      search: search.trim() || undefined,
    }),
    [pagination.page, search]
  );

  const loadProjects = async (initial = false) => {
    try {
      initial ? setIsLoading(true) : setIsFetching(true);
      const res = await projectService.getAll(params);
      setProjects(res.data.data.projects || []);
      setPagination(res.data.data.pagination || { page: 1, pages: 1 });
    } catch (error) {
      toast.error(error?.message || 'Unable to load projects');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadProjects(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadProjects(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.search]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadProjects(false);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading projects..." />;
  }

  return (
    <AnimatedPage>
      <section className="projects-page">
        <div className="container">
          <div className="projects-header">
            <div>
              <h1 className="page-title">Projects</h1>
              <p className="page-subtitle">Track your tasks and progress.</p>
            </div>
            <Link to="/projects/new">
              <Button variant="primary" icon={<FiPlusCircle />}>
                Create Project
              </Button>
            </Link>
          </div>

          <form className="projects-search" onSubmit={handleSearch}>
            <FiSearch />
            <input
              type="text"
              placeholder="Search projects"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button type="submit" className="projects-search-btn">
              {isFetching ? 'Searching...' : 'Search'}
            </button>
          </form>

          {projects.length === 0 ? (
            <div className="projects-empty">
              <h3>No projects yet</h3>
              <p>Create your first project to start tracking tasks.</p>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  className="project-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <h3>{project.name}</h3>
                  <p>{project.description || 'No description provided.'}</p>
                  <Link to={`/projects/${project._id}`} className="project-card-link">
                    View Details
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="projects-pagination">
            <button
              type="button"
              disabled={pagination.page <= 1}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <button
              type="button"
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </AnimatedPage>
  );
}
