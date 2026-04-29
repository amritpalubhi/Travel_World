// import React,{useState,useContext} from 'react'
// import { Container, Row, Col, Form,FormGroup, Button } from 'reactstrap'
// import { Link, useNavigate } from 'react-router-dom'
// import '../styles/Login.css'
// import { assets } from '../assets/assets'
// import { AuthContext } from '../context/AuthContext'
// import { BASE_URL } from '../utils/config'


// const Login = () => {

//   const[credentials,setCredentials] = useState({
//     email:undefined,
//     password:undefined
// })

// const {dispatch} = useContext(AuthContext)
// const navigate = useNavigate()


//   const handleChange = e=>{
//     setCredentials(prev => ({...prev, [e.target.id]:e.target.value}))

// }
// const handleClick = async e=>{
//   e.preventDefault()

//   try {
//     const res = await fetch(`${BASE_URL}/auth/login` ,{
//       method: 'post',
//       headers: {'Content-Type': 'application/json'},
//       credentials:'include',
//       body: JSON.stringify(credentials)
//     })
//     const result = await res.json()
//     if(!res.ok)alert(result.message)

//       console.log(result.data)

//       dispatch({type:'LOGIN_SUCCESS' , payload:result.data})
//       navigate('/')

//   } catch (err) {
//     dispatch({type:'LOGIN_FAILURE' , payload:err.message})
//   }
// }
//   return (
//     <section>
//       <Container>
//         <Row>
//           <Col lg='8' className='m-auto'>
//             <div className='login__container d-flex justify-content-between'>
//               <div className='login__img'>
//                 <img src={assets.loginImg} alt=''/>
//               </div>

//               <div className='login__form'>
//                 <div className='user'>
//                   <img src={assets.userIcon} alt=''/>
//                 </div>
//                 <h2>Login</h2>

//                 <Form onSubmit={handleClick} >
//                   <FormGroup>
//                     <input type='email' placeholder='Email' 
//                     required id='email' 
//                     onChange={handleChange}/>
//                   </FormGroup>
//                   <FormGroup>
//                   <input
//                     type='password'
//                     placeholder='Password' 
//                     required id='password' 
//                     onChange={handleChange}/>
//                   </FormGroup>
//                   <Button className='btn secondary__btn auth__btn' type='submit'>Login</Button>
//                 </Form>
//                 <p>Dont't have an account? <Link to='/register'>Create</Link></p>
//               </div>
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </section>
//   )
// }

// export default Login
import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";

const Login = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:4000/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ OTP sent! Check your email.");
        setStep(2);
        startTimer();
      } else {
        setMessage(data.message || "❌ Failed to send OTP");
      }
    } catch (error) {
      setMessage("❌ Error sending OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:4000/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.success) {
        dispatch({ type: "LOGIN_SUCCESS", payload: data.data });
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("token", data.token);
        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/"), 1000);
      } else {
        setMessage(data.message || "❌ Invalid OTP");
      }
    } catch (error) {
      setMessage("❌ Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage("✅ New OTP sent!");
        setOtp("");
        startTimer();
      }
    } catch (error) {
      setMessage("❌ Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setResendDisabled(true);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <section className="otp-login-section">
      <Container>
        <Row>
          <Col lg="6" className="m-auto">
            <div className="otp-login-container">
              <div className="otp-header">
                <h2>🔐 Secure Login</h2>
                <p>Login with OTP - No password needed!</p>
              </div>

              {message && (
                <div className={`otp-message ${message.includes("✅") ? "success" : "error"}`}>
                  {message}
                </div>
              )}

              {step === 1 && (
                <Form onSubmit={handleSendOTP} className="otp-form">
                  <FormGroup>
                    <label>📧 Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="otp-input"
                    />
                  </FormGroup>

                  <Button className="otp-btn primary" type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send OTP →"}
                  </Button>
                </Form>
              )}

              {step === 2 && (
                <Form onSubmit={handleVerifyOTP} className="otp-form">
                  <p className="otp-sent-to">
                    OTP sent to <strong>{email}</strong>
                  </p>

                  <FormGroup>
                    <label>🔢 Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      placeholder="000000"
                      required
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="otp-input otp-code"
                    />
                  </FormGroup>

                  <Button className="otp-btn primary" type="submit" disabled={loading || otp.length !== 6}>
                    {loading ? "Verifying..." : "Verify & Login →"}
                  </Button>

                  <div className="otp-resend">
                    {resendDisabled ? (
                      <span>Resend OTP in {timer}s</span>
                    ) : (
                      <button type="button" onClick={handleResendOTP} className="link-btn">
                        Resend OTP
                      </button>
                    )}
                  </div>
                </Form>
              )}

              <div className="otp-footer">
                <p>🔒 Your data is secure and encrypted</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;

