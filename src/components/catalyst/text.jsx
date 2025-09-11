import clsx from 'clsx'
import { Link } from './link'

export function Text({ className, ...props }) {
  return (
    <p
      data-slot="text"
      {...props}
      className={clsx(className, 'text-base/6 text-slate-500 sm:text-sm/6 dark:text-slate-400')}
    />
  )
}

export function TextLink({ className, ...props }) {
  return (
    <Link
      {...props}
      className={clsx(
        className,
        'text-slate-950 underline decoration-slate-950/50 data-hover:decoration-slate-950 dark:text-white dark:decoration-white/50 dark:data-hover:decoration-white'
      )}
    />
  )
}

export function Strong({ className, ...props }) {
  return <strong {...props} className={clsx(className, 'font-medium text-slate-950 dark:text-white')} />
}

export function Code({ className, ...props }) {
  return (
    <code
      {...props}
      className={clsx(
        className,
        'rounded-sm border border-slate-950/10 bg-slate-950/2.5 px-0.5 text-sm font-medium text-slate-950 sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white'
      )}
    />
  )
}
