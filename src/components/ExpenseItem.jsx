import React from 'react'

export default function ExpenseItem({ expense, onDelete }) {
  const { id, title, amount, date, category } = expense
  const d = new Date(date).toLocaleDateString()
  return (
    <li className="item">
      <div>
        <div className="title">{title}</div>
        <div className="meta">{category} • {d}</div>
      </div>
      <div className="right">
        <div className="amount">${amount.toFixed(2)}</div>
        <button className="del" onClick={() => onDelete(id)}>Delete</button>
      </div>
    </li>
  )
}
