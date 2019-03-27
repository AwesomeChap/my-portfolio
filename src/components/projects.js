import React, {Component} from 'react';
import Heading from './helper/heading';
import Expand from './helper/expand';
import {keywords} from './helper/data';
import superMarketImage from '../images/sp.png';
import '../css/projects.scss';

export default class Projects extends Component{

  constructor(props){
    super(props);
    this.state = {
      selectedItems : [],
    
    }
  }

  componentDidMount(){
    this.filters = this.state.selectedItems.length && this.getFilters(this.state.selectedItems);
  }

  filters = '';

  getFilters = (arr) => {
    if(arr.length > 1){
      return arr.slice(0, arr.length - 1).join(', ') + " and " + arr.slice(-1);
    }
    else{
      return arr.slice(0);
    }
  }

  findItem = (item) => this.state.selectedItems.indexOf(item);

  handleClick = (e) => {
    let currentSelect = e.target.dataset.name;
    console.log(`current select is ${currentSelect}`);
    let index = this.findItem(currentSelect);
    if(index !== -1){
      console.log('after removal');
      this.setState((prevState)=>{
        let selectedItems = prevState.selectedItems;
        selectedItems.splice(index,1);
        return{
          selectedItems
        }
      },()=>{
        console.log(this.state.selectedItems);
      })
    }
    else{
      console.log('after insertion');
      this.setState((prevState)=>{
        let selectedItems = prevState.selectedItems;
        selectedItems.push(currentSelect);
        return{
          selectedItems
        }
      },()=>{
        console.log(this.state.selectedItems);
      });
    }
  }

  handleFilterDelete = (e) => {
    // alert('hello');
    console.log(e.target);
    let targetFilter = e.target.dataset.name;
    console.log(`targetfilter is ${targetFilter}`)
    let index = this.findItem(targetFilter);
    if(index !== -1){
      console.log('after removal');
      this.setState((prevState)=>{
        let selectedItems = prevState.selectedItems;
        selectedItems.splice(index,1);
        return{
          selectedItems
        }
      },()=>{
        console.log(this.state.selectedItems);
      })
    }
    
  }

  render(){
    // let filters = this.state.selectedItems.length && this.getFilters(this.state.selectedItems);
    let filters = this.state.selectedItems.map((item,index)=>{
      return (
        <div key={index} className="filter"> 
          <div>{item}</div> 
          <div data-name={item} onClick={this.handleFilterDelete} id="cross"><i className="fas fa-times"></i></div> 
        </div>
      )
    })

    let kws = keywords.map((kw,index) => {
      const classes = this.findItem(kw) === -1 ? 'kw' : 'kw-selected';
      return <div key={index} onClick={this.handleClick} data-name={kw} className={classes}>{kw}</div>
    });

    return(
      <div className="section">
        <div className="sub-section">
          <div className="sec sec1">
            <div className="inner-section">
              ONE
            </div>
          </div>
          <div className="sec sec2">
            <div className="inner-section"> 
              <Heading heading={"PROJECTS"} subHeading={"Developer's Playground"}/>
              <div className="text">
                Projects matter a lot for me. As they are great medium by which I can 
                explore a technology or framework and check it's pros and limits at the 
                same time.They also make learning new skills very easy and enjoyable as 
                you mostly are working on something that you like and enjoy
              </div>
            </div>
          </div>
        </div>
        <div className="sec sec3">
          <div className="inner-section">
            <Heading repair={{y:-90}} heading={"WHAT I MAKE"} subHeading={'some cool ones'}/>
            <div className="block">
                <div className="keywords">{kws}</div>
                <div className="show-filters">CLick above to apply or toggle filter </div>
                {/* {
                  this.state.selectedItems.length ? (
                  <div className="show-filters">Filters applied : <span>{filters}</span> </div>
                  ) : (
                  <div className="show-filters">CLick above to apply or toggle filter </div>
                  )
                } */}
                <div className="projects-container">
                  <div className="project-wrapper">
                      <div className="project-title">
                        <div className="dots">
                          <div></div> <div></div> <div></div>
                        </div>
                        <div className="name"></div>
                      </div>
                    <div className="project">
                      <img src={superMarketImage} alt=""/>
                    </div>
                    <div className="project-desc"></div>
                    {/* <div className="project-info"></div> */}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}