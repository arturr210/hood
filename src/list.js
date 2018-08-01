 import React, {
     Component
 } from 'react';
 import {
     locations
 } from './locs.js';
 import './App.css';




 class Filtered extends Component {


     constructor(props) {
         super(props);
         this.state = {
             initialItems: locations,
             items: [],


         };
     }



     filterList = (event) => {

         let init = this.state.initialItems
         var updatedList = init.map(m => m.name)
         updatedList = updatedList.filter(function(item) {
             return item.toLowerCase().search(
                 event.target.value.toLowerCase()) !== -1;
         });

         this.setState({
             items: updatedList
         });
     }


     handleclick(props) {

         console.log(props)

         this.props.onClick(props)
     }

     handlechange = (event) => {

         this.filterList(event)
         this.props.onChange(event)




     }
     componentWillMount() {
         this.setState({
             items: this.state.initialItems.map(m => m.name)
         })



     }

     render() {


         let self = this;
         return (
             <div  className='sidebar'  >
        <form  style={{width: '100%'}}className='sideform' >
        <fieldset className="form-group">
        <input style={{width: '100%'}}type="text" className="form-control form-control-lg" placeholder="Search"    role="Search" aria-label="Search "  tabIndex="1"   onChange={this.handlechange.bind(this)} />
 
        </fieldset>
        </form>
 

     
      {
 

        this.state.items.map(function(item) {
              
          return  <div key={item}  className='location' onClick={self.props.onClick.bind(self,item)}><li     aria-label="location" role='list'  tabIndex='3' data-category={item} key={item}>{item}</li></div>
        })
       }
   

      </div>
         );
     }
 }



 export default Filtered



