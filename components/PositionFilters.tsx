'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

export default function PositionFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/positions?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <Label>Search</Label>
        <Input 
          placeholder="Search positions..."
          defaultValue={searchParams.get('search') || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />
      </div>

      <div>
        <Label>Field of Study</Label>
        <Select 
          defaultValue={searchParams.get('field') || ''}
          onValueChange={(val) => handleFilterChange('field', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All fields" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All fields</SelectItem>
            <SelectItem value="computer_science">Computer Science</SelectItem>
            <SelectItem value="biology">Biology</SelectItem>
            <SelectItem value="psychology">Psychology</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Location</Label>
        <Select 
          defaultValue={searchParams.get('state') || ''}
          onValueChange={(val) => handleFilterChange('state', val)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All locations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All locations</SelectItem>
            <SelectItem value="CA">California</SelectItem>
            <SelectItem value="MA">Massachusetts</SelectItem>
            <SelectItem value="NY">New York</SelectItem>
            <SelectItem value="TX">Texas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => router.push('/positions')}
      >
        Clear Filters
      </Button>
    </div>
  )
}