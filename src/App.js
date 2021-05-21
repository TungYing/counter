import React, { useState, useEffect } from 'react';
import './App.css';
import countersJSON from './counters.json';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import { green, pink } from '@material-ui/core/colors';

const IDLE = 'Idle';
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 3,
    padding : '50px'
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  pink: {
    color: theme.palette.getContrastText(pink[500]),
    backgroundColor: pink[500],
  },
  green: {
    color: '#fff',
    backgroundColor: green[500],
  },
  processed: {
    display: 'flex'
  },
  small: {
    width: 10,
    height: 10,
  },
}));

function countersInit() {
  let counters = {};
  return countersJSON.map((item)=> { 
    return { 
      name:item.name, 
      proccessing: IDLE,
      processed:[],
      proccessingTime: 0
    }});
}

function App() {
  const [counters, setCounters] = useState(()=>countersInit())
  const [waitings, setWaitings] = useState([]);
  const [next, setNext] = useState(1);

  useEffect(()=>{
    if(waitings.length > 0 ){
      let newCounters = [...counters];
      let idleCounterIndex = counters.findIndex(counter => counter.proccessing === IDLE);
      if(idleCounterIndex !== -1){
        newCounters = setNextAndTIme(newCounters, idleCounterIndex, waitings[0]);
        setCounters(newCounters);
        setWorker(idleCounterIndex);
        setWaitings(waitings.slice(1));
        return;
      }
    }
  },[counters])

  const setNextAndTIme = (theCounters, index, next) =>{
    const time  = Math.floor((Math.random() * 1000) + 500);
    theCounters[index]['proccessing'] = next;
    theCounters[index]['proccessingTime'] = time;
    return theCounters;
  }

  const setWorker= (index) => {
    let id = setTimeout(function(){
      let newCounters = [...counters];
      newCounters[index]['processed'].push(newCounters[index]['proccessing']);
      newCounters[index]['proccessing'] = IDLE;
      setCounters(newCounters);
      clearTimeout(id);
    },counters[index]['proccessingTime'])
    
  }
  const onNextClick = (e) => {
    let newCounters = [...counters];
    let idleCounterIndex = counters.findIndex(counter => counter.proccessing === IDLE);
    if(idleCounterIndex !== -1 && waitings.length >= 0){
      if(waitings.length === 0) {
        newCounters = setNextAndTIme(newCounters, idleCounterIndex, next);
      } else {
        newCounters = setNextAndTIme(newCounters, idleCounterIndex, waitings[0]);
        setWaitings([...waitings.slice(1), next]);
      }
      setCounters(newCounters);
      setWorker(idleCounterIndex);
      setNext(prev=>prev+1);
      return;
    }
    setWaitings([...waitings, next])
    setNext(prev=>prev+1);
  }
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3} justify="center" alignItems="center">
        {counters.map(counter => {
          return (
            <Grid item xs={12} key={counter.name}>
              <Paper className={classes.paper}>
              <Grid container wrap="nowrap" spacing={1}>
                <Grid item xs={4}>
                  {counter.name}
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs={3}>
                  <Avatar className={classes.green}>{counter.proccessing}</Avatar>   
                </Grid>
                <Divider orientation="vertical" flexItem />
                <Grid item xs={5} className={classes.processed}>
                  {counter.processed.map(p => {
                    return (
                     <Avatar 
                     className={classes.small}
                     key={p} className={classes.pink}> {p} </Avatar>
                    )}) }
                </Grid>
              </Grid>
              </Paper>
            </Grid>
          )
        })}
        <Grid container direction="row" alignItems="baseline" justify="space-between" spacing={1}>
          <Grid item xs={4}><Button variant="contained" color="primary">waitings : {waitings.length}</Button></Grid>
          <Grid item xs={4}><Button variant="contained" color="primary" onClick={onNextClick}>Next : {next}</Button></Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
