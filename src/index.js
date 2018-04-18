import React from 'react';
import ReactDOM from 'react-dom';
import './custom.css';
import About from "./About";
import {BrowserRouter, Route, Link} from 'react-router-dom';

class Dota extends React.Component {
  constructor(){
    super();
    this.state = {
      heroes: [],
      search: "",
      roleSelected: 'all',
      attSelected: 'all',
      rolesValue: []
    };

  this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    fetch('https://api.opendota.com/api/heroStats/')
    .then(response => {
      if(response.ok) return response.json();
      throw new Error('Request failed.');
    })
    .then(data => {

      console.log(data);
      this.setState({heroes: data});
    })
    .catch(error => {
      console.log(error);
    });
  }

   handleInputChange(event) {
   const target = event.target;
   const value = target.type === 'dropdown' ? target.checked : target.value;
   const name = target.name;

   console.log(`${value}`); 

   this.setState({
     [name]: value,
   });
 }

  render() {

    console.log('Re-rendering');
    console.log(this.state);

    const filteredHeroes = this.state.heroes.filter(hero => hero.localized_name.toLowerCase().startsWith(this.state.search.toLowerCase()));

    const list = filteredHeroes.map( (u, i) => {
      const roleMatch = (this.state.roleSelected == u.roles || this.state.roleSelected === 'all');
      const attMatch = (this.state.attSelected === u.attack_type || this.state.attSelected === 'all');
        let url="http://cdn.dota2.com";
          return(roleMatch && attMatch) ? ( 
          <Hero key={i} name={u.localized_name} src={`http://cdn.dota2.com${u.img}`} role={u.roles + " "} attacktype={u.attack_type}/>
          ) :null;
    });
    
    return (
      <BrowserRouter>
      <div>
      <ul>
        <li><h3>DotA 2 APIS</h3></li>
        <li><Link to="/">Home </Link></li>
        <li><Link to="/about">About</Link></li>
      </ul>
      <section className="section">
      <form className="form-inline">
      <div class="form-group">
        <label for="roles">Roles:</label>
          <select class="form-control" name="roleSelected" onChange={this.handleInputChange} value={this.state.roleSelected}>
            <option value="Carry">Carry</option>
            <option value="Nuker">Nuker</option>
            <option value="Initiator">Initiator</option>
            <option value="Disabler">Disabler</option>
            <option value="Durable">Durable</option>
            <option value="Escape">Escape</option>
            <option value="Support">Support</option>
            <option value="Pusher">Pusher</option>
            <option value="Jungler">Jungler</option>
          </select>
      </div>
      <div class="form-group">
        <label for="attack_type">Attack Type:</label>
          <select class="form-control" name="attSelected" onChange={this.handleInputChange} value={this.state.attSelected}>
            <option value="Melee">Melee</option>
            <option value="Ranged">Ranged</option>
          </select>
      </div>
      <div class="form-group">
        <label for="name">Search by name:</label>
            <input name="search"  onChange={this.handleInputChange}  type="text" class="form-control"></input>
      </div>
      </form>
      <Route path="/about" component={About}/>
      <div className="row">
            {list}
         </div>
      </section>
      </div>
      </BrowserRouter>
    );
  }
}

class Hero extends React.Component {
  render() {
    return (
      <div className="col-lg-3">
          <h2>{this.props.name}</h2>
          <h5>{this.props.attacktype}</h5>
          <h6>{this.props.role}</h6>
          <img src={this.props.src}/>
      </div>
    );
  }
}

ReactDOM.render(
  <Dota />,
  document.getElementById('root')
);