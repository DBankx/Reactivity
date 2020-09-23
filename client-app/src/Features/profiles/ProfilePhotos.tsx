import React, { useContext, useState } from "react";
import { Tab, Header, Card, Image, Button, Grid } from "semantic-ui-react";
import { RootStoreContext } from "../../App/stores/rootStore";
import  PhotoUploadWidget from "../../App/common/photoUpload/PhotoUploadWidget";
import { observer } from "mobx-react-lite";

const ProfilePhotos = () => {
    const rootStore = useContext(RootStoreContext);
    const {profile, isCurrentUser, uploadingPhoto, uploadPhoto, setMainPhoto, loading, deletingPhoto, deletePhoto} = rootStore.profileStore;
    
    // local state
    const [addPhotoMode, setAddphotoMode] = useState<boolean> (false);
    const [target, setTarget] = useState<string | undefined>(undefined);
    
    const handleUploadImage = (photo: Blob) => {
        uploadPhoto(photo).then(() => setAddphotoMode(false));
    }
    
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: "0"}} >
                    <Header floated={"left"} icon={"image"} content={"Photos"} />
                    <Button floated={"right"} basic content={addPhotoMode ? "Cancel" : "Add Photo"} onClick={() => setAddphotoMode(!addPhotoMode)} />
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={handleUploadImage} loading={uploadingPhoto} />
                    ) : (
                        <Card.Group itemsPerRow={5}>
                            {profile && profile.photos.map((photo) => (
                                <Card key={photo.id}>
                                    <Image src={photo.url} />
                                    {isCurrentUser && (
                                        <Button.Group fluid widths={2}>
                                            <Button basic positive content={"Main"} onClick={(e) => {
                                                setMainPhoto(photo);
                                                setTarget(e.currentTarget.name)
                                            }} loading={loading && target == photo.id} name={photo.id} disabled={photo.isMain} />
                                            <Button name={photo.id} basic negative icon={"trash"} onClick={(e) => {
                                                deletePhoto(photo);
                                                setTarget(e.currentTarget.name);
                                            }} loading={deletingPhoto && target == photo.id} />
                                        </Button.Group>
                                    )}
                                </Card>
                            ))}
                        </Card.Group>
                    )}
                   
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
}

export default observer(ProfilePhotos);