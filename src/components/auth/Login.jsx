// src/Login/Login.jsx
import { useState } from 'react';
import LoginForm from './LoginForm';
import LoginSideBar from './LoginSideBar';
import ForgotPasswordModal from './ForgotPasswordModal';
import "./login.css";
import authApi from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/auth/authSlice';

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async (credentials) => {
    setLoading(true);
    setError('');
    
    try {
      const {data, status} = await authApi.login(credentials);

      if(status === 401){
        setError(data.message);
      }

      if(status === 200){
        localStorage.setItem("token", data.token);
        

const decoded = jwtDecode(data.token);
console.log(decoded);
        dispatch(loginSuccess({
          user: {
            id: decoded.sub,
            name: decoded.name,
            role: decoded.role
          },
          accessToken: data.token
        }))

        switch(decoded.role){
          case "UniversityAdmin":
            navigate('/university-admin-dashboard');
            break;
          case "Dean":
            navigate('/faculty-dean-dashboard');
            break;
          
          case "Professor":
            navigate('/professor-dashboard');
            break;
        }

      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* <LoginSideBar /> */}
      
      <div className="form-container">
        <LoginForm 
          onSubmit={handleLogin} 
          onForgotPassword={() => setShowForgotPassword(true)}
          loading={loading}
          error={error}
        />
      </div>
      
      {showForgotPassword && (
        <ForgotPasswordModal 
          onClose={() => setShowForgotPassword(false)} 
        />
      )}
    </div>
  );
};

export default Login;