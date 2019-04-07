import React, {Component} from 'react';
import '../css/footer.scss';

export default class Footer extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  render(){ 
    return(
      <div className="footer">
        <div className="sub-footer">
          <div className="footer-header">Let's Talk</div>
          <div>Wanna get in touch or talk about a project?</div>
          <div>Feel free to contact me via email at <span>jatin15011999@gmail.com</span></div>
          <div>or drop a sweet message at <span>contact page</span></div>
          <div className="social-icons">
            <a className="if" href="#"><i className="fab fa-facebook-f"></i></a>
            <a className="ig" href="#"><i className="fab fa-github"></i></a>
            <a className="il" href="#"><i className="fab fa-linkedin-in"></i></a>
            <a className="it" href="#"><i className="fab fa-twitter"></i></a>
          </div>
          <div>Copyright &copy; 2019, Jatin Kumar. All Rights Reserved</div>
        </div>
      </div>
    )
  }
}
