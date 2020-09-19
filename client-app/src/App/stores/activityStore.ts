import { observable, action, computed, configure, runInAction } from 'mobx';
import { createContext, SyntheticEvent } from 'react';
import IActivity, { IAtendee } from '../Models/activitiy';
import Activities from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';
import { RootStore } from './rootStore';
import { IUser } from '../Models/user';
import { Agent } from 'http';

//configure mobx
configure({ enforceActions: 'always' });
//runInAction is to make all state changes be an action, so it cant be changed anywhere outside an action

//activity store
export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();
  @observable loadingInitial: boolean = false;
  @observable activity: IActivity | null = null;
  @observable submitting: boolean = false;
  @observable target: string = '';
  @observable loading: boolean = false;

  //====computed=====
  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    //reduce the array to group them by date
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0];
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
    const user = this.rootStore.userStore.user!;
    try {
      const activities: IActivity[] = await Activities.list();
      runInAction('loading activities', () => {
        activities.forEach((activity) => {
          activity.date = new Date(activity.date);
          // check if the current user is attending this activity
          activity.isGoing = activity.attendees.some(
            (a) => a.username === user.username
          );
          // check if the user is host of the activity
          activity.isHost = activity.attendees.some(
            (a) => a.username === user.username && a.isHost
          );
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
    const user: IUser = this.rootStore.userStore.user!;
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await Activities.details(id);
        runInAction('getting activity', () => {
          activity.date = new Date(activity.date);
          // check if the current user is attending this activity
          activity.isGoing = activity.attendees.some(
            (a) => a.username === user.username
          );
          // check if the user is host of the activity
          activity.isHost = activity.attendees.some(
            (a) => a.username === user.username && a.isHost
          );
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (err) {
        runInAction('get activity error', () => {
          this.loadingInitial = false;
        });
        console.log(err);
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

      const user = this.rootStore.userStore.user!;

      // create a new attendance and push it to the activity
      const attendance: IAtendee = {
        displayName: user.displayName,
        image: user.image!,
        isHost: true,
        username: user.username
      };

      let attendees = [];
      attendees.push(attendance);

      activity.attendees = attendees;

      runInAction('create activity', () => {
        // adding the new activity to the activities dictionary
        this.activityRegistry.set(activity.id, activity);
        // making the newly created activity be the currently selected activity
        this.activity = activity;
        // stop loading
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (err) {
      runInAction('create activity error', () => {
        this.submitting = false;
      });
      toast.error('Problem submitting data');
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
        history.push(`/activities/${activity.id}`);
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

  // attend an activity
  @action attendActivity = async () => {
    const user = this.rootStore.userStore.user!;
    this.loading = true;
    try {
      await Activities.attend(this.activity!.id);
      runInAction('attending an activity', () => {
        // create an attendee object
        const attendance: IAtendee = {
          displayName: user.displayName,
          image: user.image!,
          isHost: false,
          username: user.username
        };

        // push the new attendance to the activity attendees array
        if (this.activity) {
          this.activity.attendees.push(attendance);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        }
      });
    } catch (error) {
      runInAction('attending error', () => {
        this.loading = false;
      });
      toast.error('Problem signing up to activity');
    }
  };

  // cancel an attendance
  @action cancelAttendance = async () => {
    const user = this.rootStore.userStore.user!;
    this.loading = true;
    try {
      await Activities.unAttend(this.activity!.id);
      if (this.activity) {
        this.activity.attendees = this.activity.attendees.filter(
          (x) => x.username != user.username
        );
        this.activity.isGoing = false;
        this.activityRegistry.set(this.activity.id, this.activity);
        this.loading = false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error('Problem cancelling activity');
    }
  };
}
