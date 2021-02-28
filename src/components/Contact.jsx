import React, { useEffect, useState } from 'react';
import Heading from './helper/Headings';
import '../styles/pages.scss';
import '../styles/contact.scss';
import axios from 'axios';
import MetaTags from 'react-meta-tags';

export default () => {
  const [step, setStep] = useState(1);
  const [content, setContent] = useState({ name: "", email: "", message: "" });
  const [isActive, setIsActive] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const [msgErr, setMsgErr] = useState(false);
  const [err, setErr] = useState("");
  const [mobileView, setMobileView] = useState(undefined);
  const [msgSent, setMsgSent] = useState(undefined);

  useEffect(() => {
    setMobileView(window.innerWidth < 479);
    window.addEventListener('resize', onWindowResize);
    return () => {
      window.removeEventListener('resize', onWindowResize);
    }
  })

  useEffect(() => {
    const { name, email, message } = content;
    switch (step) {
      case 1: checkName(name); break;
      case 2: checkEmail(email); break;
      case 3: checkMessage(message); break;
      case 4: sendMessage(); break;
      default: throw "UKNOWN_STEP_HANDLE_ERROR";
    }
    if (step === 4) {

    }
  }, [step]);

  useEffect(() => {
    if (isActive) {
      if (nameErr) setNameErr(false);
    } else {
      if (!nameErr) setNameErr(true);
    }
  }, [isActive]);

  useEffect(() => {
    const { name, email, message } = content;
    switch (step) {
      case 1: checkName(name); break;
      case 2: checkEmail(email); break;
      case 3: checkMessage(message); break;
      default: console.log('yeh kya daldiya bhai');
    }
  }, [content])

  const sendMessage = () => {
    axios.post('/send', content).then(function ({ msg }) {
      setMsgSent(true);
    }).catch(function (error) {
      console.log(error);
    });

    setTimeout(() => {
      setStep(1);
      setContent({ name: "", email: "", message: "" });
      setIsActive(false);
      setNameErr(false);
      setEmailErr(false);
      setMsgErr(false);
    }, 3500)
  }

  const isEmail = email => {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return expression.test(String(email).toLowerCase())
  }


  const handleNextClick = (e) => {
    if (isActive) {
      setStep(step + 1);
    }
    else {
      switch (step) {
        case 1: setErr("Please enter valid name"); break;
        case 2: setErr("Please enter valid email"); setEmailErr(true); break;
        case 3: setErr("Please enter some text"); setMsgErr(true); break;
        default: console.log('yeh kya daldiya bhai');
      }
    }
  }

  const checkName = (name) => setIsActive(name.length >= 3 && !name.match(/[0-9?=.*!@#$%^&*]/i));

  const checkEmail = (email) => {
    if (isEmail(email)) {
      setIsActive(true);
      if (emailErr) {
        setEmailErr(false);
      }
    }
    else {
      setIsActive(false);
      if (!emailErr) {
        setEmailErr(true);
      }
    }
  }

  const checkMessage = (message) => {
    if (message.length > 1) {
      setIsActive(true);
      if (msgErr) {
        setMsgErr(false);
      }
    }
    else {
      setIsActive(false);
      if (!msgErr) {
        setMsgErr(true);
      }
    }
  }

  const handleChange = (e) => setContent({ ...content, [e.target.name]: e.target.value });

  const handleFieldIconClick = (step) => {
    const { name, email, message } = content;
    switch (step) {
      case 1: checkName(name); break;
      case 2: checkEmail(email); break;
      case 3: checkMessage(message); break;
      default: console.log('hye');
    }
    if (step !== 4) {
      setStep(step);
    }
  }

  const onWindowResize = () => setMobileView(window.innerWidth < 479)

  return (
    <>
      <MetaTags>
        <title>Contact - Jatin Kumar</title>
        <meta name="description" content="I am always up for cool projects that creates a difference. So in case you have one and wanna talk about it or just say hi, fill the awesome form or just drop me a message at my email Jatin Kumar and ~let's talk" />
      </MetaTags>
      <div className="section">
        <div className="inner-section">
          <div className="sub-section">
            <div className="inner-sub-section">
              <Heading heading={"CONTACT"} subHeading={'Get In Touch'} />
              <div className="text">
                I am always up for cool projects that creates a difference.
                So in case you have one and wanna talk about it or just say hi,
                fill the awesome form or just drop me a message at my
              email, <span className="hglt">jatin@jatinkumar.tech</span> and <span style={{ fontWeight: 900 }} >~let's talk</span>
              </div>
              <div className="sub-heading">{"Let's Get Social"}</div>
              <div className="social-container">
                {
                  !mobileView ? (
                    <>
                      <a target="_blank" href="https://www.facebook.com/J4TINKUMAR" className="social-icon" > <i className="fab if fa-facebook-f"></i><span>FACEBOOK</span></a>
                      <a target="_blank" href="https://github.com/AwesomeChap" className="social-icon" > <i className="fab ig fa-github"></i><span>GITHUB</span></a>
                      <a target="_blank" href="https://www.linkedin.com/in/-jatin-kumar/" className="social-icon" > <i className="fab il fa-linkedin-in"></i><span>LINKEDIN</span></a>
                      <a target="_blank" href="https://twitter.com/jatink99" className="social-icon" > <i className="fab it fa-twitter"></i><span>TWITTER</span></a>
                    </>
                  ) : (
                      <>
                        <a target="_blank" href="https://www.facebook.com/J4TINKUMAR" className="social-icon-m" > <i className="fab if fa-facebook-f"></i></a>
                        <a target="_blank" href="https://github.com/AwesomeChap" className="social-icon-m" > <i className="fab ig fa-github"></i></a>
                        <a target="_blank" href="https://www.linkedin.com/in/-jatin-kumar/" className="social-icon-m" > <i className="fab il fa-linkedin-in"></i></a>
                        <a target="_blank" href="https://twitter.com/jatink99" className="social-icon-m" > <i className="fab it fa-twitter"></i></a>
                      </>
                    )
                }
              </div>
            </div>
            <div className="inner-sub-section">
              <div className="lets-talk-bg">Let's Talk</div>
              <div className="contact-form-wrapper">
                {
                  !mobileView ? (
                    <div className="fields">
                      {content.name.length > 0 && <span onClick={() => { handleFieldIconClick(1) }}><i className="fas fa-user"></i></span>}
                      {content.email.length > 0 && <span onClick={() => { handleFieldIconClick(2) }} style={{ fontWeight: "900" }} >@</span>}
                      {content.message.length > 0 && <span onClick={() => { handleFieldIconClick(3) }}><i className="fas fa-envelope"></i></span>}
                    </div>
                  ) : content.name.length || content.email.length || content.message.length ? (
                    <div className="fields">
                      {content.name.length > 0 && <span onClick={() => { handleFieldIconClick(1) }}><i className="fas fa-user"></i></span>}
                      {content.email.length > 0 && <span onClick={() => { handleFieldIconClick(2) }} style={{ fontWeight: "900" }} >@</span>}
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
                          <div className="status-container" >
                            {!content.name.length ? (<span className="status empty">Field is empty</span>) : !isActive ? (<span className="error status" >Name too short</span>) : (<span className="status okay">Looks Fine</span>)}
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
                          <div className="status-container" >
                            {!content.email.length ? (<span className="status empty">Field is empty</span>) : !isActive ? (<span className="error status" >Invalid Email</span>) : (<span className="status okay">Looks Fine</span>)}
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
                            {!content.message.length ? (<span className="status empty">Field is empty</span>) : !isActive ? (<span className="error status" >Message too short</span>) : (<span className="status okay">Looks Fine</span>)}
                          </div>
                          <textarea autoFocus value={content.message} className={msgErr ? "err" : ""} onChange={handleChange} rows="1" type="text" id="message" name="message" placeholder="Wanna leave a message ?"></textarea>
                        </div>
                      </>
                    )
                  }
                  <div className="buttons">
                    {
                      step <= 3 ? (
                        <button onClick={(e) => { e.preventDefault(); handleNextClick() }} className={isActive ? "btn btn-active" : "btn"}>
                          {step <= 2 ? "NEXT" : "SEND"}
                        </button>
                      ) : (
                          <div className="btn sending"><span className="not-sent">SENDING</span> <span className="sent" >SENT</span> </div>
                        )
                    }
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}