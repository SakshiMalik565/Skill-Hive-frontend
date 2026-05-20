import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiSend, FiX, FiImage, FiVideo, FiPlus, FiUser, FiTrash2 } from 'react-icons/fi';
import AnimatedPage from '../components/AnimatedPage';
import AssetCard from '../components/AssetCard';
import LoadingSpinner from '../components/LoadingSpinner';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import assetService from '../services/assetService';
import toast from 'react-hot-toast';
import './Feed.css';

export default function Feed() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [newAsset, setNewAsset] = useState({
    skillOffered: '',
    description: '',
  });
  const [assetPhotos, setAssetPhotos] = useState([]);
  const [assetVideos, setAssetVideos] = useState([]);
  const photoInputRef = useRef(null);
  const videoInputRef = useRef(null);

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
      const formData = new FormData();
      formData.append('skillOffered', newAsset.skillOffered.trim());
      formData.append('description', newAsset.description.trim());
      assetPhotos.forEach((file) => formData.append('photos', file));
      assetVideos.forEach((file) => formData.append('videos', file));

      await assetService.createAsset(formData);
      setNewAsset({ skillOffered: '', description: '' });
      setAssetPhotos([]);
      setAssetVideos([]);
      setShowPostForm(false);
      toast.success('Asset posted!');
      loadAssets(false);
    } catch (error) {
      toast.error(error?.message || 'Unable to create asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    try {
      await assetService.deleteAsset(assetId);
      setAssets((prev) => prev.filter((a) => a._id !== assetId));
      setSelectedAsset(null);
      toast.success('Asset deleted');
    } catch (error) {
      toast.error(error?.message || 'Failed to delete asset');
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
              <h1>Feed</h1>
            </div>
            <div className="feed-header-actions">
              <button
                className={`feed-icon-btn ${showSearch ? 'active' : ''}`}
                onClick={() => { setShowSearch((p) => !p); setShowFilter(false); }}
                title="Search"
              >
                {showSearch ? <FiX /> : <FiSearch />}
              </button>
              <button
                className={`feed-icon-btn ${showFilter ? 'active' : ''}`}
                onClick={() => { setShowFilter((p) => !p); setShowSearch(false); }}
                title="Filter by skill"
              >
                {showFilter ? <FiX /> : <FiFilter />}
              </button>
              <button
                className={`feed-icon-btn post ${showPostForm ? 'active' : ''}`}
                onClick={() => setShowPostForm((p) => !p)}
                title="Post new asset"
              >
                {showPostForm ? <FiX /> : <FiPlus />}
              </button>
            </div>
          </motion.div>

          {showSearch && (
            <form className="feed-inline-bar" onSubmit={handleSearchSubmit}>
              <FiSearch />
              <input
                type="text"
                placeholder="Search skills or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <button type="submit" className="feed-inline-go">
                {isFetching ? '...' : 'Go'}
              </button>
            </form>
          )}

          {showFilter && (
            <form className="feed-inline-bar" onSubmit={handleSearchSubmit}>
              <FiFilter />
              <input
                type="text"
                placeholder="Filter by skill name..."
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                autoFocus
              />
              <button type="submit" className="feed-inline-go">
                {isFetching ? '...' : 'Go'}
              </button>
            </form>
          )}

          {showPostForm && (
            <motion.form
              className="feed-post-card card"
              onSubmit={handleAssetSubmit}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <h3 className="feed-post-title">Share Your Skill</h3>
              <div className="feed-post-fields">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Skill you offer (e.g. React, Figma, Guitar)"
                  value={newAsset.skillOffered}
                  onChange={(e) => setNewAsset((prev) => ({ ...prev, skillOffered: e.target.value }))}
                />
                <textarea
                  className="form-input feed-post-textarea"
                  placeholder="Describe what you can teach or share..."
                  value={newAsset.description}
                  onChange={(e) => setNewAsset((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="feed-post-actions">
                <div className="feed-post-uploads">
                  <input
                    type="file"
                    ref={photoInputRef}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => setAssetPhotos(Array.from(e.target.files || []))}
                  />
                  <button
                    type="button"
                    className="feed-upload-btn"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <FiImage />
                    {assetPhotos.length > 0 ? `${assetPhotos.length} photo(s)` : 'Photos'}
                  </button>
                  <input
                    type="file"
                    ref={videoInputRef}
                    accept="video/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={(e) => setAssetVideos(Array.from(e.target.files || []))}
                  />
                  <button
                    type="button"
                    className="feed-upload-btn"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <FiVideo />
                    {assetVideos.length > 0 ? `${assetVideos.length} video(s)` : 'Videos'}
                  </button>
                </div>
                <Button
                  type="submit"
                  variant="teal"
                  size="sm"
                  icon={<FiSend />}
                  loading={isSubmitting}
                >
                  Post
                </Button>
              </div>
            </motion.form>
          )}

          <div className="feed-grid">
            {assets.length === 0 ? (
              <div className="feed-empty">
                <h3>No assets found</h3>
                <p>Try adjusting your search or filters.</p>
              </div>
            ) : (
              assets.map((asset, index) => (
                <div key={asset._id} onClick={() => setSelectedAsset(asset)} style={{ cursor: 'pointer' }}>
                  <AssetCard asset={asset} index={index} showActions={false} />
                </div>
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

        {/* Asset Detail Modal */}
        {selectedAsset && (
          <div className="asset-modal-overlay" onClick={() => setSelectedAsset(null)}>
            <motion.div
              className="asset-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <button className="asset-modal-close" onClick={() => setSelectedAsset(null)}>
                <FiX />
              </button>
              <div className="asset-modal-media">
                {selectedAsset.backgroundPhoto || selectedAsset.photos?.[0] ? (
                  <img src={selectedAsset.backgroundPhoto || selectedAsset.photos[0]} alt={selectedAsset.skillOffered} />
                ) : selectedAsset.videos?.[0] ? (
                  <video src={selectedAsset.videos[0]} controls preload="metadata" />
                ) : (
                  <div className="asset-modal-fallback" />
                )}
              </div>
              <div className="asset-modal-body">
                <h2>{selectedAsset.skillOffered}</h2>
                <p className="asset-modal-desc">{selectedAsset.description}</p>
                <div className="asset-modal-user">
                  <FiUser />
                  <span>{selectedAsset.user?.name || selectedAsset.user?.email || 'Unknown'}</span>
                </div>
                <div className="asset-modal-actions">
                  <Button variant="secondary" size="sm" onClick={() => { setSelectedAsset(null); navigate(`/profile/${selectedAsset.user?._id}`); }}>
                    View Profile
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => { setSelectedAsset(null); navigate(`/create-swap?receiverId=${selectedAsset.user?._id}`); }}>
                    Request Swap
                  </Button>
                  {(selectedAsset.user?._id === user?._id) && (
                    <Button variant="danger" size="sm" icon={<FiTrash2 />} onClick={() => handleDeleteAsset(selectedAsset._id)}>
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </section>
    </AnimatedPage>
  );
}
