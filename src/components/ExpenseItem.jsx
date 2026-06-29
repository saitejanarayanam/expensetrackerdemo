import React, { useState, useRef } from 'react'
import { supabase } from '../supabaseClient'

export default function ExpenseItem({ expense, onDelete, onEdit }) {
  const { id, title, amount, date, category, invoice_path, invoice_name } = expense
  const d = new Date(date).toLocaleDateString()

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editAmount, setEditAmount] = useState(amount.toString())
  const [editDate, setEditDate] = useState(date)
  const [editCategory, setEditCategory] = useState(category)
  const [editFile, setEditFile] = useState(null)
  const [clearAttachment, setClearAttachment] = useState(false)
  const editFileInputRef = useRef(null)

  const categoryMap = {
    Food: { icon: '🍔', label: 'Food', className: 'category-food' },
    Transport: { icon: '🚗', label: 'Transport', className: 'category-transport' },
    Shopping: { icon: '🛍️', label: 'Shopping', className: 'category-shopping' },
    Bills: { icon: '💡', label: 'Bills', className: 'category-bills' },
    Other: { icon: '🌀', label: 'Other', className: 'category-other' },
  }

  const categoryInfo = categoryMap[category] || categoryMap.Other

  const handleViewInvoice = () => {
    if (!invoice_path) return
    const { data } = supabase.storage.from('invoices').getPublicUrl(invoice_path)
    if (data?.publicUrl) {
      window.open(data.publicUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!editTitle || !editAmount || !editDate) {
      alert('Please fill title, amount and date')
      return
    }

    onEdit(
      id,
      {
        title: editTitle.trim(),
        amount: parseFloat(editAmount),
        date: editDate,
        category: editCategory,
      },
      editFile,
      clearAttachment
    )
    setIsEditing(false)
    setEditFile(null)
    setClearAttachment(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditTitle(title)
    setEditAmount(amount.toString())
    setEditDate(date)
    setEditCategory(category)
    setEditFile(null)
    setClearAttachment(false)
  }

  if (isEditing) {
    return (
      <li className="item card editing">
        <form onSubmit={handleSave} className="edit-form">
          <div className="input-group">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Title"
              className="edit-input"
              required
            />
            <input
              type="number"
              step="0.01"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              placeholder="Amount"
              className="edit-input"
              required
            />
            <input
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="edit-input"
              required
            />
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="edit-input"
            >
              <option>Food</option>
              <option>Transport</option>
              <option>Shopping</option>
              <option>Bills</option>
              <option>Other</option>
            </select>
          </div>

          <div className="edit-attachment-section">
            {invoice_path && !clearAttachment ? (
              <div className="current-attachment">
                <span className="attachment-name">📎 {invoice_name}</span>
                <button
                  type="button"
                  className="remove-current-btn"
                  onClick={() => {
                    setClearAttachment(true)
                    setEditFile(null)
                  }}
                >
                  Remove Attachment
                </button>
              </div>
            ) : (
              <div className="new-attachment">
                <label className="file-input-label edit-file-label">
                  <span className="icon">📎</span>
                  <span className="file-name">{editFile ? editFile.name : 'Upload Invoice'}</span>
                  <input
                    type="file"
                    ref={editFileInputRef}
                    onChange={(e) => {
                      setEditFile(e.target.files[0] || null)
                      setClearAttachment(false)
                    }}
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                  />
                </label>
                {editFile && (
                  <button
                    type="button"
                    className="clear-file"
                    onClick={() => {
                      setEditFile(null)
                      if (editFileInputRef.current) editFileInputRef.current.value = ''
                    }}
                  >
                    ✕
                  </button>
                )}
                {clearAttachment && (
                  <button
                    type="button"
                    className="undo-remove-btn"
                    onClick={() => setClearAttachment(false)}
                  >
                    Undo Remove
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="actions edit-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className="item card">
      <div className="card-top">
        <div>
          <div className="title">{title}</div>
          <div className="meta">{d}</div>
        </div>
        <span className={`category-chip ${categoryInfo.className}`}>
          {categoryInfo.icon} {categoryInfo.label}
        </span>
      </div>

      {invoice_path && (
        <div className="invoice-badge-container">
          <button className="invoice-badge-btn" onClick={handleViewInvoice}>
            <span className="icon">📄</span>
            <span className="name">{invoice_name || 'View Invoice'}</span>
          </button>
        </div>
      )}

      <div className="card-bottom">
        <div className="amount">${amount.toFixed(2)}</div>
        <div className="actions">
          <button className="edit" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="del" onClick={() => onDelete(id)}>Delete</button>
        </div>
      </div>
    </li>
  )
}
