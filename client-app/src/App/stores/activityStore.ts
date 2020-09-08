import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import IActivity from '../Models/activitiy';
import Activities from '../api/agent';

//configure mobx
configure({ enforceActions: 'always' });
//runInAction is to make all state changes be an action, so it cant be changed anywhere outside an action

//activity store
class ActivityStore {
  @observable activityRegistry = new Map();
  @observable loadingInitial: boolean = false;
  @observable activity: IActivity | null = null;
  @observable submitting: boolean = false;
  @observable target: string = '';

  //====computed=====
  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );

    //reduce the array to group them by date
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.split('T')[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  //===actions====
  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities: IActivity[] = await Activities.list();
      runInAction('loading activities', () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (err) {
      runInAction('load activities error', () => {
        this.loadingInitial = false;
      });
      console.log(err);
    }
  };

  //gets the activity from the dicitonary
  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  //loads the activity either from the dicitonary or from the api to reduce server load;
  @action loadActivity = async (id: string) => {
    let activity: IActivity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await Activities.details(id);
        runInAction('getting activity', () => {
          this.activity = activity;
          this.loadingInitial = false;
        });
      } catch (err) {
        runInAction('get activity error', () => {
          this.loadingInitial = false;
        });
        throw err;
      }
    }
  };

  //clear activity from state
  @action clearActivity = () => {
    this.activity = null;
  };

  // select an activity from the activities array
  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id);
  };

  // cancel selected activity
  @action cancelSelectedActivity = () => {
    this.activity = null;
  };

  // create an activity
  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await Activities.create(activity);
      runInAction('create activity', () => {
        // adding the new activity to the activities dictionary
        this.activityRegistry.set(activity.id, activity);
        // making the newly created activity be the currently selected activity
        this.activity = activity;
        // stop loading
        this.submitting = false;
      });
    } catch (err) {
      runInAction('create activity error', () => {
        this.submitting = false;
      });
      console.log(err);
    }
  };

  // open the create form
  @action openCreateForm = () => {
    // removing the selected activity
    this.activity = null;
  };

  // edit the activity
  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await Activities.update(activity);
      runInAction('edit activities', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
    } catch (err) {
      runInAction('edit activities error', () => {
        this.submitting = false;
        console.log(err);
      });
    }
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
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
      });
    } catch (err) {
      runInAction('delete activity error', () => {
        this.submitting = false;
      });
      console.log(err);
    }
  };
}

export default createContext(new ActivityStore());
