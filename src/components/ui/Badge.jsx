import { STATUS_COLORS } from '../../utils/constants'

export const Badge = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[status] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'}`}>
    {status}
  </span>
)
