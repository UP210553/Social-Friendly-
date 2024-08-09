    import { getToken } from './localStorage';

    const BASE_URL = new URL('http://localhost:3000/api/');

    // Función para crear una nueva conversación
    export const createConversation = async (userId1: number, userId2: number) => {
        const CONVERSATION_URL = new URL('conversation', BASE_URL);
    
        const token = getToken();
        if (!token) throw new Error("Token is missing");
    
        try {
        const resp = await fetch(CONVERSATION_URL.toString(), {
            method: 'POST',
            headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ userId1, userId2 })
        });
    
        if (!resp.ok) {
            if ([401, 403].includes(resp.status))
            throw new Error("Authentication Error");
            throw new Error(`Network response was not ok: ${resp.status} ${resp.statusText}`);
        }
    
        return await resp.json();
        } catch (error) {
        console.error('Error in createConversation:', error);
        throw error;
        }
    };
    // Función para obtener los mensajes de una conversación
    export const getMessages = async (conversationId: number) => {
    const MESSAGES_URL = new URL(`conversation/${conversationId}/messages`, BASE_URL);

    const token = getToken();
    if (!token) throw new Error("Token is missing");

    try {
        const resp = await fetch(MESSAGES_URL.toString(), {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
        });

        if (!resp.ok) {
        if ([401, 403].includes(resp.status))
            throw new Error("Authentication Error");
        throw new Error(`Network response was not ok: ${resp.status} ${resp.statusText}`);
        }

        return await resp.json();
    } catch (error) {
        console.error('Error in getMessages:', error);
        throw error;
    }
    };

    // Función para enviar un mensaje en una conversación
    export const sendMessage = async (conversationId: number, message: string) => {
    const MESSAGE_URL = new URL('message', BASE_URL);

    const token = getToken();
    if (!token) throw new Error("Token is missing");

    try {
        const resp = await fetch(MESSAGE_URL.toString(), {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ conversationId, message })
        });

        if (!resp.ok) {
        if ([401, 403].includes(resp.status))
            throw new Error("Authentication Error");
        throw new Error(`Network response was not ok: ${resp.status} ${resp.statusText}`);
        }

        return await resp.json();
    } catch (error) {
        console.error('Error in sendMessage:', error);
        throw error;
    }
    };

    // Función para obtener las conversaciones del usuario con detalles del último mensaje
    export const getConversations = async () => {
        const CONVERSATIONS_URL = new URL('conversation', BASE_URL);
      
        const token = getToken();
        if (!token) throw new Error("Token is missing");
      
        try {
          const resp = await fetch(CONVERSATIONS_URL.toString(), {
            method: 'GET',
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
      
          if (!resp.ok) {
            if ([401, 403].includes(resp.status))
              throw new Error("Authentication Error");
            throw new Error(`Network response was not ok: ${resp.status} ${resp.statusText}`);
          }
      
          const data = await resp.json();
          console.log('Fetched data in getConversations:', data); // Verifica aquí
          return data;
        } catch (error) {
          console.error('Error in getConversations:', error);
          throw error;
        }
      };
