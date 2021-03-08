import React, { useEffect, useState } from 'react';
import "../../styles/ExpandText.scss";

export default (props) => {

  const [shouldExpand, setShouldExpand] = useState(undefined);
  const [expandTextClasses, setExpandTextClasses] = useState("expand");

  useEffect(() => {
    setExpandTextClasses(shouldExpand? "expand-text expand-text-active": "expand-text")
  }, [shouldExpand])

  const { terms } = props;
  const text = terms.map((term, index) => {
    return (
      <div className={"term"} key={index}>
        {term[0]}<span>{term.split('').map((t, i) => {
          if (i > 0) {
            return t;
          }
        })}&nbsp;</span>
      </div>
    )
  })
  return (
    <div className={expandTextClasses} onClick={() => setShouldExpand(!shouldExpand)}>
      {text}
      <a target="blank" href={`https://google.com/search?q=${terms.join("+")}`}>&nbsp;<i className="fas fa-external-link-alt"></i></a>
    </div>
  );
}