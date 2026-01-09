import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Rooms function up and running!')

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  // Parse the request URL to determine the endpoint
  const url = new URL(req.url)
  const pathParts = url.pathname.split('/').filter(Boolean)
  const method = req.method

  try {
    if (pathParts[0] === 'posts' && method === 'GET') {
      // Get all roommate posts
      const { data, error } = await supabase
        .from('roommate_posts')
        .select(`
          *,
          profiles(name)
        `)

      if (error) throw error

      return new Response(JSON.stringify({ 
        success: true, 
        count: data.length,
        data: data 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    } else if (pathParts[0] === 'posts' && method === 'POST') {
      // Create a roommate post
      const authHeader = req.headers.get('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ success: false, message: 'Authentication required' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 401,
        })
      }

      const token = authHeader.substring(7)
      const { data: { user }, error: authError } = await supabase.auth.getUser(token)

      if (authError || !user) {
        return new Response(JSON.stringify({ success: false, message: 'Invalid token' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 401,
        })
      }

      const postData = await req.json()

      const { data, error } = await supabase
        .from('roommate_posts')
        .insert({
          budget: postData.budget,
          location: postData.location,
          preferences: postData.preferences,
          contact: postData.contact,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      })
    }

    // Return 404 for unhandled endpoints
    return new Response(JSON.stringify({ success: false, message: 'Endpoint not found' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 404,
    })
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(JSON.stringify({ success: false, message: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})