'use client'

import { Bookmark, BookmarkCheck, MapPin, DollarSign, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Position {
  id: string
  title: string
  university: string
  department: string
  position_type: string
  location_city: string
  location_state: string
  stipend_amount: number
  deadline: string
  posted_date: string
}

interface PositionsListProps {
  positions: Position[]
  selectedId?: string
  savedPositionIds: Set<string>
  onSelect: (position: Position) => void
  onToggleSave: (positionId: string) => void
}

export default function PositionsList({
  positions,
  selectedId,
  savedPositionIds,
  onSelect,
  onToggleSave,
}: PositionsListProps) {
  function getInitials(name: string) {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  function getBadgeColor(university: string) {
    const colors = [
      'bg-blue-600',
      'bg-emerald-600', 
      'bg-purple-600',
      'bg-orange-600',
      'bg-pink-600',
      'bg-indigo-600',
    ]
    const index = university.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <div className="divide-y divide-gray-200">
      {positions.map((position) => {
        const isSaved = savedPositionIds.has(position.id)
        
        return (
          <div
            key={position.id}
            onClick={() => onSelect(position)}
            className={`p-4 cursor-pointer transition-all hover:bg-gray-50 ${
              selectedId === position.id ? 'bg-emerald-50 border-l-4 border-emerald-600' : ''
            }`}
          >
            <div className="flex gap-3">
              <div
                className={`w-12 h-12 rounded-lg ${getBadgeColor(
                  position.university
                )} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
              >
                {getInitials(position.university)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-base leading-tight line-clamp-2">
                    {position.title}
                  </h3>
                  <button
                    className="flex-shrink-0 p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onToggleSave(position.id)
                    }}
                    aria-label={isSaved ? 'Unsave position' : 'Save position'}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                    ) : (
                      <Bookmark className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>

                <div className="text-sm font-medium text-gray-900 mb-1">
                  {position.university}
                </div>

                {position.department && (
                  <div className="text-xs text-gray-600 mb-2">{position.department}</div>
                )}

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span className="font-medium">
                      ${position.stipend_amount?.toLocaleString()}/yr
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>
                      {position.location_city}, {position.location_state}
                    </span>
                  </div>
                  {position.deadline && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Due:{' '}
                        {new Date(position.deadline).toLocaleDateString('en-US', {
                          month: 'numeric',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      position.position_type === 'research_assistant'
                        ? 'bg-emerald-100 text-emerald-700'
                        : position.position_type === 'teaching_assistant'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {position.position_type === 'research_assistant' && 'RA'}
                    {position.position_type === 'teaching_assistant' && 'TA'}
                    {position.position_type === 'administrative' && 'GA'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Posted{' '}
                    {formatDistanceToNow(new Date(position.posted_date), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}