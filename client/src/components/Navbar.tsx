import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPenToSquare, faRightToBracket, faRightFromBracket, faHome, faUserPen, faHeart, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import LikesList from '../components/LikeList';
import { getConversations } from '../services/conversation';

function Navbar() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [showLikes, setShowLikes] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);

  const logout = () => {
    localStorage.removeItem('tokenApp');
    navigate('/login');
  };

  useEffect(() => {
    if (isAuth) {
      const fetchConversations = async () => {
        try {
          const convs = await getConversations();
          console.log('Fetched conversations:', convs); // Verifica aquí
          setConversations(convs);
        } catch (error) {
          console.error('Error fetching conversations:', error);
        }
      };
      fetchConversations();
    }
  }, [isAuth]);

  const handleConversationClick = (conversationId: number) => {
    console.log('Clicked conversationId:', conversationId); // Verifica aquí
    if (conversationId && !isNaN(conversationId)) {
      navigate(`/conversation/${conversationId}`);
      setShowMessages(false);
    } else {
      console.error('Invalid conversationId:', conversationId);
    }
  };

  return (
    <>
      <style>{`
        .navbar {
          position: relative;
        }

        .likes-list {
          position: absolute;
          top: 30px; 
          right: 10px; 
          width: 300px; 
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          z-index: 1000;
          max-height: 400px; 
          overflow-y: auto; 
        }

        .likes-list .list-group-item {
          background: white; 
          color: #333; 
        }

        .likes-list .list-group-item:hover {
          background-color: #f8f9fa;
        }

        .messages-list {
          position: absolute;
          top: 30px; 
          right: 50px; 
          width: 300px; 
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          z-index: 1000;
          max-height: 400px; 
          overflow-y: auto; 
          padding: 10px;
        }

        .messages-list .message-item {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #ddd;
          cursor: pointer;
        }

        .messages-list .message-item:hover {
          background-color: #f8f9fa;
        }

        .messages-list .message-item .avatar {
          width: 40px;
          height: 40px;
          background-color: #ccc;
          border-radius: 50%;
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 20px;
        }

        .messages-list .message-item .details {
          flex: 1;
        }

        .messages-list .message-item .details .name {
          font-weight: bold;
          margin-bottom: 5px;
        }

        .messages-list .message-item .details .message {
          font-size: 14px;
          color: #666;
        }

        .messages-list .message-item .details .time {
          font-size: 12px;
          color: #999;
          margin-top: 5px;
        }
      `}</style>

      <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Social Friendly</a>
          <button name='toggle'
            className="navbar-toggler collapsed"
            type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarColor01"
            aria-controls="navbarColor01"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav me-auto">
              {
                isAuth && (
                  <>
                    <li className="nav-item">
                      <NavLink to="/" className="nav-link" style={{ cursor: "pointer" }} >
                        <FontAwesomeIcon icon={faHome} /> Inicio
                        <span className="visually-hidden">(current)</span>
                      </NavLink>
                    </li>
                    <li className="nav-item" style={{ cursor: "pointer" }} >
                      <NavLink to='/user' className='nav-link'>
                        <FontAwesomeIcon icon={faUserPen}/> User
                        <span className="visually-hidden">(current)</span>
                      </NavLink>
                    </li>
                    <li className="nav-item" 
                        style={{ position: 'relative', cursor: "pointer" }} 
                        onMouseEnter={() => setShowLikes(true)}
                        onMouseLeave={() => setShowLikes(false)}
                    >
                      <span className="nav-link">
                        <FontAwesomeIcon icon={faHeart}/> Likes
                      </span>
                      {showLikes && (
                        <LikesList />
                      )}
                    </li>
                    <li className="nav-item" 
                        style={{ position: 'relative', cursor: "pointer" }} 
                        onMouseEnter={() => setShowMessages(true)}
                        onMouseLeave={() => setShowMessages(false)}
                    >
                      <span className="nav-link">
                        <FontAwesomeIcon icon={faEnvelope}/> Messages
                      </span>
                      {showMessages && (
                        <div className="messages-list">
                          {conversations.length > 0 ? (
                            conversations.map(conv => (
                              <div 
                                key={conv.conversation_id} 
                                className="message-item"
                                onClick={() => handleConversationClick(conv.conversation_id)}
                              >
                                <div className="avatar">{conv.other_user_name.charAt(0)}</div>
                                <div className="details">
                                  <div className="name">{conv.other_user_name}</div>
                                  <div className="message">{conv.last_message}</div>
                                  <div className="time">{new Date(conv.last_message_time).toLocaleTimeString()}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p>No conversations</p>
                          )}
                        </div>
                      )}
                    </li>
                    <li className="nav-item" style={{ cursor: "pointer" }} onClick={logout}>
                      <span className="nav-link"><FontAwesomeIcon icon={faRightFromBracket} /> Logout </span>
                    </li>
                  </>
                )
              }
              {
                !isAuth && (
                  <>
                    <li className="nav-item dropdown">
                      <a 
                        className="nav-link dropdown-toggle" 
                        data-bs-toggle="dropdown" href="#" 
                        role="button" aria-haspopup="true" 
                        aria-expanded="true">
                          User <FontAwesomeIcon icon={faUser} />
                      </a>
                      <div className="dropdown-menu " data-bs-popper="static">
                        <NavLink to="/login" className="nav-link">Login <FontAwesomeIcon icon={faRightToBracket} /></NavLink>
                        <NavLink to="/register" className="nav-link">Registro <FontAwesomeIcon icon={faPenToSquare} /></NavLink>
                      </div>
                    </li>
                  </>
                )
              }
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
