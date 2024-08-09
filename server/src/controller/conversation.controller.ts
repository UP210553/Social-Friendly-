import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import conn from '../db';  // Asegúrate de importar la conexión a la base de datos
import { MAIN_DB_PREFIX, JWT_SECRET } from '../keys';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import {
    createConversationService,
    getConversationsService,
    sendMessageService,
    getMessagesService
} from '../services/conversation';

// Función para obtener el usuario por token
const getUserByToken = async (token: string) => {
    try {
        if (!token) throw new Error('No token provided');

        const decoded = verify(token.replace('Bearer ', ''), JWT_SECRET) as { id: number };
        const userId = decoded.id;

        const SQL = `SELECT id FROM ${MAIN_DB_PREFIX}tr_user WHERE id = ?;`;
        const [result]: [RowDataPacket[], any] = await conn.query(SQL, [userId]);

        if (result.length > 0) {
            return result[0];
        }
        return null;
    } catch (error) {
        console.error('Error decoding token:', (error as Error).message);
        throw new Error('Invalid token');
    }
};

// Función para crear una conversación
export async function createConversation(req: Request, res: Response) {
    try {
        const user = await getUserByToken(req.headers.authorization || '');
        const { userId2 } = req.body;

        if (!user || !userId2) {
            return res.status(400).json({ message: "Invalid user data" });
        }

        const result = await createConversationService(user.id, userId2);
        if (result && 'insertId' in result) {
            res.json({ conversationId: result.insertId });
        } else {
            res.status(500).json({ message: "Error creating conversation" });
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in createConversation:', error.message);
            res.status(500).json({ message: error.message });
        } else {
            console.error('Unexpected error in createConversation:', error);
            res.status(500).json({ message: "Error creating conversation" });
        }
    }
}

// Función para obtener las conversaciones con detalles del último mensaje
export async function getConversations(req: Request, res: Response) {
    try {
        const user = await getUserByToken(req.headers.authorization || '');
        if (!user) {
            return res.status(400).json({ message: "Invalid user data" });
        }

        // Obtener las conversaciones con el último mensaje y nombre del otro usuario
        const conversations = await getConversationsService(user.id);
        res.json(conversations);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in getConversations:', error.message);
            res.status(500).json({ message: error.message });
        } else {
            console.error('Unexpected error in getConversations:', error);
            res.status(500).json({ message: "Error fetching conversations" });
        }
    }
}

// Función para enviar un mensaje
export async function sendMessage(req: Request, res: Response) {
    try {
        const user = await getUserByToken(req.headers.authorization || '');
        const { conversationId, message } = req.body;

        if (!user || !conversationId || !message) {
            return res.status(400).json({ message: "Invalid message data" });
        }

        await sendMessageService(conversationId, user.id, message);
        res.json({ message: "Message sent" });
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in sendMessage:', error.message);
            res.status(500).json({ message: error.message });
        } else {
            console.error('Unexpected error in sendMessage:', error);
            res.status(500).json({ message: "Error sending message" });
        }
    }
}

// Función para obtener los mensajes de una conversación
export async function getMessages(req: Request, res: Response) {
    try {
        const { conversationId } = req.params;

        if (!conversationId) {
            return res.status(400).json({ message: "Invalid conversation ID" });
        }

        console.log('Fetching messages for conversationId:', conversationId);  // Debug

        const messages = await getMessagesService(parseInt(conversationId, 10));
        res.json(messages);
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error in getMessages:', error.message);
            res.status(500).json({ message: error.message });
        } else {
            console.error('Unexpected error in getMessages:', error);
            res.status(500).json({ message: "Error fetching messages" });
        }
    }
}
