import React from 'react'

const categoryColors = {
  Food: '#ff4f9b',
  Transport: '#00b7ff',
  Shopping: '#7c5cff',
  Bills: '#f2c94c',
  Other: '#6b7280',
}

const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Other']

function getCategoryTotals(expenses) {
  const totals = categories.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})

  expenses.forEach((expense) => {
    const category = categories.includes(expense.category) ? expense.category : 'Other'
    totals[category] += Number(expense.amount) || 0
  })

  return totals
}

function getSegments(totals) {
  const sum = Object.values(totals).reduce((acc, value) => acc + value, 0)
  if (sum === 0) return []

  const radius = 80
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return Object.entries(totals)
    .filter(([, value]) => value > 0)
    .map(([category, value]) => {
      const percentage = value / sum
      const dash = percentage * circumference
      const segment = {
        category,
        value,
        percentage,
        strokeDasharray: `${dash} ${circumference - dash}`,
        strokeDashoffset: -offset,
        color: categoryColors[category] || categoryColors.Other,
      }
      offset += dash
      return segment
    })
}

export default function ExpenseChart({ expenses }) {
  const totals = getCategoryTotals(expenses)
  const segments = getSegments(totals)
  const totalAmount = Object.values(totals).reduce((acc, value) => acc + value, 0)

  if (!expenses || expenses.length === 0 || totalAmount === 0) {
    return <div className="chart-empty">Add expenses to view category breakdown</div>
  }

  return (
    <div className="chart-card">
      <div className="chart-heading">Expense Category Breakdown</div>
      <div className="chart-inner">
        <svg className="donut" viewBox="0 0 200 200" role="img" aria-label="Expense category donut chart">
          <circle className="donut-ring" cx="100" cy="100" r="80" />
          {segments.map((segment) => (
            <circle
              key={segment.category}
              className="donut-segment"
              cx="100"
              cy="100"
              r="80"
              fill="transparent"
              stroke={segment.color}
              strokeWidth="32"
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
            />
          ))}
          <text x="100" y="98" dominantBaseline="middle" textAnchor="middle" className="donut-center-value">
            {totalAmount.toFixed(0)}
          </text>
          <text x="100" y="118" dominantBaseline="middle" textAnchor="middle" className="donut-center-label">
            Total
          </text>
        </svg>
        <div className="chart-legend">
          {segments.map((segment) => (
            <div key={segment.category} className="legend-row">
              <span className="legend-dot" style={{ background: segment.color }} />
              <span className="legend-label">{segment.category}</span>
              <span className="legend-value">{(segment.percentage * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
