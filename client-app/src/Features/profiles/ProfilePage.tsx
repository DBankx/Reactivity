import React, { Fragment, useContext, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import { Grid } from "semantic-ui-react";
import ProfileContent from "./ProfileContent";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../App/stores/rootStore";
import { RouteComponentProps } from "react-router-dom";
import Spinner from "../../App/Layout/Spinner";

const ProfilePage: React.FC<RouteComponentProps<{username: string}>> = ({match}) => {
    
    const {profile, loadingProfile, loadProfile} = useContext(RootStoreContext).profileStore;

    useEffect(() => {
        loadProfile(match.params.username);
    }, [loadProfile, match.params.username]);
    
    if(loadingProfile) return <Spinner content={"Loading Profile..."} />
    
    return (
        <Grid>
            <Grid.Column width={16}>
            <ProfileHeader profile={profile!} />
            <ProfileContent profile={profile!} />
            </Grid.Column>
        </Grid>
    )
}

export default observer(ProfilePage);