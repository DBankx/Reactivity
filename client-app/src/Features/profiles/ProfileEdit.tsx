import React, { Fragment, useContext, useState } from "react";
import {Form as FinalForm, Field} from "react-final-form";
import {Form, Header, Button, Grid} from "semantic-ui-react";
import TextInput from "../../App/common/form/TextInput";
import TextAreaInput from "../../App/common/form/TextAreaInput";
import { RootStoreContext } from "../../App/stores/rootStore";
import { observer } from "mobx-react-lite";
import { combineValidators, isRequired } from "revalidate";
import { IProfileFormValues } from "../../App/Models/profile";

const ProfileEdit: React.FC = () => {
    const {profile, editProfile} = useContext(RootStoreContext).profileStore;
    const [editMode, setEditMode]= useState<boolean>(false);
    
    const validate = combineValidators({
        "displayName": isRequired("Display name")
    });
    
    return (
        <Fragment>
            <Grid>
                <Grid.Column width={16}>
            <Header floated={"left"} icon={"user"} content={profile && ("About "+ profile.displayName)} />
            <Button floated={"right"} onClick={() => setEditMode(!editMode)} basic content={editMode ? "Cancel" : "EditProfile"} />
                </Grid.Column>
                <Grid.Column width={16} >
            
            {editMode ? (<FinalForm validate={validate} initialValues={profile} onSubmit={(values: IProfileFormValues) => editProfile(values)} render={({handleSubmit, pristine, invalid, submitError, dirtySinceLastSubmit, submitting}) => (
                <Form onSubmit={handleSubmit}>
                    <Field name={"displayName"} component={TextInput} />
                    <Field name={"bio"} component={TextAreaInput}  />
                    <Button positive floated={"right"} loading={submitting} content={"Update Profile"} disabled={invalid && !dirtySinceLastSubmit || pristine} />
                </Form>
            )} />) : (<p>{profile && (profile.bio)}</p>)}
                </Grid.Column>
            </Grid>
        </Fragment>
    )
}

export default observer(ProfileEdit);