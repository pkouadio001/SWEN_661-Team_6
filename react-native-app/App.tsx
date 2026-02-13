<<<<<<< HEAD
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { EmergencyContactProvider } from "./context/EmergencyContactContext";
import { HealthLogsProvider } from "./context/HealthLogsContext";
import { MessagesProvider } from "./context/MessagesContext";
import { ScheduledAppointmentsProvider } from "./context/ScheduledAppointmentsContext";
import { TasksProvider } from "./context/TasksContext.tsx";
import { ThemeProvider } from "./context/ThemeContext";

// Screens (same ones you used in web)
import AddTask from "./pages/AddTask";
import Alerts from "./pages/Alerts";
import Communication from "./pages/Communication";
import Dashboard from "./pages/Dashboard";
import EmergencySOS from "./pages/EmergencySOS";
import ForgotPin from "./pages/ForgotPin";
import ForgotUsername from "./pages/ForgotUsername";
import Health from "./pages/Health";
import HealthLogs from "./pages/HealthLogs";
import History from "./pages/History";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import NotificationSettings from "./pages/NotificationSettings";
import PatientInfo from "./pages/PatientInfo";
import PersonalNotes from "./pages/PersonalNotes";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import TodayTasks from "./pages/TodayTasks";
import UpcomingAppointments from "./pages/UpcomingAppointments";

const queryClient = new QueryClient();

