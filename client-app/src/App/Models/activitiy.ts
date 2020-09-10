//Defining the structure of the activity object

export default interface IActivity {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  date: Date;
  venue: string;
}

//Partial makes all the values in IActivity optional "?"
export interface IActivityFormValues extends Partial<IActivity> {
  time?: Date;
}

export class ActivityFormValues implements IActivityFormValues {
  id?: string = undefined;
  title: string = '';
  category: string = '';
  description: string = '';
  date?: Date = undefined;
  city: string = '';
  time?: Date = undefined;
  venue: string = '';

  //constructor to check if there is an activity and if there is  assign the values to the class properties
  constructor(init?: IActivityFormValues) {
    if (init && init.date) {
      init.time = init.date;
    }
    Object.assign(this, init);
  }
}
