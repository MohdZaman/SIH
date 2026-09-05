import Cookies from 'js-cookie';

const TOKEN_KEY = 'manakai_token';
const USER_KEY = 'manakai_user';

export const getTokenCookie = () => {
  return Cookies.get(TOKEN_KEY) || null;
};

export const setTokenCookie = (token, expiresDays = 30) => {
  if (token) {
    Cookies.set(TOKEN_KEY, token, {
      expires: expiresDays,
      sameSite: 'lax',
      secure: window.location.protocol === 'https:',
    });
  }
};

export const removeTokenCookie = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
};

export const getUserCookie = () => {
  const user = Cookies.get(USER_KEY);
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export const setUserCookie = (user, expiresDays = 30) => {
  if (user) {
    Cookies.set(USER_KEY, JSON.stringify(user), {
      expires: expiresDays,
      sameSite: 'lax',
      secure: window.location.protocol === 'https:',
    });
  }
};

export const removeUserCookie = () => {
  Cookies.remove(USER_KEY);
};