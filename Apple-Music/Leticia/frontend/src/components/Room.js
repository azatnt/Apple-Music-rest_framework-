import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import {Grade} from "@material-ui/icons";
import CreateRoomPage from "./CreateRoomPage";

export default class Room extends Component{
    constructor(props) {
        super(props);
        this.state = {
            votesToSkip : 2,
            guestCanPause : false,
            isHost : false,
            showSettings: false,
            SpotifyAuthenticated: false
        };

        this.roomCode = this.props.match.params.roomCode;
        this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.getRoomDetail = this.getRoomDetail.bind(this);
        this.authenticateSpotify = this.authenticateSpotify.bind(this);
        this.getRoomDetail();

        // console.log(this.props.match.params.roomCode)

    }


    getRoomDetail(){
        fetch('/api/get-room' + '?code=' + this.roomCode).then((response) =>
        {
            if(!response.ok){
                this.props.leaveRoomCallback();
                this.props.history.push("/");
            }
            return response.json()
        }).then((data)=>{
                this.setState({
                    votesToSkip : data.votes_to_skip,
                    guestCanPause: data.guest_can_pause,
                    isHost: data.is_host,
                });
                if (this.state.isHost){
                    this.authenticateSpotify();
                }
        });
    }


    authenticateSpotify() {
        fetch('/spotify/is-authenticated')
            .then((response) => response.json())
            .then((data)=>{
            this.setState({SpotifyAuthenticated: data.status});
                console.log(data.status)
            if (!data.status){
                fetch('/spotify/get-auth-url').then((response)=>response.json()).then((data)=>{
                   window.location.replace(data.url);
                });
            }
        });
    }


    leaveButtonPressed(){
        const requestOption = {
            method: "POST",
            headers: {"Content-Type": "application/json"}
        };
        fetch('/api/leave-room', requestOption).then((_response)=> {
            this.props.leaveRoomCallback();
            this.props.history.push("/");
        });
    }


    updateShowSettings(value){
        // console.log(value)
        this.setState({
            showSettings: value,
        });
    }


    renderSettings(){
        return(
            <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <CreateRoomPage
                    update={true}
                    votesToSkip={this.state.votesToSkip}
                    guestCanPause={this.state.guestCanPause}
                    roomCode={this.roomCode}
                    updateCallback={this.getRoomDetail}
                />
            </Grid>
            <Grid item xs={12} align="center">
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={()=>this.updateShowSettings(false)}
                >
                    Close
                </Button>
            </Grid>
        </Grid>
        )
    }

    renderSettingsButton(){
        return(
            <Grid item xs={12} align="center">
                <Button variant="contained" color="primary" onClick={()=>this.updateShowSettings(true)}>
                    Settings</Button>
            </Grid>
        );
    }




    render() {
        if(this.state.showSettings){
            return this.renderSettings();
        }
        return (

            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Code: {this.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Votes: {this.state.votesToSkip}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Guest can pause : {this.state.guestCanPause.toString()}
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <Typography variant="h6" component="h6">
                        Host: {this.state.isHost.toString()}
                    </Typography>
                </Grid>
                {this.state.isHost ? this.renderSettingsButton() : null }
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={this.leaveButtonPressed}> Leave room </Button>
                </Grid>
            </Grid>

        )
    }
}
