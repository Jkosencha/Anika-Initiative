// src/features/admin/stories/Stories.jsx
import { useMemo, useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { PILLARS, getPillar, STATUS_STYLES, STATUS_LABELS } from './data/pillars'
import StoryEditor from './StoryEditor'
import { storiesStore } from '../../../data/storiesStore'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'published', label: 'Published' },
  { key: 'draft', label: 'Draft' },
  { key: 'review', label: 'Submissions' },
]

function Stories() {
  const [stories, setStories] = useState([])
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState('list')
  const [editingStory, setEditingStory] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  // Load stories from store
  const loadStories = () => {
    setIsLoading(true)
    const allStories = storiesStore.getAll()
    setStories(allStories)
    setIsLoading(false)
  }

  // Initial load and subscribe to changes
  useEffect(() => {
    loadStories()
    const unsubscribe = storiesStore.subscribe(loadStories)
    return unsubscribe
  }, [])

  const filteredStories = useMemo(
    () => filter === 'all' ? stories : stories.filter((s) => s.status === filter),
    [stories, filter]
  )

  function openNewStory() {
    setEditingStory(null)
    setView('editor')
  }

  function openEditStory(story) {
    const fullStory = storiesStore.getById(story.id)
    setEditingStory(fullStory)
    setView('editor')
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this story?')) {
      storiesStore.delete(id)
    }
  }

  function handleSave(payload) {
    storiesStore.save(payload)
    setView('list')
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (view === 'editor') {
    return <StoryEditor story={editingStory} onCancel={() => setView('list')} onSave={handleSave} />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-coral border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide">Stories</h1>
          <p className="mt-1 text-sm text-ink/60 dark:text-cream/60">
            Publish and manage stories, on brand voice.
          </p>
        </div>
        <button
          onClick={openNewStory}
          className="flex items-center justify-center gap-2 rounded-lg bg-coral px-4 py-2 text-sm font-medium text-white hover:bg-coral/90 w-full sm:w-auto"
        >
          <Plus size={16} />
          New story
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-ink text-cream dark:bg-cream dark:text-ink'
                : 'text-ink/50 hover:text-ink dark:text-cream/50 dark:hover:text-cream'
            }`}
          >
            {f.label} ({f.key === 'all' ? stories.length : stories.filter(s => s.status === f.key).length})
          </button>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-ink/10 bg-white dark:border-white/10 dark:bg-white/5">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-ink/10 text-xs uppercase tracking-wider text-ink/40 dark:border-white/10 dark:text-cream/40">
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="px-5 py-3 font-medium">Pillar</th>
              <th className="px-5 py-3 font-medium">Author</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Published Date</th>
              <th className="px-5 py-3 font-medium">Updated</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10 dark:divide-white/10">
            {filteredStories.map((story) => {
              const pillar = getPillar(story.pillar)
              const isPublished = story.status === 'published'
              return (
                <tr key={story.id} className="hover:bg-ink/5 dark:hover:bg-white/5">
                  <td className="flex items-center gap-3 px-5 py-3 font-medium">
                    <div className="h-9 w-14 shrink-0 overflow-hidden rounded-md bg-ink/10 dark:bg-white/10">
                      {story.thumbnail && (
                        <img src={story.thumbnail} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <span className="line-clamp-1">{story.title}</span>
                  </td>
                  <td className="px-5 py-3">
                    {pillar && (
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${pillar.chipClass}`}>
                        {pillar.label}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink/70 dark:text-cream/70">{story.author}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[story.status]}`}>
                      {STATUS_LABELS[story.status] || story.status}
                    </span>
                    {isPublished && (
                      <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-anika-green animate-pulse"></span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-ink/70 dark:text-cream/70">
                    {story.date ? new Date(story.date).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-5 py-3 text-ink/50 dark:text-cream/50">
                    {new Date(story.updated).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      {isPublished && (
                        <a
                          href={`/stories/${story.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink dark:text-cream/40 dark:hover:bg-white/5 dark:hover:text-cream"
                          title="View on website"
                        >
                          <Eye size={16} />
                        </a>
                      )}
                      <button
                        onClick={() => openEditStory(story)}
                        className="rounded-lg p-1.5 text-anika-blue/70 hover:bg-anika-blue/10 hover:text-anika-blue"
                        title="Edit story"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(story.id)}
                        className="rounded-lg p-1.5 text-coral/70 hover:bg-coral/10 hover:text-coral"
                        title="Delete story"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filteredStories.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-ink/40 dark:text-cream/40">
                  No stories in this view yet. Click "New story" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredStories.map((story) => {
          const pillar = getPillar(story.pillar)
          const isPublished = story.status === 'published'
          const isExpanded = expandedId === story.id

          return (
            <div
              key={story.id}
              className="rounded-2xl border border-ink/10 bg-white p-4 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-start gap-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink/10 dark:bg-white/10">
                  {story.thumbnail && (
                    <img src={story.thumbnail} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2">{story.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {pillar && (
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${pillar.chipClass}`}>
                        {pillar.label}
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[story.status]}`}>
                      {STATUS_LABELS[story.status] || story.status}
                    </span>
                    {isPublished && (
                      <span className="inline-block h-2 w-2 rounded-full bg-anika-green animate-pulse"></span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleExpand(story.id)}
                  className="shrink-0 p-1 text-ink/40 hover:text-ink dark:text-cream/40 dark:hover:text-cream"
                >
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-ink/10 dark:border-white/10 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-ink/40 dark:text-cream/40">Author</p>
                      <p className="font-medium text-ink dark:text-cream">{story.author}</p>
                    </div>
                    <div>
                      <p className="text-xs text-ink/40 dark:text-cream/40">Published Date</p>
                      <p className="font-medium text-ink dark:text-cream">
                        {story.date ? new Date(story.date).toLocaleDateString() : '—'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-ink/40 dark:text-cream/40">Last Updated</p>
                      <p className="font-medium text-ink dark:text-cream">
                        {new Date(story.updated).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-ink/10 dark:border-white/10">
                    {isPublished && (
                      <a
                        href={`/stories/${story.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 rounded-lg border border-ink/10 px-3 py-1.5 text-sm font-medium text-ink/70 hover:bg-ink/5 dark:border-white/10 dark:text-cream/70 dark:hover:bg-white/5"
                      >
                        <Eye size={14} />
                        View
                      </a>
                    )}
                    <button
                      onClick={() => openEditStory(story)}
                      className="flex items-center gap-1 rounded-lg border border-anika-blue/20 px-3 py-1.5 text-sm font-medium text-anika-blue hover:bg-anika-blue/5"
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="flex items-center gap-1 rounded-lg border border-coral/20 px-3 py-1.5 text-sm font-medium text-coral hover:bg-coral/5"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filteredStories.length === 0 && (
          <div className="rounded-2xl border border-ink/10 bg-white p-8 text-center text-sm text-ink/40 dark:border-white/10 dark:bg-white/5 dark:text-cream/40">
            No stories in this view yet. Click "New story" to create one.
          </div>
        )}
      </div>
    </div>
  )
}

export default Stories