import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, DollarSign } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import SavePositionButton from '@/components/SavePositionButton'

interface Position {
  id: string;
  title: string;
  university: string;
  department?: string;
  position_type?: string;
  location_city?: string;
  location_state?: string;
  stipend_amount?: number;
  deadline?: string;
  description?: string;
  posted_date: string;
}

interface PositionCardProps {
  position: Position;
}

export default function PositionCard({ position }: PositionCardProps) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
          <p className="text-lg text-muted-foreground">{position.university}</p>
          {position.department && (
            <p className="text-sm text-muted-foreground">{position.department}</p>
          )}
        </div>
        <Badge variant={position.position_type === 'research_assistant' ? 'default' : 'secondary'}>
          {position.position_type?.replace('_', ' ').toUpperCase() || 'GA'}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
        {position.location_city && position.location_state && (
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{position.location_city}, {position.location_state}</span>
          </div>
        )}
        {position.stipend_amount && (
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4" />
            <span>${position.stipend_amount.toLocaleString()}/year</span>
          </div>
        )}
        {position.deadline && (
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Due: {new Date(position.deadline).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {position.description && (
        <p className="text-sm mb-4 line-clamp-2">{position.description}</p>
      )}

      <div className="flex gap-2">
        <Link href={`/positions/${position.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
        <SavePositionButton positionId={position.id} initialSaved={false} />
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Posted {formatDistanceToNow(new Date(position.posted_date))} ago
      </div>
    </Card>
  )
}
