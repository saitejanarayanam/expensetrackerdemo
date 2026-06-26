import React, { useState } from 'react'
import ExpenseForm from './components/ExpenseForm'
import { supabase } from './supabaseClient'

const TABLE = 'expenses'

export default function App() {
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const addExpense = async (exp) => {
    setError('')
    setMessage('')

    try {
      console.log('Inserting expense', exp)
      const { data, error: insertError } = await supabase.from(TABLE).insert([exp]).select().single()
      if (insertError) {
        console.error('Insert error', insertError)
        setError(insertError.message)
        return
      }

      console.log('Insert succeeded', data)
      setMessage('Expense saved successfully.')
    } catch (err) {
      console.error('Unexpected error inserting expense', err)
      setError(err.message || 'Unexpected error')
    }
  }

  return (
    <div className="app">
      <h1>Sai Teja's Personal Expenses Tracker</h1>
      {error ? <p className="error">{error}</p> : null}
      {message ? <p className="success">{message}</p> : null}
      <ExpenseForm onAdd={addExpense} />
    </div>
  )
}
