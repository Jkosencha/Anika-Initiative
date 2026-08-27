// admin/pages/stories/StoryEditor.jsx
import { useMemo, useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Undo2,
  Redo2,
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImagePlus,
  ArrowLeft,
} from 'lucide-react'
import { PILLARS, STATUS_LABELS } from './data/pillars'
import { storiesStore } from '../../../data/storiesStore'

// Same light/dark palette as Partners.jsx
const lightColors = {
  bg: "#fafaf8",
  border: "#e8e5df",
  text: "#1c1a17",
  muted: "#8c8579",
  panel: "#ffffff",
  panelAlt: "#faf8f2",
  buttonBg: "#1c1a17",
  buttonText: "#ffffff",
  inputBg: "#ffffff",
  inputPlaceholder: "#8c8579",
};

const darkColors = {
  bg: "#1a1a1a",
  border: "#3a3a3a",
  text: "#f0f0f0",
  muted: "#aaaaaa",
  panel: "#2a2a2a",
  panelAlt: "#242424",
  buttonBg: "#f0f0f0",
  buttonText: "#1a1a1a",
  inputBg: "#2a2a2a",
  inputPlaceholder: "#aaaaaa",
};

const AVOID_PHRASES = [
  'the voiceless',
  'giving people a voice',
  'saving them',
  'rescuing',
  'helpless',
  'beneficiaries',
  'sensitise',
  'victims',
]

function ToolbarButton({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault()
        onClick()
      }}
      disabled={disabled}
      title={title}
      className={`flex h-8 w-8 items-center justify-center rounded-md text-sm transition-colors disabled:opacity-30 ${
        active
          ? 'bg-coral/15 text-coral'
          : 'text-ink/70 hover:bg-ink/5 hover:text-ink dark:text-cream/70 dark:hover:bg-white/10 dark:hover:text-cream'
      }`}
    >
      {children}
    </button>
  )
}

function Toolbar({ editor }) {
  if (!editor) return null

  return (
    <div className="flex flex-wrap items-center gap-1 rounded-t-2xl border border-b-0 border-ink/10 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5">
      <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()}>
        <Undo2 size={16} />
      </ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()}>
        <Redo2 size={16} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-ink/10 dark:bg-white/10" />

      <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
        <BoldIcon size={16} />
      </ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <ItalicIcon size={16} />
      </ToolbarButton>
      <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon size={16} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-ink/10 dark:bg-white/10" />

      <ToolbarButton
        title="Heading 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <span className="font-display text-xs">H2</span>
      </ToolbarButton>
      <ToolbarButton
        title="Heading 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <span className="font-display text-xs">H3</span>
      </ToolbarButton>
      <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote size={16} />
      </ToolbarButton>
      <ToolbarButton title="Bulleted list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={16} />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-ink/10 dark:bg-white/10" />

      <ToolbarButton
        title="Link"
        active={editor.isActive('link')}
        onClick={() => {
          const url = window.prompt('Link URL:', 'https://')
          if (url) editor.chain().focus().setLink({ href: url }).run()
          else if (url === '') editor.chain().focus().unsetLink().run()
        }}
      >
        <LinkIcon size={16} />
      </ToolbarButton>
    </div>
  )
}

