import React, { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

const LOCAL_KEY = 'expenses'

export default function App() {
  const [expenses, setExpenses] = useState(() => {
    try {
      const raw = localStorage.getItem(LOCAL_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(expenses))
    } catch (e) {}
  }, [expenses])

  const addExpense = (exp) => setExpenses((prev) => [exp, ...prev])
  const deleteExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id))

  return (
    <div className="app">
      <h1>Sai Teja's Personal Expenses Tracker</h1>
      <ExpenseForm onAdd={addExpense} />
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
    </div>
  )
}
