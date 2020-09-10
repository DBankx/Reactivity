//combining date and time to use when sending a form to create or update an activity
export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ':' + time.getMinutes() + ':00';

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // create the full date string with the new info
  const dateString = `${year}-${month}-${day}`;
  return new Date(dateString + ' ' + timeString);
};
