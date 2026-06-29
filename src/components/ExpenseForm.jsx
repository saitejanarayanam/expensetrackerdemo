import React, { useState, useRef } from 'react'

export default function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('Other')
  const [file, setFile] = useState(null)
  const fileInputRef = useRef(null)

  function submit(e) {
    e.preventDefault()
    if (!title || !amount || !date) return alert('Please fill title, amount and date')
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
    const exp = {
      id,
      title: title.trim(),
      amount: parseFloat(amount),
      date,
      category,
    }
    onAdd(exp, file)
    setTitle('')
    setAmount('')
    setDate('')
    setCategory('Other')
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <form className="form" onSubmit={submit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        type="number"
        step="0.01"
      />
      <input value={date} onChange={(e) => setDate(e.target.value)} type="date" />
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Food</option>
        <option>Transport</option>
        <option>Shopping</option>
        <option>Bills</option>
        <option>Other</option>
      </select>
      <div className="file-input-wrapper">
        <label className="file-input-label">
          <span className="icon">📎</span>
          <span className="file-name">{file ? file.name : 'Attach Invoice'}</span>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setFile(e.target.files[0] || null)}
            accept="image/*,application/pdf"
            style={{ display: 'none' }}
          />
        </label>
        {file && (
          <button
            type="button"
            className="clear-file"
            onClick={() => {
              setFile(null)
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit">Add Expense</button>
    </form>
  )
}
