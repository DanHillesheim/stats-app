import clsx from 'clsx'

export function Divider({ soft = false, className, ...props }) {
  return (
    <hr
      role="presentation"
      {...props}
      className={clsx(
        className,
        'w-full border-t',
        soft && 'border-slate-950/5 dark:border-white/5',
        !soft && 'border-slate-950/10 dark:border-white/10'
      )}
    />
  )
}
