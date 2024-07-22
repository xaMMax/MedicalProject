import {InvalidTokenError, jwtDecode} from "jwt-decode";

const verifyToken = (token) => {
  if (!token) {
    return InvalidTokenError;
  }
    console.log('Token from tokenUtils', token);
  return jwtDecode(token);
};

export { verifyToken };
