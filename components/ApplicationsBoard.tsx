'use client'

import { Card } from '@/components/ui/card'

interface Application {
  id: string;
  status: 'saved' | 'applied' | 'interviewing' | 'accepted' | 'rejected';
  position: {
    title: string;
    university: string;
  };
  applied_date?: string;
}

interface ApplicationsBoardProps {
  applications: Application[];
}

export default function ApplicationsBoard({ applications }: ApplicationsBoardProps) {
  const columns = {
    saved: applications.filter((app) => app.status === 'saved'),
    applied: applications.filter((app) => app.status === 'applied'),
    interviewing: applications.filter((app) => app.status === 'interviewing'),
    accepted: applications.filter((app) => app.status === 'accepted'),
    rejected: applications.filter((app) => app.status === 'rejected'),
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {Object.entries(columns).map(([status, apps]) => (
        <div key={status}>
          <h3 className="font-semibold mb-4 capitalize">
            {status} ({apps.length})
          </h3>
          <div className="space-y-3">
            {apps.map((app) => (
              <Card key={app.id} className="p-4">
                <h4 className="font-medium text-sm mb-1">{app.position.title}</h4>
                <p className="text-xs text-muted-foreground">{app.position.university}</p>
                {app.applied_date && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Applied: {new Date(app.applied_date).toLocaleDateString()}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
