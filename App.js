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

let calendarID = "";
let calendarTitle = "";
let calendarType = "";
let calendarSource = "";
let calendarAllowsModification = false;
let primaryCalendarFound = false;
let selectedCalendar;

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  addToCalendar() {
    RNCalendarEvents.checkPermissions((readOnly = false))
      .then( (result) => {
        switch (result) {
          case "undetermined":
            RNCalendarEvents.requestPermissions((readOnly = false))
              .then( (result) => {
                if (result === "authorized") {
                  RNCalendarEvents.findCalendars()
                    .then( (result) => {
                      const calendars = result;
                      calendars.forEach( (calendar) => {
                        if (calendar.isPrimary) {
                          calendarID = calendar.id;
                          calendarTitle = calendar.title;
                          calendarType = calendar.type;
                          calendarSource = calendar.source;
                          calendarAllowsModification = calendar.allowsModifications;
                          primaryCalendarFound = true;
                          selectedCalendar = calendar;
                          return;
                        }
                      });
                      if (primaryCalendarFound) {
                        const eventTitle = "ReactNative Calendar Tech Talk";
                        const startDate = "2021-01-10T13:15:00.000Z";
                        const endDate = "2021-01-10T13:45:00.000Z";
                        const calendarId = selectedCalendar.id;
                        const eventDetails = { startDate, endDate, calendarId};
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
                } else {
                  alert("UNABLE TO ADD EVENT TO CALENDAR: CALENDAR ACCESS DENIED");
                }
              })
              .catch((error) => {
                alert(JSON.stringify(error));
              });
            break;
          case "authorized":
            RNCalendarEvents.findCalendars()
            .then( (result) => {
              const calendars = result;
              calendars.forEach( (calendar) => {
                if (calendar.isPrimary) {
                  calendarID = calendar.id;
                  calendarTitle = calendar.title;
                  calendarType = calendar.type;
                  calendarSource = calendar.source;
                  calendarAllowsModification = calendar.allowsModifications;
                  primaryCalendarFound = true;
                  selectedCalendar = calendar;
                  return;
                }
              });
              if (primaryCalendarFound) {
                const eventTitle = "ReactNative Calendar Tech Talk";
                const startDate = "2021-01-10T13:15:00.000Z";
                const endDate = "2021-01-10T13:45:00.000Z";
                const calendarId = selectedCalendar.id;
                const eventDetails = { startDate, endDate, calendarId};
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
            break;
          case "restricted":
            alert("RESULT: RESTRICTED");
            break;
          case "denied":
            alert("RESULT: DENIED");
            break;
          default:
            alert("RESULT: UNKNOWN");
        }
      })
      .catch( (error) => {
        alert(JSON.stringify(error));
      });
  }

  render() {
    return(
      <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>RNCalendarApp</Text>
        <Button 
          title="Add to Calendar"
          onPress={ () => this.addToCalendar() } />
      </SafeAreaView>
    );
  }
}

export default App;
