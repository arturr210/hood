import React, {
    Component
} from 'react';
import {
    locations
} from './locs.js';
import './App.css';
 

  const  CLIENTID = 'DHYP414BYAR0DDOA1OVMGUXNPVN5NA5IYBM3QCCDI1PSYSKC';  
  const  SECRET = '5OFGVUMI2LJA3QFOAYYZGIQBR2VYM1EMS0205RVRONXOZVR1';
 

var indextest;

var activeInfoWindow;

class App extends Component {


    fetchData(x, index) {

        console.log(x, index, indextest,'x', 'index','indextest')
        let tempdata = [];
        let data = {};

        const ind=index




        let locs = this.state.locs

        console.log(locs, 'locs')



        var url = "https://api.foursquare.com/v2/venues/search?client_id=" + CLIENTID + "&client_secret=" + SECRET + "&v=20180729&ll=" + x.lat + "," + x.lng + "&limit=1";


        fetch(url)                         //inspired by google resorces
            .then((response) => {

                if (response.ok) {
                    return response.json();
                }
                throw new Error('error no data, check console or exceeded limit, again...');
            }).then((jsonData) => {

                data = jsonData.response.venues[0];
                this.setState({
                    data: data
                });

 


                    console.log(this.state.infowindows[indextest])

                    this.state.infowindows[indextest].setContent("<h1>" + this.state.data.name + "</h1>" + "<h3>" + this.state.data.location.formattedAddress + "</h3>");

            
                tempdata.push(data);
                console.log(data.location.formattedAddress, 'data')

                this.setState({
                    data: data
                });
                this.setState({
                    tempdata: tempdata
                });
                console.log(tempdata, 'tempdata')

                //console.log( jsonData.response.venues[0])
                return jsonData;
            }).catch((error) => { 
                console.error(error);
                this.state.infowindows[indextest].setContent("<h1>" + this.state.locs[indextest].name + "</h1>" + "<h3>" + 'No data from API provider' + "</h3>");
            })
        return true;




    }



    filterList = (event) => { // taken from stackoverflow


        console.log(event.target.value)


        var updatedList = this.state.locs.map((m) => m.name);

        updatedList = updatedList.filter(function(item) {
            return item.toLowerCase().search(
                event.target.value.toLowerCase()) !== -1;

        });


        this.setState({
            items: updatedList,

        });




        if (event.target.value !== '') { // taken from stackoverflow and Udacity's webinars

            this.state.locs.forEach((loc, index) => {
                if (loc.name.toLowerCase().includes(event.target.value.toLowerCase())) {
                    this.state.markers[index].setVisible(true)
                } else {
                    if (this.state.infowindows.marker === this.state.markers[index]) {

                        this.state.infowindows.close()

                        console.log(this.state.infowindows, 'windo')

                    }
                    this.state.markers[index].setVisible(false)
                    const map = document.getElementById('map')
                    this.state.infowindows[index].close(map, this.state.markers[index]);
                }
            })
        } else {
            this.state.locs.forEach((loc, index) => {
                if (this.state.markers.length && this.state.markers[index]) {
                    this.state.markers[index].setVisible(true)
                    this.state.markers[index].setAnimation(window.google.maps.Animation.DROP);
                    const map = document.getElementById('map')
                    this.state.infowindows[index].close(map, this.state.markers[index]);
                }
            })
        }




        let arr1 = updatedList.map(item => ({
            'name': item
        }));
        let arr2 = this.state.locs;
        let filtered = [];

        arr1.filter(function(newData) {
            return arr2.filter(function(oldData) {
                if (newData.name === oldData.name) {
                    filtered.push({

                        'name': newData.name,
                        'lat': oldData.lat,
                        'lng': oldData.lng,
                    })
                }
            })
        });

        this.setState({
            filtered: filtered,

        });




        console.log(filtered);
        console.log(this.state.filtered, 'state filtered');

        console.log(updatedList, 'updatedList');
    }

    componentWillMount() {
        //this.fetchData();
        this.setState({
            items: this.state.locs.map(m => m.name)
        })
    }



    state = {

        locs: locations,
        places: '',
        markers: [],
        infowindows: [],
        items: [],
        filtered: [],
        data: {},
        tempdata: [],
        infoaddress: [],
        ind: '',
    }




    onTileClickTwo = (props, marker, e) => {

        console.log(props, marker)



        let tempmarks = this.state.locs;

        var testing = tempmarks.findIndex(b => b.name === props)
       indextest=testing;


        console.log(testing, 'testing2')
        this.fetchData(this.state.locs[testing], testing)
        console.log(this.fetchData(this.state.locs[testing]), 'fetchiiiing')
        console.log(this.state.markers, 'this.state.markers')

        window.google.maps.event.trigger(this.state.markers[testing], 'click');
        console.log(this.state.infowindows, 'infowindowsTwo')


        console.log(this.state.data)

    }

    componentDidMount() {



        window.initMap = this.initMap;

        loadJS("https://maps.googleapis.com/maps/api/js?v=3&key=AIzaSyAcOI-r7d806emt2NSUdtj-YUZf38kKhtQ&callback=initMap")

    }

    initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), { // based and taken either  from the Udacity course or stackoverflow search...

            center: {
                lat: 51.507416,
                lng: -0.127670,
            },
            zoom: 13
        })


 

        this.state.locs.map((place, index) => {
            console.log(index)


            var marker = new window.google.maps.Marker({
                position: {
                    lat: place.lat,
                    lng: place.lng
                },
                map: map,
                name: place.name,
                animation: window.google.maps.Animation.DROP,
            })
            this.state.markers.push(marker)

            let content = `<h1>${place.name}</h1>`
            let infowindow = new window.google.maps.InfoWindow({
                content: content
            })
            this.state.infowindows.push(infowindow)


            marker.addListener('click', function() {

                if (activeInfoWindow) {
                    activeInfoWindow.close();
                    marker.open = false;
                }
                if (!marker.open) {
                    infowindow.open(map, marker);
                    marker.open = true;
                    activeInfoWindow = infowindow;


                    this.setAnimation(window.google.maps.Animation.BOUNCE);
                    setTimeout(function() {
                        marker.setAnimation(null);
                    }, 1250);
                } else {
                    infowindow.close();
                    marker.open = false;
                }

            })

            map.addListener('click', function() {
                infowindow.close();
                marker.open = false;
            })

        })
    }


    render() {

        return (
            <div id='app' role="application" tabIndex="-1">
                
                   
                    <div key='1' ref="map" id='map'  role="region" aria-label="London Neighborhood" style={{height:'100vh', width:'80%',marginLeft:'0'}}>
                    <p>
                      Loading Google Maps... 
                      
                    </p></div>
                    <div className='sidebar'  >
                      <form style={{width: '100%'}}className='sideform' >
                      <fieldset  className="form-group">
                      <input style={{width: '100%'}} type="text" className="form-control form-control-lg" placeholder="Search"    role="Search" aria-labelledby="Search "  tabIndex="1" onChange={this.filterList.bind(this)}/>
                      </fieldset>
                      </form>
                   
               
                        { this.state.items.map( (item) => (


                           <div className='location'    key={item} onClick={this.onTileClickTwo.bind(this, item)} ><li   tabIndex='3' data-category={item} key={item}>{item}</li></div>
                        ))}
                       
                
                    </div>

      </div>
        )
    }
}

function loadJS(src) { // from google serach :how to make google maps work without 3rd partu library, soethig like this
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = () => {
        alert('an error or some errors..., hit f5...')
    };
    ref.parentNode.insertBefore(script, ref);
}

export default App