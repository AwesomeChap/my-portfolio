import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/contact.scss';

export default function ContactForm({ mobileView }) {
  const [step, setStep] = useState(1);
  const [content, setContent] = useState({ name: "", email: "", message: "" });
  const [isActive, setIsActive] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [msgErr, setMsgErr] = useState(false);

  useEffect(() => {
    const { name, email, message } = content;
    switch (step) {
      case 1: checkName(name); break;
      case 2: checkEmail(email); break;
      case 3: checkMessage(message); break;
      case 4: sendMessage(); break;
      default: throw "UKNOWN_STEP_HANDLE_ERROR";
    }
  }, [step]);

  useEffect(() => {
    if (isActive) {
      if (nameErr) setNameErr(false);
    } else if (!nameErr) {
      setNameErr(true);
    }
  }, [isActive]);

  useEffect(() => {
    const { name, email, message } = content;
    switch (step) {
      case 1: checkName(name); break;
      case 2: checkEmail(email); break;
      case 3: checkMessage(message); break;
      default: break;
    }
  }, [content]);

  const sendMessage = () => {
    axios.post('/send', content).catch((error) => {
      console.log(error);
    });

    setTimeout(() => {
      setStep(1);
      setContent({ name: "", email: "", message: "" });
      setIsActive(false);
      setNameErr(false);
      setEmailErr(false);
      setMsgErr(false);
    }, 3500);
  };

  const isEmail = (email) => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return expression.test(String(email).toLowerCase());
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    if (isActive) {
      setStep(step + 1);
    } else {
      switch (step) {
        case 2: setEmailErr(true); break;
        case 3: setMsgErr(true); break;
        default: break;
      }
    }
  };

  const checkName = (name) => setIsActive(name.length >= 3 && !name.match(/[0-9?=.*!@#$%^&*]/i));

  const checkEmail = (email) => {
    if (isEmail(email)) {
      setIsActive(true);
      if (emailErr) setEmailErr(false);
    } else {
      setIsActive(false);
      if (!emailErr) setEmailErr(true);
    }
  };

  const checkMessage = (message) => {
    if (message.length > 1) {
      setIsActive(true);
      if (msgErr) setMsgErr(false);
    } else {
      setIsActive(false);
      if (!msgErr) setMsgErr(true);
    }
  };

  const handleChange = (e) => setContent({ ...content, [e.target.name]: e.target.value });

  const handleFieldIconClick = (fieldStep) => {
    const { name, email, message } = content;
    switch (fieldStep) {
      case 1: checkName(name); break;
      case 2: checkEmail(email); break;
      case 3: checkMessage(message); break;
      default: break;
    }
    if (fieldStep !== 4) {
      setStep(fieldStep);
    }
  };

  return (
    <>
      <div className="lets-talk-bg">Let's Talk</div>
      <div className="contact-form-wrapper">
        {
          !mobileView ? (
            <div className="fields">
              {content.name.length > 0 && <span onClick={() => { handleFieldIconClick(1) }}><i className="fas fa-user"></i></span>}
              {content.email.length > 0 && <span onClick={() => { handleFieldIconClick(2) }} style={{ fontWeight: "900" }}>@</span>}
              {content.message.length > 0 && <span onClick={() => { handleFieldIconClick(3) }}><i className="fas fa-envelope"></i></span>}
            </div>
          ) : content.name.length || content.email.length || content.message.length ? (
            <div className="fields">
              {content.name.length > 0 && <span onClick={() => { handleFieldIconClick(1) }}><i className="fas fa-user"></i></span>}
              {content.email.length > 0 && <span onClick={() => { handleFieldIconClick(2) }} style={{ fontWeight: "900" }}>@</span>}
              {content.message.length > 0 && <span onClick={() => { handleFieldIconClick(3) }}><i className="fas fa-envelope"></i></span>}
            </div>
          ) : ""
        }
        <form className="contact-form">
          {
            step === 1 && (
              <>
                <label htmlFor="name">NAME</label>
                <div className="input-container">
                  <div className="status-container">
                    {!content.name.length ? (<span className="status empty">Field is empty</span>) : !isActive ? (<span className="error status">Name too short</span>) : (<span className="status okay">Looks Fine</span>)}
                  </div>
                  <input value={content.name} className={nameErr ? "err" : ""} onChange={handleChange} type="text" id="name" name="name" placeholder="What's your good name ?" />
                </div>
              </>
            )
          }
          {
            step === 2 && (
              <>
                <label htmlFor="email">EMAIL</label>
                <div className="input-container">
                  <div className="status-container">
                    {!content.email.length ? (<span className="status empty">Field is empty</span>) : !isActive ? (<span className="error status">Invalid Email</span>) : (<span className="status okay">Looks Fine</span>)}
                  </div>
                  <input autoFocus value={content.email} className={emailErr ? "err" : ""} onChange={handleChange} type="text" id="email" name="email" placeholder="What's your email" />
                </div>
              </>
            )
          }
          {
            step >= 3 && (
              <>
                <label htmlFor="message">MESSAGE</label>
                <div className="input-container">
                  <div className="status-container">
                    {!content.message.length ? (<span className="status empty">Field is empty</span>) : !isActive ? (<span className="error status">Message too short</span>) : (<span className="status okay">Looks Fine</span>)}
                  </div>
                  <textarea autoFocus value={content.message} className={msgErr ? "err" : ""} onChange={handleChange} rows="1" id="message" name="message" placeholder="Wanna leave a message ?"></textarea>
                </div>
              </>
            )
          }
          <div className="buttons">
            {
              step <= 3 ? (
                <button type="button" onClick={handleNextClick} className={isActive ? "btn btn-active" : "btn"}>
                  {step <= 2 ? "NEXT" : "SEND"}
                </button>
              ) : (
                <div className="btn sending"><span className="not-sent">SENDING</span> <span className="sent">SENT</span></div>
              )
            }
          </div>
        </form>
      </div>
    </>
  );
}
