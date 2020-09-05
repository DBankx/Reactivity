import { observable, action, computed } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import IActivity from '../Models/activitiy';
import Activities from '../api/agent';

//activity store
class ActivityStore {
  @observable activityRegistry = new Map();
  @observable activities: IActivity[] = [];
  @observable loadingInitial: boolean = false;
  @observable selectedActivity: IActivity | undefined = undefined;
  @observable editMode: boolean = false;
  @observable submitting: boolean = false;
  @observable target: string = '';

  //====computed=====
  @computed get activitiesByDate(): IActivity[] {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
  }

  //===actions====
  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities: IActivity[] = await Activities.list();
      activities.forEach((activity) => {
        activity.date = activity.date.split('.')[0];
        this.activityRegistry.set(activity.id, activity);
      });
      this.loadingInitial = false;
    } catch (err) {
      this.loadingInitial = false;
      console.log(err);
    }
  };

  // select an activity from the activities array
  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };

  // cancel selected activity
  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
  };

  // create an activity
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await Activities.create(activity);
      // adding the new activity to the activities dictionary
      this.activityRegistry.set(activity.id, activity);
      // making the newly created activity be the currently selected activity
      this.selectedActivity = activity;
      // cancling editMode
      this.editMode = false;
      // stop loading
      this.submitting = false;
    } catch (err) {
      this.submitting = false;
      console.log(err);
    }
  };

  // open the create form
  @action openCreateForm = () => {
    this.editMode = true;
    // removing the selected activity
    this.selectedActivity = undefined;
  };

  // edit the activity
  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await Activities.update(activity);
      this.activityRegistry.set(activity.id, activity);
      this.selectedActivity = activity;
      this.editMode = false;
      this.submitting = false;
    } catch (err) {
      this.submitting = false;
      console.log(err);
    }
  };

  // cancel edit mode
  @action cancelEditMode = () => {
    this.editMode = false;
  };

  // open the edit form
  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  // delete an activity
  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    try {
      await Activities.delete(id);
      this.activityRegistry.delete(id);
      this.submitting = false;
    } catch (err) {
      this.submitting = false;
      console.log(err);
    }
  };
}

export default createContext(new ActivityStore());
