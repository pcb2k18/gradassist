import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const samplePositions = [
  {
    title: "Graduate Research Assistant - Machine Learning",
    university: "Stanford University",
    department: "Computer Science",
    field_of_study: "computer_science",
    position_type: "research_assistant",
    description: "Seeking a motivated graduate student to assist with cutting-edge machine learning research in our AI lab. Experience with Python, TensorFlow, and PyTorch preferred.",
    requirements: "Bachelor's in CS or related field, GPA 3.5+, Strong programming skills",
    stipend_amount: 40000,
    benefits: "Full tuition waiver, health insurance",
    hours_per_week: 20,
    location_city: "Stanford",
    location_state: "CA",
    deadline: "2025-12-15",
    start_date: "2026-01-10",
    application_url: "https://stanford.edu/apply",
    contact_email: "mllab@stanford.edu",
    source_url: "https://stanford.edu/positions/ml-ra",
  },
  {
    title: "Teaching Assistant - Introductory Biology",
    university: "MIT",
    department: "Biology",
    field_of_study: "biology",
    position_type: "teaching_assistant",
    description: "TA position for undergraduate biology course. Responsibilities include leading lab sections, grading, and office hours.",
    requirements: "Graduate student in Biology or related field",
    stipend_amount: 35000,
    benefits: "Tuition waiver, stipend",
    hours_per_week: 20,
    location_city: "Cambridge",
    location_state: "MA",
    deadline: "2025-11-30",
    start_date: "2026-01-15",
    application_url: "https://mit.edu/apply-ta",
    contact_email: "bio-dept@mit.edu",
  },
  // Add 20-50 more manually - go to HigherEdJobs, Indeed, copy real postings
]

async function seedPositions() {
  console.log('Starting to seed positions...')
  
  const { data, error } = await supabase
    .from('positions')
    .insert(samplePositions)
    .select()

  if (error) {
    console.error('Error seeding:', error)
  } else {
    console.log(`Successfully seeded ${data.length} positions`)
  }
}

seedPositions()