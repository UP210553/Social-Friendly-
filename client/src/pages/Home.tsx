// components/TinderCarousel.tsx
import React, { useEffect, useState } from "react";
import { Carousel } from 'react-bootstrap';
import { User } from "./PerfilUsuario";
import { getManyUsers } from "../services/users";
import { createLike, getLikes } from "../services/like";
import { createConversation } from "../services/conversation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getToken } from '../services/localStorage';
import { useNavigate } from 'react-router-dom';

const TinderCarousel: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUsersInfo();
  }, []);

  const getUsersInfo = async () => {
    try {
      const fetchedUsers = await getManyUsers();
      if (Array.isArray(fetchedUsers)) {
        setUsers(fetchedUsers);
      } else {
        toast.error("La respuesta del servidor no es válida.");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al obtener usuarios: ${error.message}`);
      } else {
        toast.error("Error desconocido al obtener usuarios.");
      }
    }
  };

  const getCurrentUserId = async () => {
    const token = getToken();
    if (!token) throw new Error("No se pudo obtener el token de autenticación.");
    const user = JSON.parse(atob(token.split('.')[1]));
    return user.id;
  };

  const handleLike = async () => {
    const likedUserId = users[index].id;
    const userId = await getCurrentUserId();
  
    try {
      await createLike(userId, likedUserId);
  
      // Crear una conversación si aún no existe
      const { id } = await createConversation(userId, likedUserId);
      setConversationId(id);
      setSelectedUser(users[index]);
  
      toast.success(`Le diste like a ${users[index].full_name}`);
    } catch (error) {
      // Usamos un type assertion para tratar 'error' como un Error
      if (error instanceof Error) {
        if (error.message === "Ya has dado like a este usuario.") {
          toast.warning(error.message);
        } else {
          toast.error(`Error al dar like: ${error.message}`);
        }
      } else {
        toast.error("Error desconocido al dar like.");
      }
    }
  
    moveToNext();
  };
  
  

  const handleDislike = () => {
    toast.info(`No te gustó ${users[index].full_name}`);
    moveToNext();
  };

  const moveToNext = () => {
    if (index < users.length - 1) {
      setIndex(index + 1);
    } else {
      toast.info("No hay más usuarios.");
    }
  };

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <div className="container mt-5 d-flex flex-column align-items-center">
      <Carousel activeIndex={index} onSelect={handleSelect} interval={null} controls={false} indicators={false} className="w-50">
        {users.length > 0 ? (
          users.map(user => (
            <Carousel.Item key={user.id}>
              <div className="card mx-auto" style={{ width: '18rem' }}>
                <div className="card-img-top" style={{
                  backgroundColor: 'grey',
                  height: '350px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'white', fontSize: '24px' }}>Imagen</span>
                </div>
                <div className="card-body text-center">
                  <h5 className="card-title">{user.full_name}</h5>
                  <p className="card-text">{user.description}</p>
                  <div className="mt-3">
                    <button className="btn btn-danger me-3" onClick={handleDislike}>
                      <FontAwesomeIcon icon={faThumbsDown} />
                    </button>
                    <button className="btn btn-success" onClick={handleLike}>
                      <FontAwesomeIcon icon={faThumbsUp} />
                    </button>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))
        ) : (
          <div>No hay usuarios disponibles.</div>
        )}
      </Carousel>
    </div>
  );
};

export default TinderCarousel;
