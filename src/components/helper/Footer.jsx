import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/footer.scss';

export default () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="footer">
        <div className="sub-footer">
          <div className="footer-header">Let's Talk</div>
          <div>Wanna get in touch or talk about a project?</div>
          <div>Feel free to contact me via <a href="mailto:jatin15011999@gmail.com">email</a></div>
          <div>or drop a sweet message at <Link to="/contact">contact page</Link></div>
          <div className="social-icons">
            <a className="if" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/J4TINKUMAR"><i className="fab fa-facebook-f"></i></a>
            <a className="ig" target="_blank" rel="noopener noreferrer" href="https://github.com/AwesomeChap"><i className="fab fa-github"></i></a>
            <a className="il" target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/-jatin-kumar/"><i className="fab fa-linkedin-in"></i></a>
            <a className="ii" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/jatin_1501/"><i className="fab fa-instagram"></i></a>
          </div>
          <div className="footer-copy">
            <span>Copyright &copy; {currentYear}, Jatin Kumar.</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </div>
  );
}