function StoryEditor({ story, onCancel, onSave }) {
  // Get theme from outlet context
  const { theme } = useOutletContext();
  const COLORS = theme === 'dark' ? darkColors : lightColors;

  const isNew = !story
  const [title, setTitle] = useState(story?.title || '')
  const [pillarSlug, setPillarSlug] = useState(() => {
    const mapping = {
      'arts-and-culture': 'arts-culture',
      'youth-and-migration': 'youth-migration',
    };
    const slug = story?.pillar || null;
    return mapping[slug] || slug;
  })
  const [thumbnail, setThumbnail] = useState(story?.thumbnail || null)
  const [isUploading, setIsUploading] = useState(false)
  const [saveState, setSaveState] = useState('Saved')
  const [errors, setErrors] = useState({})
  const [content, setContent] = useState(story?.content || '<p></p>')

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Start airing the story…' }),
    ],
    content: content,
    onUpdate: ({ editor: e }) => {
      setSaveState('Unsaved changes')
      const html = e.getHTML()
      setContent(html)
    },
  })

  const activePillar = useMemo(() => PILLARS.find((p) => p.slug === pillarSlug), [pillarSlug])

  const handleThumbnailUpload = async (file) => {
    setIsUploading(true);
    try {
      const base64 = await storiesStore.uploadThumbnail(file);
      setThumbnail(base64);
      setSaveState('Unsaved changes');
      setErrors((prev) => ({ ...prev, thumbnail: undefined }));
    } catch (error) {
      console.error('Failed to upload thumbnail:', error);
      setErrors((prev) => ({ ...prev, thumbnail: 'Failed to upload image. Please try again.' }));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, thumbnail: 'Image must be less than 5MB' }));
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, thumbnail: 'Please upload an image file' }));
      return;
    }
    
    handleThumbnailUpload(file);
  };

  const handleGallerySelect = (url) => {
    setThumbnail(url);
    setSaveState('Unsaved changes');
    setErrors((prev) => ({ ...prev, thumbnail: undefined }));
  };

  function validate() {
    const nextErrors = {}
    if (!pillarSlug) nextErrors.pillar = 'Select a pillar before saving.'
    if (!thumbnail) nextErrors.thumbnail = 'Add a cover image before saving.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function buildPayload(status) {
    const pillarMapping = {
      'arts-culture': 'arts-and-culture',
      'youth-migration': 'youth-and-migration',
    };
    const publicPillar = pillarMapping[pillarSlug] || pillarSlug;

    return {
      id: story?.id,
      title: title.trim() || 'Untitled story',
      pillar: publicPillar,
      thumbnail: thumbnail,
      content: content,
      status: status,
      author: story?.author || 'You',
      excerpt: story?.excerpt || '',
      date: story?.date || null,
    }
  }

  function handleSaveDraft() {
    if (!validate()) return
    onSave(buildPayload('draft'))
    setSaveState('Saved')
  }

  function handlePublish() {
    if (!validate()) return
    onSave(buildPayload('published'))
    setSaveState('Saved')
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100%" }} className="p-6 font-sans rounded-lg">
      <style>{`
        .story-editor-input::placeholder {
          color: ${COLORS.inputPlaceholder};
          opacity: 1;
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 mb-6" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
        <button
          onClick={onCancel}
          style={{ 
            border: `1px solid ${COLORS.border}`,
            background: COLORS.panel,
            color: COLORS.text
          }}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-black/5 self-start"
        >
          <ArrowLeft size={16} />
          Stories
        </button>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium" style={{ color: COLORS.muted }}>{saveState}</span>
          {story?.status === 'published' && story?.slug && (
            <a
              href={`/stories/${story.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-anika-blue/20 px-3 py-2 text-sm font-medium text-anika-blue hover:bg-anika-blue/5"
            >
              View on website
            </a>
          )}
          <button
            onClick={handleSaveDraft}
            style={{ 
              border: `1px solid ${COLORS.border}`,
              background: COLORS.panel,
              color: COLORS.text
            }}
            className="text-sm font-semibold px-4 py-2 rounded-lg hover:bg-black/5"
          >
            Save draft
          </button>
          <button
            onClick={handlePublish}
            style={{ background: COLORS.buttonBg, color: COLORS.buttonText }}
            className="text-sm font-semibold px-4 py-2 rounded-lg"
          >
            {story?.status === 'published' ? 'Update' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Errors */}
      {(errors.pillar || errors.thumbnail) && (
        <div className="rounded-xl border border-coral/30 bg-coral/5 px-4 py-3 text-sm text-coral mb-6">
          Can't save yet — {[errors.pillar, errors.thumbnail].filter(Boolean).join(' ')}
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Left Column - Editor */}
        <div className="flex flex-col">
          {/* Title Input */}
          <div style={{ 
            border: `1px solid ${COLORS.border}`,
            borderBottom: 'none',
            background: COLORS.panel,
          }} className="rounded-t-xl p-4 pb-0">
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setSaveState('Unsaved changes')
              }}
              placeholder="Story title"
              className="story-editor-input w-full bg-transparent text-xl sm:text-2xl font-bold outline-none"
              style={{ color: COLORS.text }}
            />
          </div>
          
          {/* Toolbar */}
          <Toolbar editor={editor} />
          
          {/* Editor Content */}
          <div style={{ 
            border: `1px solid ${COLORS.border}`,
            background: COLORS.panel,
          }} className="flex-1 rounded-b-xl p-4 sm:p-6 min-h-[300px]">
            <EditorContent
              editor={editor}
              className="prose prose-sm max-w-none h-full font-body focus:outline-none dark:prose-invert
                [&_.ProseMirror]:h-full [&_.ProseMirror]:focus:outline-none
                prose-headings:font-display prose-headings:font-normal prose-headings:uppercase prose-headings:tracking-wide
                prose-blockquote:font-['Cormorant_Garamond'] prose-blockquote:text-lg prose-blockquote:not-italic prose-blockquote:italic
                prose-blockquote:border-coral prose-blockquote:opacity-90
                prose-a:text-anika-blue prose-a:no-underline hover:prose-a:underline
                [&_.is-editor-empty:first-child]:before:pointer-events-none
                [&_.is-editor-empty:first-child]:before:float-left
                [&_.is-editor-empty:first-child]:before:h-0
                [&_.is-editor-empty:first-child]:before:text-ink/30
                dark:[&_.is-editor-empty:first-child]:before:text-cream/30
                [&_.is-editor-empty:first-child]:before:content-[attr(data-placeholder)]"
            />
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <aside className="flex flex-col gap-5">
          {/* Cover Image */}
          <div style={{ 
            background: COLORS.panel, 
            border: `1px solid ${errors.thumbnail ? '#b23b3b' : COLORS.border}` 
          }} className="rounded-xl p-4">
            <h3 className="text-xs font-bold tracking-wide" style={{ color: COLORS.muted }}>
              Cover image <span className="text-coral">*</span>
            </h3>
            <div className="mt-3 aspect-video overflow-hidden rounded-lg" style={{ background: COLORS.panelAlt }}>
              {thumbnail ? (
                <img 
                  src={storiesStore.getImageUrl(thumbnail)} 
                  alt="Story cover" 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="flex h-full items-center justify-center" style={{ color: COLORS.muted }}>
                  <ImagePlus size={28} />
                </div>
              )}
            </div>
            
            <div className="mt-3 space-y-2">
              <label className="block w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={isUploading}
                />
                <div 
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium text-center ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ 
                    border: `1px solid ${COLORS.border}`,
                    background: COLORS.panel,
                    color: COLORS.text
                  }}
                >
                  {isUploading ? 'Uploading...' : 'Upload image'}
                </div>
              </label>
              
              <button
                onClick={() => {
                  const url = window.prompt('Enter image URL:', thumbnail || 'https://picsum.photos/seed/story/800/600');
                  if (url) {
                    handleGallerySelect(url);
                  }
                }}
                className="w-full rounded-lg px-3 py-2 text-sm font-medium"
                style={{ 
                  border: `1px solid ${COLORS.border}`,
                  background: COLORS.panel,
                  color: COLORS.text
                }}
              >
                Or enter image URL
              </button>
            </div>
            
            {errors.thumbnail && <p className="mt-2 text-xs text-coral">{errors.thumbnail}</p>}
            {thumbnail && storiesStore.getImageUrl(thumbnail).startsWith('data:image/') && (
              <p className="mt-1 text-xs" style={{ color: COLORS.muted }}>
                ✓ Image saved in localStorage
              </p>
            )}
          </div>

          {/* Pillar Selection */}
          <div style={{ 
            background: COLORS.panel, 
            border: `1px solid ${errors.pillar ? '#b23b3b' : COLORS.border}` 
          }} className="rounded-xl p-4">
            <h3 className="text-xs font-bold tracking-wide" style={{ color: COLORS.muted }}>
              Pillar <span className="text-coral">*</span>
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {PILLARS.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => {
                    setPillarSlug(p.slug)
                    setErrors((prev) => ({ ...prev, pillar: undefined }))
                  }}
                  style={{
                    border: `1px solid ${pillarSlug === p.slug ? 'transparent' : COLORS.border}`,
                    background: pillarSlug === p.slug ? COLORS.text : COLORS.panel,
                    color: pillarSlug === p.slug ? COLORS.panel : COLORS.text,
                  }}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    pillarSlug === p.slug ? p.ringClass : ''
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {activePillar ? (
              <p className="mt-3 text-xs leading-relaxed" style={{ color: COLORS.muted }}>{activePillar.description}</p>
            ) : (
              <p className="mt-3 text-xs leading-relaxed" style={{ color: COLORS.muted }}>No pillar selected yet.</p>
            )}
            {errors.pillar && <p className="mt-2 text-xs text-coral">{errors.pillar}</p>}
          </div>

          {/* Publication Info */}
          <div style={{ 
            background: COLORS.panel, 
            border: `1px solid ${COLORS.border}` 
          }} className="hidden sm:block rounded-xl p-4">
            <h3 className="text-xs font-bold tracking-wide" style={{ color: COLORS.muted }}>
              Publication Info
            </h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between pb-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ color: COLORS.muted }}>Status</span>
                <span className={`font-medium ${
                  story?.status === 'published' 
                    ? 'text-anika-green' 
                    : story?.status === 'review' 
                    ? 'text-anika-blue' 
                    : 'text-gold'
                }`}>
                  {story?.status ? STATUS_LABELS[story.status] || story.status : 'Draft'}
                </span>
              </div>
              <div className="flex justify-between pb-2" style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                <span style={{ color: COLORS.muted }}>Published Date</span>
                <span className="font-medium" style={{ color: COLORS.text }}>
                  {story?.date ? new Date(story.date).toLocaleDateString() : 'Not published yet'}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: COLORS.muted }}>Last Updated</span>
                <span className="font-medium" style={{ color: COLORS.muted }}>
                  {story?.updated ? new Date(story.updated).toLocaleString() : 'Just now'}
                </span>
              </div>
              {story?.status === 'published' && story?.date && (
                <div className="mt-2 rounded-lg bg-anika-green/10 px-3 py-2 text-xs text-anika-green">
                  ✓ Published on {new Date(story.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              )}
              {story?.status === 'draft' && (
                <div className="mt-2 rounded-lg bg-gold/10 px-3 py-2 text-xs text-gold">
                  ⏳ Draft - Will be hidden from the website until published
                </div>
              )}
            </div>
          </div>

          {/* Brand Voice Check */}
          <div style={{ 
            background: COLORS.panel, 
            border: `1px solid ${COLORS.border}` 
          }} className="hidden sm:block rounded-xl p-4">
            <h3 className="text-xs font-bold tracking-wide" style={{ color: COLORS.muted }}>
              Brand voice check
            </h3>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {['Bold', 'Human', 'Expressive', 'Provocative', 'Hopeful'].map((word) => (
                <span
                  key={word}
                  className="rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ 
                    background: COLORS.panelAlt,
                    color: COLORS.muted
                  }}
                >
                  {word}
                </span>
              ))}
            </div>

            <div className="mt-3 space-y-2 text-xs leading-relaxed">
              <p style={{ color: COLORS.muted }}>
                <span className="mr-1.5 rounded bg-anika-green/15 px-1.5 py-0.5 font-semibold uppercase text-anika-green">Do</span>
                Centre the storyteller's own words and agency. People before programmes.
              </p>
              <p style={{ color: COLORS.muted }}>
                <span className="mr-1.5 rounded bg-coral/15 px-1.5 py-0.5 font-semibold uppercase text-coral">Avoid</span>
                Pity or saviour language — say <em>participant / survivor</em>, not <em>beneficiary / victim</em>.
              </p>
            </div>

            <p className="mt-3 pt-3 font-serif text-sm italic text-coral" style={{ borderTop: `1px solid ${COLORS.border}` }}>
              "Silence Kills. Art Airs."
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default StoryEditor