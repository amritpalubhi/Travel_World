import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";
import { BASE_URL } from "../utils/config";

const OTP_URL = BASE_URL.replace('/api/v1', '/api')

const Login = () => {
  const [step, setStep]                   = useState(1);
  const [email, setEmail]                 = useState("");
  const [otp, setOtp]                     = useState("");
  const [loading, setLoading]             = useState(false);
  const [message, setMessage]             = useState("");
  const [timer, setTimer]                 = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${OTP_URL}/otp/send`, {
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
    } catch {
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
      const response = await fetch(`${OTP_URL}/otp/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      if (data.success) {
        // Store role inside user object so admin check works
        const userWithRole = { ...data.data, role: data.role };
        dispatch({ type: "LOGIN_SUCCESS", payload: userWithRole });
        localStorage.setItem("user", JSON.stringify(userWithRole));
        localStorage.setItem("token", data.token);
        setMessage("✅ Login successful!");
        // Redirect admin to dashboard, others to home
        setTimeout(() => navigate(data.role === "admin" ? "/admin" : "/"), 1000);
      } else {
        setMessage(data.message || "❌ Invalid OTP");
      }
    } catch {
      setMessage("❌ Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    setLoading(true);
    try {
      const response = await fetch(`${OTP_URL}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.success) { setMessage("✅ New OTP sent!"); setOtp(""); startTimer(); }
    } catch {
      setMessage("❌ Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setResendDisabled(true);
    setTimer(60);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) { clearInterval(interval); setResendDisabled(false); return 0; }
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
                    <input type="email" placeholder="Enter your email" required
                      value={email} onChange={e => setEmail(e.target.value)} className="otp-input" />
                  </FormGroup>
                  <Button className="otp-btn primary" type="submit" disabled={loading}>
                    {loading ? "Sending..." : "Send OTP →"}
                  </Button>
                </Form>
              )}

              {step === 2 && (
                <Form onSubmit={handleVerifyOTP} className="otp-form">
                  <p className="otp-sent-to">OTP sent to <strong>{email}</strong></p>
                  <FormGroup>
                    <label>🔢 Enter 6-Digit OTP</label>
                    <input type="text" placeholder="000000" required maxLength="6"
                      value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
                      className="otp-input otp-code" />
                  </FormGroup>
                  <Button className="otp-btn primary" type="submit" disabled={loading || otp.length !== 6}>
                    {loading ? "Verifying..." : "Verify & Login →"}
                  </Button>
                  <div className="otp-resend">
                    {resendDisabled
                      ? <span>Resend OTP in {timer}s</span>
                      : <button type="button" onClick={handleResendOTP} className="link-btn">Resend OTP</button>
                    }
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
