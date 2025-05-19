
import { AudioMessage, storeAudioMessageForRodrigo } from './audioMessageService';

// Constants for specific users
const RODRIGO_GROUP_ID = '120363420212322973@g.us';
const RODRIGO_EMAIL = 'rodrigobm10@gmail.com';

interface WebhookMessageEvent {
  instance: {
    id: string;
    name: string;
  };
  message: {
    id: string;
    from: string;
    fromMe: boolean;
    to: string;
    body: string;
    type: string;
    caption?: string;
    timestamp: number;
    hasMedia: boolean;
    mediaUrl?: string;
    mediaMimeType?: string;
    mediaDuration?: number;
    sender?: {
      id: string;
      name?: string;
      pushname?: string;
    };
  };
}

/**
 * Process an incoming webhook event from the Evolution API
 */
export const processWebhookEvent = async (event: any): Promise<boolean> => {
  try {
    console.log('Processing webhook event:', JSON.stringify(event));
    
    // Ensure this is a message event
    if (!event.message) {
      console.log('Not a message event, skipping');
      return false;
    }

    const messageEvent = event as WebhookMessageEvent;
    
    // Check if this is an audio message
    if (messageEvent.message.type === 'audio' || messageEvent.message.type === 'voice' || messageEvent.message.type === 'ptt') {
      return await processAudioMessage(messageEvent);
    }
    
    return false;
  } catch (error) {
    console.error('Error processing webhook event:', error);
    return false;
  }
};

/**
 * Process an audio message from the webhook event
 */
const processAudioMessage = async (event: WebhookMessageEvent): Promise<boolean> => {
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
  
  return false;
};

/**
 * Configure a webhook for an instance in the Evolution API
 */
export const configureWebhook = async (
  instanceName: string, 
  webhookUrl: string, 
  apiKey: string
): Promise<boolean> => {
  try {
    const serverUrl = "evolutionapi2.innova1001.com.br";
    
    const response = await fetch(`https://${serverUrl}/instance/webhook/${encodeURIComponent(instanceName)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      body: JSON.stringify({
        url: webhookUrl,
        events: ['messages', 'messages.ack', 'messages.upsert']
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error configuring webhook:', errorData);
      return false;
    }

    const data = await response.json();
    console.log('Webhook configuration response:', data);
    return true;
  } catch (error) {
    console.error('Error configuring webhook:', error);
    return false;
  }
};
