import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getMessages, sendMessage } from '../services/conversation';
import { getManyUsers } from '../services/users';
import { getToken } from '../services/localStorage';
import { Button, Form, ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

interface Message {
  id: number;
  message_text: string;
  send_at: string;
  id_user: number;
}

interface User {
  id: number;
  full_name: string;
}

const ConversationPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [users, setUsers] = useState<Map<number, User>>(new Map());
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    if (conversationId) {
      // Fetch user ID, messages, and users
      getCurrentUserId().then(id => {
        setCurrentUserId(id);
        fetchMessages();
        fetchUsers();
      });
    }
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const fetchedMessages = await getMessages(Number(conversationId));
      console.log("Mensajes recibidos:", fetchedMessages);
      setMessages(fetchedMessages);
    } catch (error) {
      toast.error("Error al obtener mensajes. Inténtalo de nuevo.");
    }
  };

  const fetchUsers = async () => {
    try {
      const fetchedUsers = await getManyUsers();
      console.log("Usuarios recibidos:", fetchedUsers);
      const usersMap = new Map<number, User>();
      fetchedUsers.forEach((user: User) => {
        usersMap.set(user.id, user);
      });
      setUsers(usersMap);
      console.log("Mapa de usuarios:", usersMap);
    } catch (error) {
      toast.error("Error al obtener usuarios. Inténtalo de nuevo.");
    }
  };

  const getCurrentUserId = async (): Promise<number> => {
    const token = getToken();
    if (!token) throw new Error("No se pudo obtener el token de autenticación.");

    const user = JSON.parse(atob(token.split('.')[1]));
    console.log("Usuario actual ID:", user.id);
    return user.id;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      toast.warning("El mensaje no puede estar vacío.");
      return;
    }
    try {
      await sendMessage(Number(conversationId), newMessage);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      toast.error("Error al enviar el mensaje. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Conversación</h1>
      <ListGroup>
        {messages.length > 0 ? (
          messages.map((msg) => {
            const user = users.get(msg.id_user); // Cambiado a id_user
            console.log("Renderizando mensaje:", msg);
            console.log("Usuario asociado:", user);
            const isCurrentUser = msg.id_user === currentUserId; // Cambiado a id_user
            return (
              <ListGroup.Item
                key={msg.id}
                style={{
                  textAlign: isCurrentUser ? 'right' : 'left',
                  backgroundColor: isCurrentUser ? '#d1e7dd' : '#f8f9fa',
                  borderRadius: '10px',
                  margin: '5px 0',
                  padding: '10px',
                  alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                  display: 'flex',
                  flexDirection: isCurrentUser ? 'row-reverse' : 'row'
                }}
              >
                <strong>{user ? user.full_name : ''}</strong>: {msg.message_text}
                <br />
                <small className="text-muted">{new Date(msg.send_at).toLocaleTimeString()}</small>
              </ListGroup.Item>
            );
          })
        ) : (
          <ListGroup.Item>No hay mensajes.</ListGroup.Item>
        )}
      </ListGroup>
      <Form.Group className="mt-3">
        <Form.Control
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
              e.preventDefault();
            }
          }}
        />
      </Form.Group>
      <Button variant="primary" onClick={handleSendMessage} className="mt-3">Enviar</Button>
    </div>
  );
};

export default ConversationPage;
