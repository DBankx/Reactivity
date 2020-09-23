import React from "react";
import {Tab} from "semantic-ui-react";
import {IProfile} from "../../App/Models/profile";
import { observer } from "mobx-react-lite";
import ProfilePhotos from "./ProfilePhotos";
import ProfileEdit from "./ProfileEdit";

interface IProps{
    profile: IProfile
}

const ProfileContent: React.FC<IProps> = ({profile}) => {
    const panes = [
        {menuItem: "About", render: () => <Tab.Pane><ProfileEdit /></Tab.Pane>},
        {menuItem: "Photos", render: () => <ProfilePhotos />},
        {menuItem: "Activities", render: () => <Tab.Pane>Activities Content</Tab.Pane>},
        {menuItem: "Followers", render: () => <Tab.Pane>Followers Content</Tab.Pane>},
        {menuItem: "Following", render: () => <Tab.Pane>Following Content</Tab.Pane>}
    ]
    return (
        <Tab 
        menu={{fluid: true, vertical: true}}
        menuPosition={"right"}
        panes={panes}
        />
    )
};

export default observer(ProfileContent);