
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Define types for audio message data
export interface AudioMessage {
  id?: string;
  created_at?: string;
  sender_id: string;
  sender_name?: string;
  message_id?: string;
  audio_url?: string;
  duration?: number;
  instance_id: string;
  metadata?: Record<string, any>;
}

// Constants for specific users
const RODRIGO_GROUP_ID = '120363420212322973@g.us';
const RODRIGO_EMAIL = 'rodrigobm10@gmail.com';

/**
 * Stores an audio message from a specific sender to Rodrigo's database
 */
export const storeAudioMessageForRodrigo = async (audioMessage: AudioMessage): Promise<boolean> => {
  try {
    console.log(`Storing audio message for Rodrigo from sender ${audioMessage.sender_id}`);
    
    // Ensure this is a message for Rodrigo's group
    if (audioMessage.sender_id !== RODRIGO_GROUP_ID) {
      console.log('Message not for Rodrigo group, skipping storage');
      return false;
    }

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
};

/**
 * Retrieves all audio messages stored for Rodrigo
 */
export const getRodrigoAudioMessages = async (): Promise<AudioMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('rodrigo_audio_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching Rodrigo audio messages:', error);
      return [];
    }

    return data as AudioMessage[];
  } catch (error) {
    console.error('Exception fetching Rodrigo audio messages:', error);
    return [];
  }
};

/**
 * Hook for managing audio messages for Rodrigo
 */
export const useRodrigoAudioMessages = () => {
  const { toast } = useToast();
  
  const handleNewAudioMessage = async (audioMessage: AudioMessage): Promise<boolean> => {
    const success = await storeAudioMessageForRodrigo(audioMessage);
    
    if (success) {
      toast({
        title: "Áudio gravado",
        description: `Áudio de ${audioMessage.sender_name || 'usuário'} foi gravado para o Rodrigo.`,
      });
      return true;
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível gravar o áudio para o Rodrigo.",
        variant: "destructive",
      });
      return false;
    }
  };
  
  return {
    handleNewAudioMessage,
    getRodrigoAudioMessages
  };
};
