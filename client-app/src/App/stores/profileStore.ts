import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import { IProfile, IPhoto, IProfileFormValues } from "../Models/profile";
import { Profile } from "../api/agent";
import { toast } from "react-toastify";

export default class ProfileStore {
    rootStore: RootStore

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
    }

    // checks if the current user is the user viewing his profile
    @computed get isCurrentUser() {
        if (this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        } else {
            return false;
        }
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile: boolean = true;
    @observable uploadingPhoto: boolean = false;
    @observable loading: boolean = false;
    @observable deletingPhoto: boolean = false;

    @action loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await Profile.get(username);
            runInAction("get profile", () => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            runInAction("profile loading error", () => {
                this.loadingProfile = false;
            })
            console.log(error);
        }
    }

    @action uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await Profile.uploadPhoto(file)
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos.push(photo);
                    if (photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto = false;
            })
        } catch (err) {
            console.log(err);
            toast.error("Problem uploading photo");
            runInAction(() => {
                this.uploadingPhoto = false;
            });
        }

    }

    @action setMainPhoto = async (photo: IPhoto) => {
        this.loading = true;
        try {
            await Profile.setMainPhoto(photo.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find((a) => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            })
        }catch (error) {
    toast.error("Problem setting photo as main");
    runInAction(() => {
        this.loading = false;
    })
        }
    }
    
    @action deletePhoto = async(photo: IPhoto) => {
        this.deletingPhoto = true;
        try{
            await Profile.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter((p) => {
                    return p.id != photo.id;
                });
                this.deletingPhoto = false;
            })
        }catch(err){
            toast.error("Problem deleting photo");
            runInAction(() => {
                this.deletingPhoto = false;
            })
        }
    }
    
    @action editProfile = async(values: IProfileFormValues) => {
        try{
            await Profile.edit(values);
            runInAction(() => {
                this.profile!.displayName = values.displayName;
                this.profile!.bio = values.bio;
                this.rootStore.userStore.user!.displayName =  values.displayName;
            })
        } catch(error){
            console.log(error);
            toast.error("Problem updating profile")
        }
    }

}