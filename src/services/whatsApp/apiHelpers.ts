
import { SERVER_URL, API_KEY } from './config';

/**
 * Makes an API request to the WhatsApp server
 */
export const makeRequest = async <T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE', 
  body?: object
): Promise<T> => {
  const url = `https://${SERVER_URL}${endpoint}`;
  
  console.log(`Making ${method} request to: ${url}`);
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': API_KEY
    },
    body: body ? JSON.stringify(body) : undefined
  };

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error(`API error (${response.status}):`, errorData);
    throw new Error(errorData.message || `API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data as T;
};
