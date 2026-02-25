import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiSend } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import AssetCard from '../components/AssetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import assetService from '../services/assetService';
import toast from 'react-hot-toast';
import './Feed.css';

export default function Feed() {
  const [assets, setAssets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAsset, setNewAsset] = useState({
    skillOffered: '',
    description: '',
    backgroundPhoto: '',
  });

  const params = useMemo(
    () => ({
      page: pagination.page,
      limit: 8,
      search: search.trim() || undefined,
      skill: skillFilter.trim() || undefined,
    }),
    [pagination.page, search, skillFilter]
  );

  const loadAssets = async (isInitial = false) => {
    try {
      if (isInitial) {
        setIsLoading(true);
      } else {
        setIsFetching(true);
      }
      const res = await assetService.getAssets(params);
      setAssets(res.data.data.assets || []);
      setPagination(res.data.data.pagination || { page: 1, pages: 1 });
    } catch (error) {
      toast.error(error?.message || 'Unable to load feed');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadAssets(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadAssets(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.page, params.search, params.skill]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadAssets(false);
  };

  const handleAssetSubmit = async (event) => {
    event.preventDefault();
    if (!newAsset.skillOffered.trim() || !newAsset.description.trim()) {
      toast.error('Skill and description are required');
      return;
    }
    try {
      setIsSubmitting(true);
      await assetService.createAsset({
        skillOffered: newAsset.skillOffered.trim(),
        description: newAsset.description.trim(),
        backgroundPhoto: newAsset.backgroundPhoto.trim(),
      });
      setNewAsset({ skillOffered: '', description: '', backgroundPhoto: '' });
      toast.success('Asset posted. Others can see it in their feed.');
    } catch (error) {
      toast.error(error?.message || 'Unable to create asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Loading skill assets..." />;
  }

  return (
    <AnimatedPage>
      <section className="feed-page">
        <div className="container">
          <motion.div
            className="feed-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1>Skill Assets Feed</h1>
              <p>Discover what others are offering and request a swap.</p>
            </div>
          </motion.div>

          <form className="feed-create" onSubmit={handleAssetSubmit}>
            <div className="feed-create-fields">
              <input
                type="text"
                placeholder="Skill you offer"
                value={newAsset.skillOffered}
                onChange={(event) =>
                  setNewAsset((prev) => ({ ...prev, skillOffered: event.target.value }))
                }
              />
              <input
                type="text"
                placeholder="Short description of your skill"
                value={newAsset.description}
                onChange={(event) =>
                  setNewAsset((prev) => ({ ...prev, description: event.target.value }))
                }
              />
              <input
                type="url"
                placeholder="Background image URL (optional)"
                value={newAsset.backgroundPhoto}
                onChange={(event) =>
                  setNewAsset((prev) => ({ ...prev, backgroundPhoto: event.target.value }))
                }
              />
            </div>
            <Button
              type="submit"
              variant="teal"
              size="sm"
              icon={<FiSend />}
              loading={isSubmitting}
            >
              Post Asset
            </Button>
          </form>

          <form className="feed-filters" onSubmit={handleSearchSubmit}>
            <div className="feed-search">
              <FiSearch />
              <input
                type="text"
                placeholder="Search skills or keywords"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="feed-skill">
              <FiFilter />
              <input
                type="text"
                placeholder="Filter by skill"
                value={skillFilter}
                onChange={(event) => setSkillFilter(event.target.value)}
              />
            </div>
            <button type="submit" className="feed-filter-btn">
              {isFetching ? 'Filtering...' : 'Apply Filters'}
            </button>
          </form>

          <div className="feed-grid">
            {assets.length === 0 ? (
              <div className="feed-empty">
                <h3>No assets found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              assets.map((asset, index) => (
                <AssetCard key={asset._id} asset={asset} index={index} />
              ))
            )}
          </div>

          <div className="feed-pagination">
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
