import React, {Fragment, Component} from 'react';

export default class Expand extends Component{
   

   render(){
     const {terms} = this.props;
     const text = terms.map((term,index) => {
      return(
        <Fragment key={index}>
          {term[0]}<span>{term.split('').map((t,i)=>{
            if(i>0){
              return t;
            }
          })}{" "}</span>
        </Fragment>
      )
     })
     return(
      <div className="expand">
        {text}
      </div>
     );
   }
}