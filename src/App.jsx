import React, { useState, useEffect } from 'react'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import { supabase } from './supabaseClient'

const TABLE = 'expenses'

export default function App() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadExpenses() {
      setLoading(true)
      setError('')

      const { data, error: fetchError } = await supabase
        .from(TABLE)
        .select('*')
        .order('date', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
        setExpenses([])
      } else {
        setExpenses(data || [])
      }

      setLoading(false)
    }

    loadExpenses()
  }, [])

  const addExpense = async (exp) => {
    setError('')

    try {
      console.log('Inserting expense', exp)
      const { data, error: insertError } = await supabase.from(TABLE).insert([exp]).select().single()
      if (insertError) {
        console.error('Insert error', insertError)
        setError(insertError.message)
        return
      }

      console.log('Insert succeeded', data)
      setExpenses((prev) => [data, ...prev])
    } catch (err) {
      console.error('Unexpected error inserting expense', err)
      setError(err.message || 'Unexpected error')
    }
  }

  const deleteExpense = async (id) => {
    setError('')

    const { error: deleteError } = await supabase.from(TABLE).delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message)
      return
    }

    setExpenses((prev) => prev.filter((e) => e.id !== id))
  }

  return (
    <div className="app">
      <h1>Sai Teja's Personal Expenses Tracker</h1>
      {error ? <p className="error">{error}</p> : null}
      <ExpenseForm onAdd={addExpense} />
      {loading ? <p className="loading">Loading expenses...</p> : null}
      <ExpenseList expenses={expenses} onDelete={deleteExpense} />
    </div>
  )
}
