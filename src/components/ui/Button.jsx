const variants = {
  primary: 'bg-accent hover:bg-accent-dark text-white',
  secondary: 'bg-surface-800 hover:bg-surface-900 text-gray-200 border border-white/10',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  ghost: 'hover:bg-white/5 text-gray-400 hover:text-white',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base',
}

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => (
  <button
    className={`inline-flex items-center gap-2 rounded-lg font-body font-medium transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
)
