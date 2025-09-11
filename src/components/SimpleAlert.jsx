import React from 'react'
import clsx from 'clsx'

export function Alert({ color = 'blue', className, children }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    rose: 'bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-800',
    amber: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800',
  }

  return (
    <div className={clsx(
      'rounded-lg p-4 border',
      colors[color],
      className
    )}>
      {children}
    </div>
  )
}

export function AlertTitle({ className, children }) {
  return (
    <h3 className={clsx('font-semibold mb-2', className)}>
      {children}
    </h3>
  )
}

export function AlertDescription({ className, children }) {
  return (
    <div className={clsx('text-sm', className)}>
      {children}
    </div>
  )
}

export function AlertActions({ className, children }) {
  return (
    <div className={clsx('mt-4', className)}>
      {children}
    </div>
  )
}