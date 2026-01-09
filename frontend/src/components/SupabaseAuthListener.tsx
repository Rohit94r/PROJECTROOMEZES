'use client';

import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SupabaseAuthListener() {

  useEffect(() => {
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: string, session: any) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          // Store session or user data as needed
          if (session) {
            localStorage.setItem('token', session.access_token || '');
            
            // Get user data from session
            const user = {
              id: session.user.id,
              email: session.user.email,
              role: session.user.user_metadata?.role || 'student',
              serviceType: session.user.user_metadata?.serviceType,
              isVerified: session.user.user_metadata?.is_verified || false,
            };
            
            localStorage.setItem('user', JSON.stringify(user));
          }
        } else if (event === 'SIGNED_OUT') {
          // Clear stored data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return null; // This component doesn't render anything
}