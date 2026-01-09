import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

console.log('Orders function up and running!')

serve(async (req) => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

  // Parse the request URL to determine the endpoint
  const url = new URL(req.url)
  const pathParts = url.pathname.split('/').filter(Boolean)
  const method = req.method

  try {
    if (pathParts[0] === 'student' && method === 'GET') {
      // Get orders for a student
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

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles(name, email)
        `)
        .eq('user_id', user.id)

      if (error) throw error

      return new Response(JSON.stringify({ 
        success: true, 
        count: data.length,
        data: data 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    } else if (pathParts[0] === 'owner' && method === 'GET') {
      // Get orders for an owner
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

      // First get all canteen items owned by the current user
      const { data: canteenItems, error: itemsError } = await supabase
        .from('canteen_items')
        .select('id')
        .eq('owner_id', user.id)

      if (itemsError) throw itemsError

      if (canteenItems.length === 0) {
        return new Response(JSON.stringify({ 
          success: true, 
          count: 0,
          data: []
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 200,
        })
      }

      // Extract item IDs
      const itemIds = canteenItems.map(item => item.id)

      // Then get orders containing those items
      const { data: allOrders, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          profiles(name, email, phone)
        `)

      if (ordersError) throw ordersError

      // Filter orders that contain items from this owner
      const ownerOrders = allOrders.filter((order: any) => 
        order.items.some((item: any) => itemIds.includes(item.item))
      )

      return new Response(JSON.stringify({ 
        success: true, 
        count: ownerOrders.length,
        data: ownerOrders 
      }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })
    } else if (pathParts[0] === ':id' && pathParts[2] === 'status' && method === 'PUT') {
      // Update order status
      const orderId = pathParts[1] // Extract ID from URL
      
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

      const { status } = await req.json()

      // Check if the order contains items from this owner
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('items')
        .eq('id', orderId)
        .single()

      if (orderError) throw orderError

      // Get all canteen items owned by the current user
      const { data: canteenItems, error: itemsError } = await supabase
        .from('canteen_items')
        .select('id')
        .eq('owner_id', user.id)

      if (itemsError) throw itemsError

      const itemIds = canteenItems.map((item: any) => item.id)
      const orderContainsOwnerItems = order.items.some((item: any) => 
        itemIds.includes(item.item)
      )

      if (!orderContainsOwnerItems) {
        return new Response(JSON.stringify({ success: false, message: 'Not authorized to update this order' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 403,
        })
      }

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select(`
          *,
          profiles(name, email, phone)
        `)
        .single()

      if (error) throw error

      return new Response(JSON.stringify({ success: true, data }), {
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