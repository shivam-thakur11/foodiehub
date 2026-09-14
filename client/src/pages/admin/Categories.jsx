import React, { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Tag } from 'lucide-react'
import api from '../../services/api'
import Modal from '../../components/common/Modal'
import toast from 'react-hot-toast'

const emptyForm = { name: '', description: '', image: '' }

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editCat, setEditCat] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    api.get('/categories')
      .then(r => setCategories(r.data.categories || []))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  const openAdd = () => { setEditCat(null); setForm(emptyForm); setFormErrors({}); setModal(true) }
  const openEdit = (cat) => { setEditCat(cat); setForm({ name: cat.name, description: cat.description || '', image: cat.image || '' }); setFormErrors({}); setModal(true) }

  const handleSave = async () => {
    if (!form.name.trim()) { setFormErrors({ name: 'Name is required' }); return }
    setSaving(true)
    try {
      if (editCat) {
        await api.put(`/categories/${editCat._id}`, form)
        toast.success('Category updated!')
      } else {
        await api.post('/categories', form)
        toast.success('Category created!')
      }
      setModal(false); load()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Category deleted')
      setDeleteConfirm(null); load()
    } catch { toast.error('Delete failed') }
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setFormErrors(e => ({ ...e, [k]: '' })) }
  const fallback = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse">
              <div className="w-full h-28 bg-gray-200 rounded-xl mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Tag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No categories yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div key={cat._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
              <div className="h-28 bg-gray-100 overflow-hidden">
                <img src={cat.image || fallback} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { e.target.src = fallback }} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-0.5">{cat.name}</h3>
                {cat.description && <p className="text-xs text-gray-400 line-clamp-2 mb-3">{cat.description}</p>}
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(cat)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(cat)} className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editCat ? 'Edit Category' : 'Add Category'} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Pizza"
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${formErrors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-300'}`} />
            {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2} placeholder="Brief description..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
            <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..."
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
            {form.image && <img src={form.image} alt="preview" className="mt-2 w-full h-28 object-cover rounded-xl border border-gray-100"
              onError={e => { e.target.style.display = 'none' }} />}
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white rounded-xl text-sm font-medium transition-colors">
              {saving ? 'Saving...' : editCat ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Category" size="sm">
        <p className="text-sm text-gray-600 mb-5">Delete <strong>{deleteConfirm?.name}</strong>? Foods in this category won't be deleted but will lose their category.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm._id)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
