import React, { useEffect, useState } from 'react';
import Heading from './helper/Headings';
import MaintenanceBlock from './helper/MaintenanceBlock';
import ContactForm from './helper/ContactForm';
import '../styles/pages.scss';
import '../styles/contact.scss';
import MetaTags from 'react-meta-tags';

/** Production: set true when the contact form is ready to ship. */
const CONTACT_FORM_LIVE = false;

const DEV_PREVIEW_KEY = 'portfolio_contact_form_preview';

function isLocalDevHost() {
  if (typeof window === 'undefined') return false;
  const host = window.location.hostname;
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]' ||
    host.endsWith('.local')
  );
}

export default (props) => {
  const [mobileView, setMobileView] = useState(undefined);
  const [isLocalhost, setIsLocalhost] = useState(false);
  const [devShowForm, setDevShowForm] = useState(false);

  useEffect(() => {
    setMobileView(window.innerWidth < 479);
    props.trackPageView();
    const onWindowResize = () => setMobileView(window.innerWidth < 479);
    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
  }, []);

  useEffect(() => {
    const local = isLocalDevHost();
    setIsLocalhost(local);
    if (!local) return;
    try {
      setDevShowForm(sessionStorage.getItem(DEV_PREVIEW_KEY) === '1');
    } catch {
      /* storage unavailable */
    }
  }, []);

  const showContactForm = isLocalhost ? devShowForm : CONTACT_FORM_LIVE;

  const toggleDevPreview = () => {
    const next = !devShowForm;
    setDevShowForm(next);
    try {
      if (next) sessionStorage.setItem(DEV_PREVIEW_KEY, '1');
      else sessionStorage.removeItem(DEV_PREVIEW_KEY);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <>
      <MetaTags>
        <title>Contact - Jatin Kumar</title>
        <meta name="description" content="I am always up for cool projects that could create a difference. So in case you have one and wanna talk about it or just say hi, drop me a message at my email Jatin Kumar and ~let's talk" />
      </MetaTags>
      <div className="section section-contact">
        <div className="inner-section">
          <div className="sub-section">
            <div className="inner-sub-section">
              <Heading heading={"CONTACT"} subHeading={'Get In Touch'} />
              <div className="text">
                I am always up for cool projects that creates a difference.
                So in case you have one and wanna talk about it or just say hi,
                drop me a message at my{' '}
                <a href="mailto:jatin15011999@gmail.com">email</a> and <span style={{ fontWeight: 900 }}>~let's talk</span>
              </div>
              <div className="sub-heading">{"Let's Get Social"}</div>
              <div className="social-container">
                {
                  !mobileView ? (
                    <>
                      <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/J4TINKUMAR" className="social-icon" > <i className="fab if fa-facebook-f"></i><span>FACEBOOK</span></a>
                      <a target="_blank" rel="noopener noreferrer" href="https://github.com/AwesomeChap" className="social-icon" > <i className="fab ig fa-github"></i><span>GITHUB</span></a>
                      <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/-jatin-kumar/" className="social-icon" > <i className="fab il fa-linkedin-in"></i><span>LINKEDIN</span></a>
                      <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/jatink99" className="social-icon" > <i className="fab it fa-twitter"></i><span>TWITTER</span></a>
                    </>
                  ) : (
                      <>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/J4TINKUMAR" className="social-icon-m" > <i className="fab if fa-facebook-f"></i></a>
                        <a target="_blank" rel="noopener noreferrer" href="https://github.com/AwesomeChap" className="social-icon-m" > <i className="fab ig fa-github"></i></a>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.linkedin.com/in/-jatin-kumar/" className="social-icon-m" > <i className="fab il fa-linkedin-in"></i></a>
                        <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/jatink99" className="social-icon-m" > <i className="fab it fa-twitter"></i></a>
                      </>
                    )
                }
              </div>
            </div>
            <div className="inner-sub-section">
              {showContactForm ? (
                <ContactForm mobileView={mobileView} />
              ) : (
                <MaintenanceBlock
                  className="contact-maintenance"
                  text="The contact form is temporarily offline. Reach out via email or the social links while we tune things up."
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {isLocalhost ? (
        <div className="dev-preview-toggle">
          <button
            type="button"
            className="dev-preview-toggle__btn"
            onClick={toggleDevPreview}
            aria-pressed={devShowForm}
          >
            {devShowForm
              ? 'Dev: showing contact form'
              : 'Dev: showing maintenance (prod view)'}
          </button>
        </div>
      ) : null}
    </>
  );
}
