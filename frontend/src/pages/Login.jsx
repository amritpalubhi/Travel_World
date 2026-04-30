import React, { useState, useContext } from "react";
import { Container, Row, Col, Form, FormGroup, Button } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";
import { BASE_URL } from "../utils/config";

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

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      const response = await fetch(`${BASE_URL}/otp/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/otp/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ New OTP sent!");
        setOtp("");
        startTimer();
      } else {
        setMessage(data.message || "❌ Failed to resend OTP");
      }
    } catch (error) {
      setMessage("❌ Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Container>
        <Row className="justify-content-center">
          <Col lg="6" md="8">
            <div className="login__container p-4 shadow rounded">
              <h2 className="text-center mb-3">🔐 Secure Login</h2>
              <p className="text-center text-muted mb-4">
                Login with OTP - No password needed!
              </p>

              {message && (
                <p className="text-center text-info fw-semibold">{message}</p>
              )}

              {step === 1 && (
                <Form onSubmit={handleSendOTP}>
                  <FormGroup>
                    <label className="mb-2">📧 Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control otp-input"
                    />
                  </FormGroup>

                  <Button
                    className="btn primary__btn w-100 mt-3"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP →"}
                  </Button>
                </Form>
              )}

              {step === 2 && (
                <Form onSubmit={handleVerifyOTP}>
                  <p className="text-center mb-3">
                    OTP sent to <strong>{email}</strong>
                  </p>

                  <FormGroup>
                    <label className="mb-2">🔢 Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      placeholder="000000"
                      required
                      maxLength="6"
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      className="form-control otp-input otp-code"
                    />
                  </FormGroup>

                  <Button
                    className="btn primary__btn w-100 mt-3"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify & Login →"}
                  </Button>

                  <div className="text-center mt-3">
                    {resendDisabled ? (
                      <span className="text-muted">Resend OTP in {timer}s</span>
                    ) : (
                      <Button
                        color="link"
                        className="p-0"
                        type="button"
                        onClick={handleResendOTP}
                        disabled={loading}
                      >
                        Resend OTP
                      </Button>
                    )}
                  </div>
                </Form>
              )}

              <p className="text-center mt-4 text-muted">
                🔒 Your data is secure and encrypted
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;