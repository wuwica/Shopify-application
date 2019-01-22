import React, { Component } from 'react';
import search from './search.svg'
import './App.css';

class Waste extends Component {
  constructor(props) {
    super(props);
    this.handleFavorite = this.handleFavorite.bind(this);
  }
  handleFavorite(e) {
    this.props.addFavorite(this.props.id)
  }
  htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }
  render(){
    return(
      <div className="Waste-item">
          <div onClick={(e) => this.handleFavorite(e)} className="Star">
            <svg height="20" width="20" viewBox="0 0 50 50">
              {this.props.isFavorite ? (
                <path xmlns="http://www.w3.org/2000/svg" d="M48.856,22.73c0.983-0.958,1.33-2.364,0.906-3.671c-0.425-1.307-1.532-2.24-2.892-2.438l-12.092-1.757  c-0.515-0.075-0.96-0.398-1.19-0.865L28.182,3.043c-0.607-1.231-1.839-1.996-3.212-1.996c-1.372,0-2.604,0.765-3.211,1.996  L16.352,14c-0.23,0.467-0.676,0.79-1.191,0.865L3.069,16.622c-1.359,0.197-2.467,1.131-2.892,2.438  c-0.424,1.307-0.077,2.713,0.906,3.671l8.749,8.528c0.373,0.364,0.544,0.888,0.456,1.4L8.224,44.701  c-0.183,1.06,0.095,2.091,0.781,2.904c1.066,1.267,2.927,1.653,4.415,0.871l10.814-5.686c0.452-0.237,1.021-0.235,1.472,0  l10.815,5.686c0.526,0.277,1.087,0.417,1.666,0.417c1.057,0,2.059-0.47,2.748-1.288c0.687-0.813,0.964-1.846,0.781-2.904  l-2.065-12.042c-0.088-0.513,0.083-1.036,0.456-1.4L48.856,22.73z" style={{fill:'#24995c'}}/>
              ) : (
                <path xmlns="http://www.w3.org/2000/svg" d="M48.856,22.73c0.983-0.958,1.33-2.364,0.906-3.671c-0.425-1.307-1.532-2.24-2.892-2.438l-12.092-1.757  c-0.515-0.075-0.96-0.398-1.19-0.865L28.182,3.043c-0.607-1.231-1.839-1.996-3.212-1.996c-1.372,0-2.604,0.765-3.211,1.996  L16.352,14c-0.23,0.467-0.676,0.79-1.191,0.865L3.069,16.622c-1.359,0.197-2.467,1.131-2.892,2.438  c-0.424,1.307-0.077,2.713,0.906,3.671l8.749,8.528c0.373,0.364,0.544,0.888,0.456,1.4L8.224,44.701  c-0.183,1.06,0.095,2.091,0.781,2.904c1.066,1.267,2.927,1.653,4.415,0.871l10.814-5.686c0.452-0.237,1.021-0.235,1.472,0  l10.815,5.686c0.526,0.277,1.087,0.417,1.666,0.417c1.057,0,2.059-0.47,2.748-1.288c0.687-0.813,0.964-1.846,0.781-2.904  l-2.065-12.042c-0.088-0.513,0.083-1.036,0.456-1.4L48.856,22.73z" style={{fill:'grey'}}/>  
              )
            }
            </svg>
          </div>
          <h5>{this.props.title}</h5>
        <div className="Waste-body">
          <div dangerouslySetInnerHTML={{ __html: this.htmlDecode(this.props.body) }} />
        </div>
      </div>
    );
  }
}

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      error:null,
      isLoaded:false,
      wasteItems:[],
      searchResults:[],
      favorites:[],
      value:null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addFavorites = this.addFavorites.bind(this);
  }

  addFavorites(e){
    const newWaste = this.state.wasteItems.map(item => {
      if (item.id == e){
        return Object.assign({}, item, {isFavorite:!item.isFavorite})
      }
      return item
    })
    const filtered = newWaste.filter(item =>{
      return item.isFavorite
    });
    var results = [];
    if (this.state.value){
      console.log(this.state.value)
      results = newWaste.filter(item =>{
        return (this.state.value.replace(/[^\w\s]/gi, '').split(" ")).every(function(value){
          if (value.length > 0){
            return item.keywords.includes(value);
          }else{
            return true;
          }
        })
      });
    }
    this.setState({
      favorites: filtered,
      searchResults: results,
      wasteItems: newWaste
    })
  }
  handleChange(e){
    this.setState({
      value: e.target.value
    })
    if(e.target.value.length == 0){
      this.setState({
        searchResults: []
      })
    }
  }
  handleSubmit(e){
    e.preventDefault();
    if (this.state.value.length > 0){
      const results = this.state.wasteItems.filter(item =>{
        return (this.state.value.replace(/[^\w\s]/gi, '').split(" ")).every(function(value){
          if (value.length > 0){
            return item.keywords.includes(value);
          }else{
            return true;
          }
        })
      });
      this.setState({
        searchResults: results
      });
    }
  }
  
  componentDidMount() {
    fetch("https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000")
      .then(res => res.json())
      .then(
        (result) => {
          const mapping = result.map((item) => 
            {
              if (item.id){
                return(
                  {
                  id:item.id,
                  keywords: item.keywords.replace(/[^\w\s]/gi, '').split(" "),
                  title:item.title,
                  body:item.body,
                  isFavorite: false
                });
              }
              return (
                { 
                  id:item.title,
                  keywords: item.keywords.replace(/[^\w\s]/gi, '').split(" "),
                  title:item.title,
                  body:item.body,
                  isFavorite: false
                });
            }
          )
          this.setState({
            isLoaded: true,
            wasteItems: mapping
          });
        }, 
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    return (
      <div className="App">
        <div className="Banner">
          Toronto Waste Lookup
        </div>
        <form id="Search" onSubmit={this.handleSubmit}>
          <input
              id="Search-bar"
              onChange={this.handleChange}
          />
          <button id="Search-button" >
            <img id="Search-image" src={search}/>
          </button>
        </form>
          {this.state.searchResults.map((item) => {
            return <Waste key={item.id} id={item.id} body={item.body} title = {item.title} addFavorite={this.addFavorites} isFavorite={item.isFavorite}></Waste>
          }
        )}
        {this.state.favorites.length>0 ? (
          <div className="Favorites">
            <h6>Favorites</h6>
            {this.state.favorites.map((item) => {
              return <Waste key={item.id} id={item.id} body={item.body} title = {item.title} addFavorite={this.addFavorites} isFavorite={item.isFavorite}></Waste>
            }
          )}</div>) : ("")}
      </div>
    );
  }
}

export default App;
