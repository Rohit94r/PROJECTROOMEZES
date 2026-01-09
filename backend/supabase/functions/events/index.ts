import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Events function up and running!')

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  // Parse the request URL to determine the endpoint
  const url = new URL(req.url)
  const pathParts = url.pathname.split('/').filter(Boolean)
  const method = req.method

  try {
    if (pathParts[0] === 'type' && method === 'GET') {
      // Get events by type (though our schema doesn't have a type column for events)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (error) throw error

      return new Response(JSON.stringify({ 
        success: true, 
        count: data.length,
        data: data 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
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