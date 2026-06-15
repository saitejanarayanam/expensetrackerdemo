import React from 'react'
import ExpenseItem from './ExpenseItem'

export default function ExpenseList({ expenses, onDelete }) {
  if (!expenses || expenses.length === 0) return <p className="empty">No expenses yet</p>
  return (
    <ul className="list">
      {expenses.map((e) => (
        <ExpenseItem key={e.id} expense={e} onDelete={onDelete} />
      ))}
    </ul>
  )
}