export type RootStackParamList = {
  Index: undefined;
  Dashboard: undefined;
  Tasks: undefined;
  TodayTasks: undefined;
  AddTask: undefined;
  Health: undefined;
  HealthLogs: undefined;
  PersonalNotes: undefined;
  History: undefined;
  Communication: undefined;
  Messages: undefined;
  EmergencySOS: undefined;
  Alerts: undefined;
  NotificationSettings: undefined;
  PatientInfo: undefined;
  Profile: undefined;
  UpcomingAppointments: undefined;
  ForgotUsername: undefined;
  ForgotPin: undefined;
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <EmergencyContactProvider>
          <MessagesProvider>
            <ScheduledAppointmentsProvider>
              <TasksProvider>
                <HealthLogsProvider>
                  <NavigationContainer>
                    <Stack.Navigator
                      initialRouteName="Index"
                      screenOptions={{
                        headerShown: false, // your screens already render their own headers
                      }}
                    >
                      <Stack.Screen name="Index" component={Index} />
                      <Stack.Screen name="Dashboard" component={Dashboard} />
                      <Stack.Screen name="Tasks" component={Tasks} />
                      <Stack.Screen name="TodayTasks" component={TodayTasks} />
                      <Stack.Screen name="AddTask" component={AddTask} />
                      <Stack.Screen name="Health" component={Health} />
                      <Stack.Screen name="HealthLogs" component={HealthLogs} />
                      <Stack.Screen name="PersonalNotes" component={PersonalNotes} />
                      <Stack.Screen name="History" component={History} />
                      <Stack.Screen name="Communication" component={Communication} />
                      <Stack.Screen name="Messages" component={Messages} />
                      <Stack.Screen name="EmergencySOS" component={EmergencySOS} />
                      <Stack.Screen name="Alerts" component={Alerts} />
                      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
                      <Stack.Screen name="PatientInfo" component={PatientInfo} />
                      <Stack.Screen name="Profile" component={Profile} />
                      <Stack.Screen name="UpcomingAppointments" component={UpcomingAppointments} />
                      <Stack.Screen name="ForgotUsername" component={ForgotUsername} />
                      <Stack.Screen name="ForgotPin" component={ForgotPin} />
                      <Stack.Screen name="NotFound" component={NotFound} />
                    </Stack.Navigator>
                  </NavigationContainer>
                </HealthLogsProvider>
              </TasksProvider>
            </ScheduledAppointmentsProvider>
          </MessagesProvider>
        </EmergencyContactProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
=======
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { EmergencyContactProvider } from "./context/EmergencyContactContext";
import { HealthLogsProvider } from "./context/HealthLogsContext";
import { MessagesProvider } from "./context/MessagesContext";
import { ScheduledAppointmentsProvider } from "./context/ScheduledAppointmentsContext";
import { TasksProvider } from "./context/TasksContext.tsx";
import { ThemeProvider } from "./context/ThemeContext";

// Screens (same ones you used in web)
import AddTask from "./pages/AddTask";
import Alerts from "./pages/Alerts";
import Communication from "./pages/Communication";
import Dashboard from "./pages/Dashboard";
import EmergencySOS from "./pages/EmergencySOS";
import ForgotPin from "./pages/ForgotPin";
import ForgotUsername from "./pages/ForgotUsername";
import Health from "./pages/Health";
import HealthLogs from "./pages/HealthLogs";
import History from "./pages/History";
import Index from "./pages/Index";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";
import NotificationSettings from "./pages/NotificationSettings";
import PatientInfo from "./pages/PatientInfo";
import PersonalNotes from "./pages/PersonalNotes";
import Profile from "./pages/Profile";
import Tasks from "./pages/Tasks";
import TodayTasks from "./pages/TodayTasks";
import UpcomingAppointments from "./pages/UpcomingAppointments";

const queryClient = new QueryClient();

export type RootStackParamList = {
  Index: undefined;
  Dashboard: undefined;
  Tasks: undefined;
  TodayTasks: undefined;
  AddTask: undefined;
  Health: undefined;
  HealthLogs: undefined;
  PersonalNotes: undefined;
  History: undefined;
  Communication: undefined;
  Messages: undefined;
  EmergencySOS: undefined;
  Alerts: undefined;
  NotificationSettings: undefined;
  PatientInfo: undefined;
  Profile: undefined;
  UpcomingAppointments: undefined;
  ForgotUsername: undefined;
  ForgotPin: undefined;
  NotFound: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <EmergencyContactProvider>
          <MessagesProvider>
            <ScheduledAppointmentsProvider>
              <TasksProvider>
                <HealthLogsProvider>
                  <NavigationContainer>
                    <Stack.Navigator
                      initialRouteName="Index"
                      screenOptions={{
                        headerShown: false, // your screens already render their own headers
                      }}
                    >
                      <Stack.Screen name="Index" component={Index} />
                      <Stack.Screen name="Dashboard" component={Dashboard} />
                      <Stack.Screen name="Tasks" component={Tasks} />
                      <Stack.Screen name="TodayTasks" component={TodayTasks} />
                      <Stack.Screen name="AddTask" component={AddTask} />
                      <Stack.Screen name="Health" component={Health} />
                      <Stack.Screen name="HealthLogs" component={HealthLogs} />
                      <Stack.Screen name="PersonalNotes" component={PersonalNotes} />
                      <Stack.Screen name="History" component={History} />
                      <Stack.Screen name="Communication" component={Communication} />
                      <Stack.Screen name="Messages" component={Messages} />
                      <Stack.Screen name="EmergencySOS" component={EmergencySOS} />
                      <Stack.Screen name="Alerts" component={Alerts} />
                      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
                      <Stack.Screen name="PatientInfo" component={PatientInfo} />
                      <Stack.Screen name="Profile" component={Profile} />
                      <Stack.Screen name="UpcomingAppointments" component={UpcomingAppointments} />
                      <Stack.Screen name="ForgotUsername" component={ForgotUsername} />
                      <Stack.Screen name="ForgotPin" component={ForgotPin} />
                      <Stack.Screen name="NotFound" component={NotFound} />
                    </Stack.Navigator>
                  </NavigationContainer>
                </HealthLogsProvider>
              </TasksProvider>
            </ScheduledAppointmentsProvider>
          </MessagesProvider>
        </EmergencyContactProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
>>>>>>> 1722beedcbea5d623ae0fa6ae695986d1e8eff9c
