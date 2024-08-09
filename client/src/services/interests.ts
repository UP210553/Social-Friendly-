// like.ts

import { getToken } from './localStorage';

const BASE_URL = new URL('http://localhost:3000/api/');

export const getUserType = async () => {
  const USER_URL = new URL('interest-type', BASE_URL);

  const res = await fetch(USER_URL, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  });

  if (!res.ok) {
    if ([401, 403].includes(res.status)) {
      throw new Error("Error de Autentificación");
    }
    throw new Error("No se pudo verificar si el like existe. Inténtalo de nuevo.");
  }


  return res.json();
};

export const getInterests = async () => {
  const USER_URL = new URL('interests', BASE_URL);

  const res = await fetch(USER_URL, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  });

  if (!res.ok) {
    if ([401, 403].includes(res.status)) {
      throw new Error("Error de Autentificación");
    }
    throw new Error("No se pudo verificar si el like existe. Inténtalo de nuevo.");
  }


  return res.json();
};

export const getLikes = async () => {
  const LIKE_URL = new URL('likes', BASE_URL);

  const resp = await fetch(LIKE_URL.toString(), {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    }
  });

  if (!resp.ok) {
    if ([401, 403].includes(resp.status)) {
      throw new Error("Error de Autentificación");
    }
    throw new Error("No se pudieron obtener los likes. Inténtalo de nuevo.");
  }
  return resp.json();
};
