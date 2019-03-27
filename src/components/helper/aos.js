import React, {Component} from 'react';

export default class AOS_c extends Component{

  constructor(props){
    super(props);
  }

  componentDidMount(){
    
  }

  render(){
    return(
      <div ref={(node)=> this.node = node}>
        {this.props.children}
      </div>
    )
  }
}