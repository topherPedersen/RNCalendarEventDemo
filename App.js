import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
} from 'react-native';
import RNCalendarEvents from 'react-native-calendar-events';

// TODO: Install MomentJS

// Example UTC Time (Greenwich England): 2021-04-29T21:01:28+0000

const eventTitle = "New and Improved Calendar Event!";
// const startDate = "2021-04-30T13:15:00.000Z";
// const endDate = "2021-04-30T13:45:00.000Z";
const startDate = "2021-04-30T13:15:00.000Z";
const endDate = "2021-04-30T13:45:00.000Z";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  async checkPermissions() {
    let hasPermissionToAccessCalendar = false
    await RNCalendarEvents.checkPermissions((readOnly = false))
      .then((result) => {
        if (result === "authorized") {
          hasPermissionToAccessCalendar = true;
        } else {
          hasPermissionToAccessCalendar = false;
        }
      })
      .catch((error) => {
        hasPermissionToAccessCalendar = false;
      });
    return hasPermissionToAccessCalendar;
  }

  async requestPermissionToAccessCalendar() {
    let permissionToAccessCalendarGranted = false;
    await RNCalendarEvents.requestPermissions((readOnly = false))
      .then((result) => {
        if (result === "authorized") {
          permissionToAccessCalendarGranted = true;
        } else {
          permissionToAccessCalendarGranted = false;
        }
      })
      .catch((error) => {
        permissionToAccessCalendarGranted = false;
      });
    return permissionToAccessCalendarGranted;
  }

  async saveEventToCalendar(eventTitle, startDate, endDate) {
    RNCalendarEvents.findCalendars()
      .then( (result) => {
        const calendars = result;
        let primaryCalendar;
        calendars.forEach( (calendar) => {
          if (calendar.isPrimary) {
            primaryCalendar = calendar;
          }
        });
        if (typeof primaryCalendar !== 'undefined') {
          const calendarId = primaryCalendar.id;
          const eventDetails = {startDate, endDate, calendarId};
          const options = {}; // no options
          RNCalendarEvents.saveEvent(eventTitle, eventDetails)
            .then( (result) => {
              alert("Event Saved To Calendar! EVENT ID: " + result.toString());
            })
            .catch( (error) => {
              alert("ERROR: UNABLE TO SAVE EVENT TO CALENDAR. PLEASE ADD EVENT TO CALENDAR MANUALLY");
            });
        }
      })
      .catch((error) => {
        alert("ERROR: NO CALENDARS FOUND ON DEVICE");
      })
  }

  async addToCalendar(eventTitle, startDate, endDate) {
    
    let hasPermissionToAccessCalendar = await this.checkPermissions();

    if (!hasPermissionToAccessCalendar) {
      const permissionToAccessCalendarGranted = await this.requestPermissionToAccessCalendar();
      if (permissionToAccessCalendarGranted) {
        hasPermissionToAccessCalendar = true;
      }
    }

    if (hasPermissionToAccessCalendar) {
      this.saveEventToCalendar(eventTitle, startDate, endDate);
    }
  }

  render() {
    return(
      <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>RNCalendarApp</Text>
        <Button 
          title="Add to Calendar"
          onPress={ () => this.addToCalendar(eventTitle, startDate, endDate) } />
      </SafeAreaView>
    );
  }
}

export default App;
