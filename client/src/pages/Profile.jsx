import React, { useState } from 'react'
import { User, Phone, Mail, MapPin, Plus, Edit2, Trash2, Check, Home, Briefcase } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import Modal from '../components/common/Modal'

const emptyAddress = { label: 'Home', street: '', city: '', state: '', pincode: '', phone: '' }

export default function Profile() {
  const { user, updateUser } = useAuth()
  const [tab, setTab] = useState('profile')
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', phone: user?.phone || '' })
  const [saving, setSaving] = useState(false)
  const [addressModal, setAddressModal] = useState(false)
  const [editingAddr, setEditingAddr] = useState(null)
  const [addrForm, setAddrForm] = useState(emptyAddress)
  const [addrErrors, setAddrErrors] = useState({})

  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!profileForm.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const res = await api.put('/auth/profile', profileForm)
      updateUser(res.data.user)
      toast.success('Profile updated!')
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed') }
    finally { setSaving(false) }
  }

  const openAddAddr = () => { setEditingAddr(null); setAddrForm(emptyAddress); setAddrErrors({}); setAddressModal(true) }
  const openEditAddr = (addr, idx) => { setEditingAddr(idx); setAddrForm({ ...addr }); setAddrErrors({}); setAddressModal(true) }

  const validateAddr = () => {
    const e = {}
    if (!addrForm.street.trim()) e.street = 'Street is required'
    if (!addrForm.city.trim()) e.city = 'City is required'
    if (!addrForm.state.trim()) e.state = 'State is required'
    if (!addrForm.pincode.trim()) e.pincode = 'Pincode is required'
    else if (!/^\d{6}$/.test(addrForm.pincode)) e.pincode = 'Enter a valid 6-digit pincode'
    return e
  }

  const handleSaveAddress = async () => {
    const errs = validateAddr()
    if (Object.keys(errs).length) { setAddrErrors(errs); return }
    const addresses = [...(user.addresses || [])]
    if (editingAddr !== null) addresses[editingAddr] = addrForm
    else addresses.push(addrForm)
    setSaving(true)
    try {
      const res = await api.put('/auth/profile', { addresses })
      updateUser(res.data.user)
      toast.success(editingAddr !== null ? 'Address updated!' : 'Address added!')
      setAddressModal(false)
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save address') }
    finally { setSaving(false) }
  }

  const handleDeleteAddr = async (idx) => {
    const addresses = (user.addresses || []).filter((_, i) => i !== idx)
    try {
      const res = await api.put('/auth/profile', { addresses })
      updateUser(res.data.user)
      toast.success('Address removed')
    } catch { toast.error('Failed to remove address') }
  }

  const addrIconMap = { Home: Home, Work: Briefcase, Other: MapPin }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-8 w-fit">
        {['profile', 'addresses'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
            {t === 'profile' ? 'Profile Info' : 'Addresses'}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-orange-600">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                {user?.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={profileForm.name} onChange={e => setProfileForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email (read-only)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={user?.email} readOnly
                  className="w-full pl-10 pr-4 py-3 border border-gray-100 rounded-xl text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input value={profileForm.phone} onChange={e => setProfileForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="10-digit mobile number"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300" />
              </div>
            </div>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium px-6 py-2.5 rounded-xl transition-colors text-sm">
              {saving ? 'Saving...' : <><Check className="w-4 h-4" /> Save Changes</>}
            </button>
          </form>
        </div>
      )}

      {/* Addresses Tab */}
      {tab === 'addresses' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">{(user?.addresses || []).length} saved addresses</p>
            <button onClick={openAddAddr}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Add Address
            </button>
          </div>

          {(user?.addresses || []).length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <MapPin className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No saved addresses yet.</p>
              <button onClick={openAddAddr} className="mt-4 text-orange-500 text-sm font-medium hover:text-orange-600">+ Add your first address</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {user.addresses.map((addr, idx) => {
                const Icon = addrIconMap[addr.label] || MapPin
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center">
                          <Icon className="w-4 h-4 text-orange-500" />
                        </div>
                        <span className="text-sm font-semibold text-gray-800">{addr.label}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEditAddr(addr, idx)} className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDeleteAddr(idx)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    {addr.phone && <p className="text-xs text-gray-400 mt-1">{addr.phone}</p>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Address Modal */}
      <Modal isOpen={addressModal} onClose={() => setAddressModal(false)} title={editingAddr !== null ? 'Edit Address' : 'Add New Address'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
            <div className="flex gap-2">
              {['Home', 'Work', 'Other'].map(t => (
                <button key={t} type="button" onClick={() => setAddrForm(f => ({ ...f, label: t }))}
                  className={`flex-1 py-2 rounded-xl border text-sm font-medium transition-colors ${addrForm.label === t ? 'bg-orange-50 border-orange-300 text-orange-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {[
            { key: 'street', label: 'House/Flat/Street', placeholder: '123, Main Street' },
            { key: 'city', label: 'City', placeholder: 'Mumbai' },
            { key: 'state', label: 'State', placeholder: 'Maharashtra' },
            { key: 'pincode', label: 'Pincode', placeholder: '400001' },
            { key: 'phone', label: 'Phone (optional)', placeholder: '9876543210' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
              <input value={addrForm[key]} onChange={e => { setAddrForm(f => ({ ...f, [key]: e.target.value })); setAddrErrors(er => ({ ...er, [key]: '' })) }}
                placeholder={placeholder}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-shadow ${addrErrors[key] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-orange-300'}`} />
              {addrErrors[key] && <p className="text-xs text-red-500 mt-1">{addrErrors[key]}</p>}
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddressModal(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSaveAddress} disabled={saving}
              className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white rounded-xl text-sm font-medium transition-colors">
              {saving ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
