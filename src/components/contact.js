import React, { Component } from 'react';
import Heading from './helper/heading';
import '../css/pages.scss';
import '../css/contact.scss';

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
    };
  }

  isEmail = mail => /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);

  handleNextClick = (e) => {
    const {name, email, message} = this.state;
    if (this.state.isactive) {
      this.setState({
        step: this.state.step + 1
      }, () => {
        switch(this.state.step){
          case 1 : this.checkName(name); break;
          case 2 : this.checkEmail(email); break;
          case 3 : this.checkMessage(message); break;
          default : console.log('hye');
        }
        if (this.state.step === 4) {
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
        case 1: this.setState({ name: "Please enter valid name" }); break;
        case 2: this.setState({ email: "Please enter valid email" }); this.setState({ emailErr: true }); break;
        case 3: this.setState({ message: "Please enter some text" }); this.setState({ msgErr: true }); break;
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
      if (this.state.emailErr) this.setState({ emailErr: false });
    }
    else {
      this.setState({ isactive: false });
      if (!this.state.emailErr) this.setState({ emailErr: true });
    }
  }

  checkMessage = (message) => {
    if (message.length > 1) {
      this.setState({ isactive: true });
      if (this.state.msgErr) this.setState({ msgErr: false });
    }
    else {
      this.setState({ isactive: false });
      if (!this.state.msgErr) this.setState({ msgErr: true });
    }
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {
      switch (this.state.step) {
        case 1:this.checkName(this.state.name);break;
        case 2:this.checkEmail(this.state.email);break;
        case 3:this.checkMessage(this.state.message);break;
        default: console.log('yeh kya daldiya bhai');
      }
    });
  }

  handleFieldIconClick = (step) => {
    const {name, email, message} = this.state;
    switch(step){
      case 1 : this.checkName(name); break;
      case 2 : this.checkEmail(email); break;
      case 3 : this.checkMessage(message); break;
      default : console.log('hye');
    }
    if (this.state.step !== 4) {
      this.setState({ step: step }, () => {
        console.log(this.state.step);
      });
    }
  }

  handleFocus = (event) => event.target.select();

  render() {
    return (
      <div className="section">
        <div className="sub-section">
          <div className="sec sec2">
            <div className="inner-section">
              <Heading heading={"CONTACT"} subHeading={'Get In Touch'} />
              <div className="text">
                I am always up for cool projects that creates a difference.
                So in case you have one and wanna talk about it or just say hi,
                fill the awesome form or just drop me a message at my email,
                jatin15011999@gmail.com and ~{"let's talk"}
              </div>
              <div className="sub-heading">{"Let's Get Social"}</div>
              <div className="social-container">
                <div className="social-icon" > <i className="fab if fa-facebook-f"></i><span>FACEBOOK</span></div>
                <div className="social-icon" > <i className="fab ig fa-github"></i><span>GITHUB</span></div>
                <div className="social-icon" > <i className="fab il fa-linkedin-in"></i><span>LINKEDIN</span></div>
                <div className="social-icon" > <i className="fab it fa-twitter"></i><span>TWITTER</span></div>
              </div>
            </div>
          </div>
          <div className="sec sec2">
            <div className="inner-section">
              <div className="lets-talk-bg">{"Let's Talk"}</div>
              <div className="contact-form-wrapper">
                <div className="fields">
                  {this.state.name.length > 0 && <span onClick={()=>{this.handleFieldIconClick(1)}}><i className="fas fa-user"></i></span>}
                  {this.state.email.length > 0 && <span onClick={()=>{this.handleFieldIconClick(2)}}><i className="fas fa-envelope"></i></span>}
                  {this.state.message.length > 0 && <span onClick={()=>{this.handleFieldIconClick(3)}}><i className="fas fa-comment-dots"></i></span>}
                </div>
                <form className="contact-form">
                  {
                    this.state.step === 1 && (
                      <>
                        <label htmlFor="name">NAME</label>
                        <input value={this.state.name} className={this.state.nameErr ? "err" : ""} onFocus={this.handleFocus} onClick={this.handleFocus} onChange={this.handleChange} type="text" id="name" name="name" placeholder="Your name.." />
                      </>
                    )
                  }
                  {
                    this.state.step === 2 && (
                      <>
                        <label htmlFor="email">EMAIL</label>
                        <input value={this.state.email} className={this.state.emailErr ? "err" : ""} onFocus={this.handleFocus} onClick={this.handleFocus} onChange={this.handleChange} type="text" id="email" name="email" placeholder="Enter your email" />
                      </>
                    )
                  }
                  {
                    this.state.step >= 3 && (
                      <>
                        <label htmlFor="message">MESSAGE</label>
                        <textarea value={this.state.message} className={this.state.msgErr ? "err" : ""} onFocus={this.handleFocus} onClick={this.handleFocus} onChange={this.handleChange} rows="1" type="text" id="message" name="message" placeholder="Enter your message"></textarea>
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
    )
  }
}