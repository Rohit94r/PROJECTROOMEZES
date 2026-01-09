// This function would be used as a Database Trigger in Supabase
// to automatically create a profile when a user signs up

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

async function createProfile(userId: string, name: string, email: string, role: string, college: string) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  const { error } = await supabase
    .from('profiles')
    .insert([
      {
        id: userId,
        name: name,
        email: email,
        role: role || 'student',
        college: college,
        is_verified: false
      }
    ])

  if (error) {
    console.error('Error creating profile:', error)
    throw error
  }

  console.log('Profile created successfully for user:', userId)
}

// This would be called from a Database Trigger
// For now, we'll export it as a function that can be used in edge functions
export { createProfile }