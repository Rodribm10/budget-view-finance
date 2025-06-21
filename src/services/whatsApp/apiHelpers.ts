
import { supabase } from '@/integrations/supabase/client';

/**
 * Makes a secure API request through Supabase Edge Function
 */
export const makeRequest = async <T = any>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
  body?: object
): Promise<T> => {
  console.log(`Making secure ${method} request to: ${endpoint}`);
  
  try {
    const { data, error } = await supabase.functions.invoke('whatsapp-api', {
      body: {
        endpoint,
        method,
        body
      }
    });

    if (error) {
      console.error('Edge function error:', error);
      throw new Error(error.message || 'Edge function request failed');
    }

    if (data.error) {
      console.error('API error from edge function:', data.error);
      throw new Error(data.error);
    }

    console.log('Secure API response:', data);
    return data as T;
  } catch (error) {
    console.error('Secure API request failed:', error);
    throw error;
  }
};
