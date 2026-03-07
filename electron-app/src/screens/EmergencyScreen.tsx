import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

export default function EmergencyScreen() {
  const navigate = useNavigate();

  const call = (number: string) => {
    window.open(`tel:${number.replace(/[^\d+]/g, "")}`);
  };

  const email = (address: string) => {
    window.open(`mailto:${address}`);
  };

  return (
    <div className="shell">
      <Sidebar />

      <div className="main">
        <TopBar
          onLogout={() => navigate("/login")}
          onQuit={() => window.careconnect.quitApp()}
        />

        <div className="content">
          <div className="pageTitle">Emergency Contacts</div>
          <div className="pageSub">Quick access to important contacts</div>

          {/* Emergency Panel */}
          <div className="panel emergencyPanel">
            <div className="emergencyHeader">
              <div className="emergencyIcon">☎</div>
              <div className="panelTitle red">Emergency Services</div>
            </div>

            <div className="emergencyButtons">
              <button
                className="btn btnDanger wide"
                onClick={() => call("911")}
              >
                ☎ Call Emergency Services - 911
              </button>

              <button
                className="btn btnDanger wide"
                onClick={() => call("1-800-222-1222")}
              >
                ☎ Call Poison Control - 1-800-222-1222
              </button>
            </div>
          </div>

          {/* Medical Professional */}
          <div className="sectionTitle">Medical Professionals</div>
          <div className="contactCard">
            <div className="contactInfo">
              <div className="contactName">Dr. Sarah Johnson</div>
              <div className="muted">Primary Neurologist</div>
              <div className="muted">📞 (555) 123-4567</div>
              <div className="muted">✉ dr.johnson@healthcare.com</div>
              <div className="muted">📍 123 Medical Center Drive</div>
            </div>
            <button
              className="btn btnDark"
              onClick={() => call("(555) 123-4567")}
            >
              ☎ Call
            </button>
          </div>

          {/* Family */}
          <div className="sectionTitle" style={{ marginTop: 20 }}>
            Family & Caregivers
          </div>

          {[
            {
              name: "Emily Peterson",
              role: "Primary Caregiver / Daughter",
              phone: "(555) 234-5678",
              email: "emily.peterson@email.com"
            },
            {
              name: "Michael Peterson",
              role: "Family Member / Son",
              phone: "(555) 345-6789",
              email: "michael.peterson@email.com"
            }
          ].map((person) => (
            <div className="contactCard" key={person.name}>
              <div className="contactInfo">
                <div className="contactName">{person.name}</div>
                <div className="muted">{person.role}</div>
                <div className="muted">📞 {person.phone}</div>
                <div className="muted">✉ {person.email}</div>
              </div>

              <div className="contactActions">
                <button
                  className="btn btnDark"
                  onClick={() => call(person.phone)}
                >
                  ☎ Call
                </button>
                <button
                  className="btn outline"
                  onClick={() => email(person.email)}
                >
                  ✉ Email
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}