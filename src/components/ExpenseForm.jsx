import React, { useState } from 'react'

export default function ExpenseForm({ onAdd }) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [category, setCategory] = useState('Other')
  const [notes, setNotes] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title || !amount || !date) return alert('Please fill title, amount and date')
    const exp = {
      id: Date.now().toString(),
      title: title.trim(),
      amount: parseFloat(amount),
      date,
      category,
      notes: notes.trim(),
    }
    onAdd(exp)
    setTitle('')
    setAmount('')
    setDate('')
    setCategory('Other')
    setNotes('')
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
      <textarea
        className="notes-input"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Notes (optional)"
      />
      <button type="submit">Add Expense</button>
    </form>
  )
}
