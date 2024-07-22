import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useSessionChecker = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/check-session/', {
          headers: {
            // eslint-disable-next-line no-template-curly-in-string
            Authorization: 'Bearer ${token}',
          },
        });

        if (response.status !== 200) {
          throw new Error('Session expired');
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    // Перевірка сесії кожні 5 хвилин (300000 мілісекунд)
    const interval = setInterval(checkSession, 300000);
    return () => clearInterval(interval);
  }, [navigate, token]);
};

export default useSessionChecker;