
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

// Constants for specific users
const RODRIGO_GROUP_ID = '120363420212322973@g.us';
const RODRIGO_EMAIL = 'rodrigobm10@gmail.com';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AudioMessage {
  sender_id: string;
  sender_name?: string;
  message_id?: string;
  audio_url?: string;
  duration?: number;
  instance_id: string;
  metadata?: Record<string, any>;
}

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function storeAudioMessageForRodrigo(audioMessage: AudioMessage) {
  try {
    // Insert the audio message into Rodrigo's table
    const { data, error } = await supabase
      .from('rodrigo_audio_messages')
      .insert([audioMessage]);

    if (error) {
      console.error('Error storing audio message for Rodrigo:', error);
      return false;
    }

    console.log('Successfully stored audio message for Rodrigo', data);
    return true;
  } catch (error) {
    console.error('Exception storing audio message for Rodrigo:', error);
    return false;
  }
}

// Process the webhook event and store audio messages for Rodrigo
async function processWebhookEvent(event: any): Promise<boolean> {
  try {
    console.log('Processing webhook event:', JSON.stringify(event));
    
    // Ensure this is a message event
    if (!event.message) {
      console.log('Not a message event, skipping');
      return false;
    }
    
    // Check if this is an audio message
    const messageType = event.message.type;
    if (messageType === 'audio' || messageType === 'voice' || messageType === 'ptt') {
      // Check if the message is for Rodrigo's group
      if (event.message.to === RODRIGO_GROUP_ID || event.message.from === RODRIGO_GROUP_ID) {
        console.log(`Audio message for Rodrigo detected from ${event.message.from}`);
        
        const audioMessage: AudioMessage = {
          sender_id: event.message.from,
          sender_name: event.message.sender?.name || event.message.sender?.pushname,
          message_id: event.message.id,
          audio_url: event.message.mediaUrl,
          duration: event.message.mediaDuration,
          instance_id: event.instance.id,
          metadata: {
            timestamp: event.message.timestamp,
            mediaType: event.message.mediaMimeType,
            caption: event.message.caption
          }
        };
        
        return await storeAudioMessageForRodrigo(audioMessage);
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method === "POST") {
      const event = await req.json();
      
      // Process the webhook event
      const success = await processWebhookEvent(event);
      
      return new Response(
        JSON.stringify({ success }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 405,
      }
    );
  } catch (error) {
    console.error("Error handling webhook:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
