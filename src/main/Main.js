import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Matches from './Matches';
import { ListGroup, Row } from 'react-bootstrap';
import './Main.css'

function Main() {

  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    const instance = axios.create({
      baseURL: 'https://api.football-data.org/v2/',
      headers: { 'X-Auth-Token': '42246a12f47b4afcad3a9a516972ff9d' }
    });

    instance.get('competitions/')
      .then(res => setCompetitions(res.data.competitions.filter(comp => comp.plan === 'TIER_ONE'))
        .catch(function (error) {
          console.log(error);
        })
      )
  }, []);

  return (
    <div className="container">
      <h1>FOOTBALL WEB APP</h1>
      <Row className="row justify-content-md-center">
        <div>
          <ListGroup className="main leagues">
            {competitions.filter(comp => {
              return (comp.name === 'Championship' || comp.name === 'Premier League' || comp.name === 'Serie A'
                || comp.name === 'Bundesliga' || comp.name === 'Primera Division' || comp.name === 'Primeira Liga')
            }).map((comp) => (
              <NavLink key={comp.id} className="item" to={`/${comp.name.replace(/\s/g, '')}`}>
                <ListGroup.Item className="item">
                  <img className="image" alt="" src={comp.area.ensignUrl}></img>
                  <p className="league">{comp.name}</p>
                </ListGroup.Item>
              </NavLink>
            ))}
          </ListGroup>
        </div>
        <div>
          <Matches competitions={competitions} />
        </div>
      </Row>
    </div>
  );
}

export default Main;