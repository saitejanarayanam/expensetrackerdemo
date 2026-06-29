import React from 'react'
import ExpenseItem from './ExpenseItem'

export default function ExpenseList({ expenses, onDelete, onEdit }) {
  if (!expenses || expenses.length === 0) return <p className="empty">No expenses yet</p>
  return (
    <ul className="list cards">
      {expenses.map((e) => (
        <ExpenseItem key={e.id} expense={e} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </ul>
  )
}
