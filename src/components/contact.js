import React, { Component } from 'react';
import Heading from './helper/heading';
import '../css/pages.scss';
import '../css/contact.scss';
import axios from 'axios';
import MetaTags from 'react-meta-tags';
import portfolio from '../images/portfolio.PNG';

export default class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      name: "",
      email: "",
      message: "",
      isactive: false,
      nameErr: false,
      emailErr: false,
      msgErr: false,
      err: "",
      mobileView: window.innerWidth < 479 ? true : false
    };
  }

  isEmail = mail => /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);

  handleNextClick = (e) => {
    const { name, email, message } = this.state;
    if (this.state.isactive) {
      this.setState({
        step: this.state.step + 1
      }, () => {
        switch (this.state.step) {
          case 1: this.checkName(name); break;
          case 2: this.checkEmail(email); break;
          case 3: this.checkMessage(message); break;
          default: console.log('hye');
        }
        if (this.state.step === 4) {
          const {name,email,message} = this.state;
          
          axios.post('/send', {name,email,message}).then(function ({msg}) {
            console.log(msg);
          }).catch(function ({msg}) {
            console.log(msg);
          });

          setTimeout(() => {
            this.setState({
              step: 1,
              name: "",
              email: "",
              message: "",
              isactive: false,
              nameErr: false,
              emailErr: false,
              msgErr: false
            })
          }, 3500)
        }
      });
    }
    else {
      switch (this.state.step) {
        case 1: this.setState({ err: "Please enter valid name" }); break;
        case 2: this.setState({ err: "Please enter valid email" }); this.setState({ emailErr: true }); break;
        case 3: this.setState({ err: "Please enter some text" }); this.setState({ msgErr: true }); break;
        default: console.log('yeh kya daldiya bhai');
      }
    }
  }

  checkName = (name) => {
    if (name.length >= 3 && !name.match(/[0-9?=.*!@#$%^&*]/i)) {
      this.setState({ isactive: true }, () => {
        if (this.state.nameErr) {
          this.setState({ nameErr: false });
        }
      })
    }
    else {
      this.setState({ isactive: false }, () => {
        if (!this.state.nameErr) {
          this.setState({ nameErr: true });
        }
      });
    }
  }

  checkEmail = (email) => {
    if (this.isEmail(email)) {
      // console.log('valid email');
      this.setState({ isactive: true });
      if (this.state.emailErr) {
        this.setState({ emailErr: false });
      }
    }
    else {
      this.setState({ isactive: false });
      if (!this.state.emailErr) {
        this.setState({ emailErr: true });
      }
    }
  }

  checkMessage = (message) => {
    if (message.length > 1) {
      this.setState({ isactive: true });
      if (this.state.msgErr) {
        this.setState({ msgErr: false });
      }
    }
    else {
      this.setState({ isactive: false });
      if (!this.state.msgErr) {
        this.setState({ msgErr: true });
      }
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      switch (this.state.step) {
        case 1: this.checkName(this.state.name); break;
        case 2: this.checkEmail(this.state.email); break;
        case 3: this.checkMessage(this.state.message); break;
        default: console.log('yeh kya daldiya bhai');
      }
    });
  }

  handleFieldIconClick = (step) => {
    const { name, email, message } = this.state;
    switch (step) {
      case 1: this.checkName(name); break;
      case 2: this.checkEmail(email); break;
      case 3: this.checkMessage(message); break;
      default: console.log('hye');
    }
    if (this.state.step !== 4) {
      this.setState({ step: step }, () => {
        console.log(this.state.step);
      });
    }
  }

  handleFocus = (event) => event.target.select();

  componentDidMount(){
    window.addEventListener('resize',this.resize);
  }

  resize = () => {
    this.setState({mobileView : window.innerWidth < 479 ? true : false});
  }

  render() {
    return (
      <>
        <MetaTags>
          <title>Contact - Jatin Kumar</title>
          <meta name="apple-mobile-web-app-title" content="Contact - Jatin Kumar" />
          <meta name="application-name" content="Jatin Kumar Portfolio" />
          <meta name="description" content="I am always up for cool projects that creates a difference. So in case you have one and wanna talk about it or just say hi,fill the awesome form or just drop me a message at my email,jatin@jatinkumar.tech and ~let's talk" />
          <meta property="og:title" content="Contact Jatin Kumar" />
          <meta property="og:image" content={portfolio} />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="Jatin Kumar" />
          <meta property="og:url" content="jatinkumar.tech/contact" />
          <meta property="og:description" content="I am always up for cool projects that creates a difference. So in case you have one and wanna talk about it or just say hi,fill the awesome form or just drop me a message at my email,jatin@jatinkumar.tech and ~let's talk" />
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
                  !this.state.mobileView ? (
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
                 !this.state.mobileView ? (
                  <div className="fields">
                    {this.state.name.length > 0 && <span onClick={() => { this.handleFieldIconClick(1) }}><i className="fas fa-user"></i></span>}
                    {this.state.email.length > 0 && <span onClick={() => { this.handleFieldIconClick(2) }} style={{fontWeight:"900"}} >@</span>}
                    {this.state.message.length > 0 && <span onClick={() => { this.handleFieldIconClick(3) }}><i className="fas fa-envelope"></i></span>}
                  </div>
                 ) : this.state.name.length || this.state.email.length || this.state.message.length ? (
                  <div className="fields">
                    {this.state.name.length > 0 && <span onClick={() => { this.handleFieldIconClick(1) }}><i className="fas fa-user"></i></span>}
                    {this.state.email.length > 0 && <span onClick={() => { this.handleFieldIconClick(2) }}style={{fontWeight:"900"}} >@</span>}
                    {this.state.message.length > 0 && <span onClick={() => { this.handleFieldIconClick(3) }}><i className="fas fa-envelope"></i></span>}
                  </div>
                 ) : ""
               }
                <form className="contact-form">
                  {
                    this.state.step === 1 && (
                      <>
                        <label htmlFor="name">NAME</label>
                        <div className="input-container">
                          <div className="status-container" >
                            {!this.state.name.length ? (<span className="status empty">Field is empty</span>) : !this.state.isactive ? (<span className="error status" >Name too short</span>) : (<span className="status okay">Looks Fine</span>)}
                          </div>
                          <input value={this.state.name} className={this.state.nameErr ? "err" : ""} onChange={this.handleChange} type="text" id="name" name="name" placeholder="What's your good name ?" />
                        </div>
                      </>
                    )
                  }
                  {
                    this.state.step === 2 && (
                      <>
                        <label htmlFor="email">EMAIL</label>
                        <div className="input-container">
                          <div className="status-container" >
                            {!this.state.email.length ? (<span className="status empty">Field is empty</span>) : !this.state.isactive ? (<span className="error status" >Invalid Email</span>) : (<span className="status okay">Looks Fine</span>)}
                          </div>
                          <input autoFocus value={this.state.email} className={this.state.emailErr ? "err" : ""} onChange={this.handleChange} type="text" id="email" name="email" placeholder="What's your email" />
                        </div>
                      </>
                    )
                  }
                  {
                    this.state.step >= 3 && (
                      <>
                        <label htmlFor="message">MESSAGE</label>
                        <div className="input-container">
                          <div className="status-container">
                            {!this.state.message.length ? (<span className="status empty">Field is empty</span>) : !this.state.isactive ? (<span className="error status" >Message too short</span>) : (<span className="status okay">Looks Fine</span>)}
                          </div>
                          <textarea autoFocus value={this.state.message} className={this.state.msgErr ? "err" : ""} onChange={this.handleChange} rows="1" type="text" id="message" name="message" placeholder="Wanna leave a message ?"></textarea>
                        </div>
                      </>
                    )
                  }
                  <div className="buttons">
                    {
                      this.state.step <= 3 ? (
                        <button onClick={(e) => { e.preventDefault(); this.handleNextClick() }} className={this.state.isactive ? "btn btn-active" : "btn"}>
                          {this.state.step <= 2 ? "NEXT" : "SEND"}
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
}