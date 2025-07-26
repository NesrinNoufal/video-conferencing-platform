import  { useState } from 'react';
import './auth.css';
import useLogin from "../../hooks/authHooks/useLogin";
import useSignup from "../../hooks/authHooks/useSignup";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName,setFullName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const {loginData,loginLoading,loginError} = useLogin();
  const {signupData,signupLoading,signupError} = useSignup();


  const toggleForm = () => setIsLogin(!isLogin);

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // alert(`${isLogin ? 'Login' : 'Signup'} form submitted`);
    {isLogin ? useLogin("http:localhost:3000/login") : useSignup("http:localhost:3000/signup")};

    console.log(loginData);
    console.log(signupData);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="Full Name" value={fullName} onChange={setFullName(value)} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={setEmail(value)} required />
          <input type="password" placeholder="Password" value={password} onChange={setPassword(value)} required />
          {!isLogin && (<input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={setConfirmPassword(value)} required />)}
          {isLogin ? loginLoading : signupLoading}
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'} </button>
        </form>
        <p onClick={toggleForm} className="auth-toggle">
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
