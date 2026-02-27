import Router from "./router";
import { UiScaleProvider } from "../state/uiScale";

export default function App() {
  return  (<UiScaleProvider>   
             <Router />; 
            </UiScaleProvider>
          );
}