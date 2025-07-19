import React, { useState } from 'react';
import './auth.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login/signup logic here
    alert(`${isLogin ? 'Login' : 'Signup'} form submitted`);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="Full Name" required />
          )}
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p onClick={toggleForm} className="auth-toggle">
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
