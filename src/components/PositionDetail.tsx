'use client'

import { Button } from '@/components/ui/button'
import { Share2, ExternalLink, MapPin, DollarSign, Calendar, Briefcase } from 'lucide-react'
import SavePositionButton from '@/components/SavePositionButton'

interface PositionDetailProps {
  position: any;
  isSaved?: boolean;
  onToggleSave?: (positionId: string) => void;
}

export default function PositionDetail({ 
  position, 
  isSaved, 
  onToggleSave 
}: PositionDetailProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{position.title}</h1>
            <p className="text-xl text-gray-700">{position.university}</p>
            <p className="text-gray-600">{position.department}</p>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Posted {new Date(position.posted_date).toLocaleDateString()} • Apply by{' '}
          {position.deadline ? new Date(position.deadline).toLocaleDateString() : 'No deadline'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {/* Use SavePositionButton if no callback provided, otherwise use callback for backwards compatibility */}
          {onToggleSave ? (
            <Button
              variant={isSaved ? 'default' : 'outline'}
              onClick={() => onToggleSave(position.id)}
              className={isSaved ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          ) : (
            <SavePositionButton positionId={position.id} initialSaved={isSaved} />
          )}
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          {position.application_url && (
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <a href={position.application_url} target="_blank" rel="noopener noreferrer">
                Apply
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {/* At a Glance */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">At a glance</h2>
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">
                ${position.stipend_amount?.toLocaleString()}/yr
              </p>
              <p className="text-sm text-gray-600">Annual stipend</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium">
                {position.location_city}, {position.location_state}
              </p>
              <p className="text-sm text-gray-600">Location</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium capitalize">
                {position.position_type?.replace('_', ' ')}
              </p>
              <p className="text-sm text-gray-600">Position type</p>
            </div>
          </div>

          {position.deadline && (
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">
                  {new Date(position.deadline).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">Application deadline</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {position.description && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Description</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="whitespace-pre-line">{position.description}</p>
          </div>
        </div>
      )}

      {/* Requirements */}
      {position.requirements && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Requirements</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="whitespace-pre-line">{position.requirements}</p>
          </div>
        </div>
      )}

      {/* Benefits */}
      {position.benefits && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Benefits</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="whitespace-pre-line">{position.benefits}</p>
          </div>
        </div>
      )}

      {/* Apply Section */}
      <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-6">
        <h2 className="text-lg font-semibold mb-3">Ready to apply?</h2>
        <p className="text-gray-700 mb-4">
          Click the button below to visit the application page and submit your materials.
        </p>
        {position.application_url ? (
          <Button className="bg-emerald-600 hover:bg-emerald-700" size="lg" asChild>
            <a href={position.application_url} target="_blank" rel="noopener noreferrer">
              Apply Now
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </Button>
        ) : (
          <p className="text-sm text-gray-600">Application link not available</p>
        )}
      </div>
    </div>
  )
}