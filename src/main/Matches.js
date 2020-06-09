import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import axios from 'axios';
import { ListGroup, Container } from 'react-bootstrap';
import './Main.css';
import { useHistory } from 'react-router';

function Matches({ competitions }) {

    const [scheduledMatches, setScheduledMatches] = useState([]);
    const [liveMatches, setLiveMatches] = useState([]);
    const { competitionName, eventId } = useParams();
    const [matchDetails, setMatchDetails] = useState({});
    const history = useHistory();

    useEffect(() => {
        const currentComp = competitions.filter(comp => comp.name.replace(/\s/g, '') === competitionName);

        if (currentComp.length !== 0) {

            const instance = axios.create({
                baseURL: 'https://api.football-data.org/v2/',
                headers: { 'X-Auth-Token': '42246a12f47b4afcad3a9a516972ff9d' }
            });

            instance.get(`competitions/${currentComp[0].id}/matches?status=LIVE`)
                .then(res => setLiveMatches(res.data.matches)).catch(function (error) {
                    console.log(error);
                  })

            instance.get(`competitions/${currentComp[0].id}/matches?status=SCHEDULED`)
                .then(res => setScheduledMatches(res.data.matches)).catch(function (error) {
                    console.log(error);
                  })
            }
    }, [competitionName, competitions])

    useEffect(() => {

        if (eventId !== undefined) {

        const instance = axios.create({
            baseURL: 'https://api.football-data.org/v2/',
            headers: { 'X-Auth-Token': '42246a12f47b4afcad3a9a516972ff9d' }
        });

        instance.get(`/matches/${eventId}`)
            .then(res => {
                setMatchDetails(res.data)
                console.log(res.data);
            })
        }
    }, [eventId])

    let showScheduledMatches = scheduledMatches.filter(match => {
        let gameTime = new Date(match.utcDate);
        let today = new Date();
        return ((gameTime - today) / 1000 / 60 / 60 / 24) < 15;
    }).map(match => (
        <NavLink className="item" key={match.id} to={`/${competitionName}/${match.id}`}>
            <ListGroup.Item className="item">
                <p>{match.homeTeam.name} : {match.awayTeam.name} <span className="scheduled">SCHEDULED</span></p>
            </ListGroup.Item>
        </NavLink>
    ))

    if(eventId !== undefined){
        showScheduledMatches = null;
    }

    const showLiveMatches = liveMatches.map(match => (
        <NavLink className="item" key={match.id} to={`/${competitionName}/${match.id}`}>
            <ListGroup.Item className="item">
                <p>{match.homeTeam.name} : {match.awayTeam.name} <span className="live">LIVE</span></p>
            </ListGroup.Item>
        </NavLink>
    ))

    let showMatchDetails = [];

    const goBackHandler = () => {
        history.goBack();
    }

    if(Object.keys(matchDetails).length > 0 && eventId !== undefined) {
        let matchday = new Date(matchDetails.match.utcDate);
        showMatchDetails = (
            <div className="segment">
                <p>{matchDetails.match.competition.name}</p>
                <p>{matchDetails.match.homeTeam.name} - {matchDetails.match.awayTeam.name}</p>
                <p className={matchDetails.match.status === 'SCHEDULED' ? 'scheduled' : 'live'}>{matchDetails.match.status}</p>
                <p>Score: {matchDetails.match.score.fullTime.homeTeam} - {matchDetails.match.score.fullTime.awayTeam}</p>
                <p>Matchday: {matchDetails.match.matchday}</p> 
                <p>{matchday.toString().slice(3,24)}</p>
                <p>Stadium: {matchDetails.match.venue}</p>
                <div><button onClick={goBackHandler}>Go Back</button></div>
            </div>
        );
    } else {
        showMatchDetails = [];
    }

    return (
        <Container>
            <ListGroup>
                { showLiveMatches }
                { showScheduledMatches }
            </ListGroup>
            { showMatchDetails }
        </Container>
    );
}

export default Matches;