import React, {Component} from 'react';
import '../css/footer.scss';

export default class Footer extends Component{
  constructor(props){
    super(props);
    this.state = {
      mobileView : window.innerWidth < 479
    };
  }

  render(){ 
    return(
      <div className="footer">
        <div className="sub-footer">
          <div className="footer-header">Let's Talk</div>
          <div>Wanna get in touch or talk about a project?</div>
          {!this.state.mobileView && <div>Feel free to contact me via email at <span>jatin@jatinkumar.tech</span></div>}
          {this.state.mobileView && <><div>Feel free to contact me via <span>jatin@jatinkumar.tech</span></div></>}
          <div>or drop a sweet message at <span>contact page</span></div>
          <div className="social-icons">
            <a className="if" target="_blank" href="https://www.facebook.com/J4TINKUMAR"><i className="fab fa-facebook-f"></i></a>
            <a className="ig" target="_blank" href="https://github.com/AwesomeChap"><i className="fab fa-github"></i></a>
            <a className="il" target="_blank" href="https://www.linkedin.com/in/-jatin-kumar/"><i className="fab fa-linkedin-in"></i></a>
            <a className="ii" target="_blank" href="https://www.instagram.com/jatin_1501/"><i className="fab fa-instagram"></i></a>
          </div>
          <div>Copyright &copy; 2019, Jatin Kumar. All Rights Reserved</div>
        </div>
      </div>
    )
  }
}
