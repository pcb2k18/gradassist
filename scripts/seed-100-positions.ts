import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const universities = [
  'Stanford University', 'MIT', 'Harvard University', 'UC Berkeley',
  'University of Michigan', 'University of Texas at Austin', 'UCLA',
  'Columbia University', 'Yale University', 'Princeton University',
  'Cornell University', 'University of Washington', 'Johns Hopkins University',
  'Northwestern University', 'Duke University', 'University of Pennsylvania',
  'Brown University', 'Vanderbilt University', 'Rice University',
  'Carnegie Mellon University', 'University of Chicago', 'Boston University',
  'NYU', 'USC', 'Georgia Tech', 'UC San Diego', 'UC Irvine',
  'University of Wisconsin-Madison', 'Ohio State University', 'Penn State'
]

const departments = [
  'Computer Science', 'Biology', 'Psychology', 'Engineering',
  'Mathematics', 'Physics', 'Chemistry', 'Economics',
  'Political Science', 'Sociology', 'History', 'English',
  'Business Administration', 'Education', 'Public Health'
]

const fields = [
  'computer_science', 'biology', 'psychology', 'engineering',
  'business', 'education'
]

const positionTypes = [
  'teaching_assistant', 'research_assistant', 'administrative'
]

const cities = [
  'Stanford', 'Cambridge', 'Berkeley', 'Ann Arbor', 'Austin',
  'Los Angeles', 'New York', 'New Haven', 'Princeton', 'Ithaca',
  'Seattle', 'Baltimore', 'Evanston', 'Durham', 'Philadelphia',
  'Providence', 'Nashville', 'Houston', 'Pittsburgh', 'Chicago',
  'Boston', 'San Diego', 'Irvine', 'Madison', 'Columbus'
]

const states = [
  'CA', 'MA', 'MI', 'TX', 'NY', 'CT', 'NJ', 'WA', 'MD',
  'IL', 'PA', 'RI', 'TN', 'OH', 'WI'
]

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomStipend() {
  return Math.floor(Math.random() * (50000 - 25000) + 25000)
}

function randomDeadline() {
  const start = new Date(2026, 0, 1) // Jan 1, 2026
  const end = new Date(2026, 11, 31) // Dec 31, 2026
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString().split('T')[0]
}

function generatePosition(index: number) {
  const university = randomItem(universities)
  const department = randomItem(departments)
  const positionType = randomItem(positionTypes)
  const field = randomItem(fields)
  
  const titles = {
    teaching_assistant: `Teaching Assistant - ${department}`,
    research_assistant: `Research Assistant - ${department}`,
    administrative: `Graduate Administrative Assistant - ${department}`
  }

  const descriptions = {
    teaching_assistant: `We are seeking a motivated graduate student to assist with undergraduate ${department} courses. Responsibilities include leading discussion sections, holding office hours, and grading assignments.`,
    research_assistant: `Join our research team in the ${department} department. You'll work on cutting-edge research projects, assist with data collection and analysis, and contribute to publications.`,
    administrative: `Support the ${department} department with administrative tasks including event coordination, student advising support, and general office duties.`
  }

  const cityIndex = Math.floor(Math.random() * cities.length)
  
  return {
    title: titles[positionType as keyof typeof titles],
    university,
    department,
    field_of_study: field,
    position_type: positionType,
    description: descriptions[positionType as keyof typeof descriptions],
    requirements: 'Enrolled in graduate program, GPA 3.0+, Strong communication skills',
    stipend_amount: randomStipend(),
    benefits: 'Tuition waiver, Health insurance, Professional development funds',
    hours_per_week: 20,
    location_city: cities[cityIndex],
    location_state: randomItem(states),
    deadline: randomDeadline(),
    start_date: '2026-01-15',
    application_url: `https://${university.toLowerCase().replace(/\s+/g, '')}.edu/apply`,
    contact_email: `gradassist@${university.toLowerCase().replace(/\s+/g, '')}.edu`,
    source_url: `https://${university.toLowerCase().replace(/\s+/g, '')}.edu/positions/${index}`,
    is_active: true,
    posted_date: new Date().toISOString().split('T')[0]
  }
}

async function seedPositions() {
  console.log('🌱 Starting to seed 100 positions...')
  
  const positions = []
  for (let i = 1; i <= 100; i++) {
    positions.push(generatePosition(i))
  }

  // Insert in batches of 20
  for (let i = 0; i < positions.length; i += 20) {
    const batch = positions.slice(i, i + 20)
    const { data, error } = await supabase
      .from('positions')
      .insert(batch)
      .select()

    if (error) {
      console.error(`❌ Error seeding batch ${i / 20 + 1}:`, error)
    } else {
      console.log(`✅ Seeded batch ${i / 20 + 1} (${data?.length} positions)`)
    }
  }

  console.log('🎉 Successfully seeded 100 positions!')
}

seedPositions()