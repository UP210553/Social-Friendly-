import conn from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { MAIN_DB_PREFIX } from '../keys';

interface Conversation {
    id: number;
    other_user_name: string;
    last_message: string;
}

// Crear una nueva conversación
export const createConversationService = async (userId1: number, userId2: number) => {
    const SQL = `INSERT INTO ${MAIN_DB_PREFIX}tr_conversation (user_Id1, user_Id2) VALUES (?, ?)`;
    const [result] = await conn.query<ResultSetHeader>(SQL, [userId1, userId2]);
    return result;
}

// Obtener todas las conversaciones del usuario
export const getConversationsService = async (userId: number) => {
    // Consulta SQL para obtener las conversaciones del usuario
    const SQL = `
      SELECT
        c.id AS conversation_id,
        CASE
          WHEN c.user_Id1 = ? THEN u2.full_name
          ELSE u1.full_name
        END AS other_user_name,
        COALESCE(
          (SELECT message_text
           FROM ${MAIN_DB_PREFIX}tr_messages
           WHERE id_conversation = c.id
           ORDER BY send_at DESC
           LIMIT 1
          ), 'No messages yet'
        ) AS last_message
      FROM ${MAIN_DB_PREFIX}tr_conversation c
      LEFT JOIN ${MAIN_DB_PREFIX}tr_user u1 ON c.user_Id1 = u1.id
      LEFT JOIN ${MAIN_DB_PREFIX}tr_user u2 ON c.user_Id2 = u2.id
      WHERE c.user_Id1 = ? OR c.user_Id2 = ?
    `;
  
    const [conversations] = await conn.query<RowDataPacket[]>(SQL, [userId, userId, userId]);
    return conversations;
}

// Enviar un mensaje
export const sendMessageService = async (conversationId: number, userId: number, message: string) => {
    const SQL = `INSERT INTO ${MAIN_DB_PREFIX}tr_messages (id_user, id_conversation, message_text, send_at) VALUES (?, ?, ?, NOW())`;
    await conn.query(SQL, [userId, conversationId, message]);
}

// Obtener mensajes de una conversación
export async function getMessagesService(conversationId: number): Promise<RowDataPacket[]> {
    try {
        const SQL = `SELECT * FROM ${MAIN_DB_PREFIX}tr_messages WHERE id_conversation = ? ORDER BY send_at ASC;`;
        const [result]: [RowDataPacket[], any] = await conn.query(SQL, [conversationId]);
        return result;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error('Error fetching messages');
    }
}
