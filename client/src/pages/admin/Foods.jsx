import React, { useEffect, useState, useCallback } from 'react'
import { Plus, Edit2, Trash2, Search, ToggleLeft, ToggleRight, Star } from 'lucide-react'
import api from '../../services/api'
import Modal from '../../components/common/Modal'
import { TableRowSkeleton } from '../../components/common/Skeleton'
import toast from 'react-hot-toast'

const emptyForm = { name: '', description: '', price: '', category: '', image: '', isVegetarian: false, isAvailable: true, isFeatured: false, preparationTime: 30 }

export default function AdminFoods() {
  const [foods, setFoods] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editFood, setEditFood] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [fRes, cRes] = await Promise.all([
        api.get('/foods', { params: { limit: 100, ...(search ? { search } : {}) } }),
        api.get('/categories')
      ])
      setFoods(fRes.data.foods || [])
      setCategories(cRes.data.categories || [])
    } catch { toast.error('Failed to load foods') }
    finally { setLoading(false) }
  }, [search])

  useEffect(() => { load() }, [load])

  const openAdd = () => { setEditFood(null); setForm(emptyForm); setFormErrors({}); setModal(true) }
  const openEdit = (food) => {
    setEditFood(food)
    setForm({
      name: food.name, description: food.description, price: food.price,
      category: food.category?._id || '', image: food.image || '',
      isVegetarian: food.isVegetarian || false, isAvailable: food.isAvailable,
      isFeatured: food.isFeatured || false, preparationTime: food.preparationTime || 30
    })
    setFormErrors({})
    setModal(true)
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.description.trim()) e.description = 'Description is required'
    if (!form.price || isNaN(form.price) || +form.price <= 0) e.price = 'Valid price required'
    if (!form.category) e.category = 'Category is required'
    return e
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length) { setFormErrors(errs); return }
    setSaving(true)
    try {
      const payload = { ...form, price: +form.price }
      if (editFood) {
        await api.put(`/foods/${editFood._id}`, payload)
        toast.success('Food updated!')
      } else {
        await api.post('/foods', payload)
        toast.success('Food created!')
      }
      setModal(false)
      load()
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/foods/${id}`)
      toast.success('Food deleted')
      setDeleteConfirm(null)
      load()
    } catch { toast.error('Delete failed') }
  }

  const toggleAvailable = async (food) => {
    try {
      await api.put(`/foods/${food._id}`, { isAvailable: !food.isAvailable })
      setFoods(prev => prev.map(f => f._id === food._id ? { ...f, isAvailable: !f.isAvailable } : f))
      toast.success(`Marked as ${!food.isAvailable ? 'available' : 'unavailable'}`)
    } catch { toast.error('Update failed') }
  }

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setFormErrors(e => ({ ...e, [k]: '' })) }

  const fallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60' fill='%23f3f4f6'%3E%3Crect width='60' height='60' fill='%23f3f4f6'/%3E%3Ccircle cx='30' cy='30' r='14' fill='%23e5e7eb'/%3E%3C/svg%3E"

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">{foods.length} items</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Food
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search foods..."
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Image', 'Name', 'Category', 'Price', 'Rating', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                : foods.length === 0
                  ? <tr><td colSpan={7} className="text-center py-10 text-gray-400">No foods found</td></tr>
                  : foods.map(food => (
                    <tr key={food._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                          <img src={food.image || fallback} alt={food.name} className="w-full h-full object-cover"
                            onError={e => { e.target.src = fallback }} />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{food.name}</p>
                        <p className="text-xs text-gray-400 max-w-[180px] truncate">{food.description}</p>
                        <div className="flex gap-1 mt-1">
                          {food.isVegetarian && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Veg</span>}
                          {food.isFeatured && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">Featured</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{food.category?.name || '—'}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">₹{food.price}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="text-gray-700 font-medium">{food.rating?.toFixed(1) || '0.0'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => toggleAvailable(food)} className="flex items-center gap-1.5 text-xs font-medium transition-colors">
                          {food.isAvailable
                            ? <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-600">Available</span></>
                            : <><ToggleLeft className="w-5 h-5 text-gray-300" /><span className="text-gray-400">Unavailable</span></>}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(food)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(food)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modal} onClose={() => setModal(false)} title={editFood ? 'Edit Food' : 'Add Food'} size="lg">
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { key: 'name', label: 'Food Name', placeholder: 'e.g. Margherita Pizza' },
            { key: 'image', label: 'Image URL', placeholder: 'https://...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input value={form[key]} onChange={e => set(key, e.target.value)} placeholder={placeholder}
                className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${formErrors[key] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-300'}`} />
              {formErrors[key] && <p className="text-xs text-red-500 mt-1">{formErrors[key]}</p>}
            </div>
          ))}

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2}
              placeholder="Describe the dish..."
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 resize-none ${formErrors.description ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-300'}`} />
            {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹)</label>
            <input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="299" min="0"
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${formErrors.price ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-300'}`} />
            {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className={`w-full px-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 ${formErrors.category ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-300'}`}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {formErrors.category && <p className="text-xs text-red-500 mt-1">{formErrors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Prep Time (min)</label>
            <input type="number" value={form.preparationTime} onChange={e => set('preparationTime', e.target.value)} min="5"
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
          </div>

          <div className="flex flex-col gap-3 justify-center">
            {[['isVegetarian', 'Vegetarian'], ['isAvailable', 'Available'], ['isFeatured', 'Featured']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          <div className="sm:col-span-2 flex gap-3 pt-2">
            <button onClick={() => setModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white rounded-xl text-sm font-medium transition-colors">
              {saving ? 'Saving...' : editFood ? 'Update Food' : 'Create Food'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Food" size="sm">
        <p className="text-sm text-gray-600 mb-5">Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => handleDelete(deleteConfirm._id)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-medium transition-colors">Delete</button>
        </div>
      </Modal>
    </div>
  )
}
