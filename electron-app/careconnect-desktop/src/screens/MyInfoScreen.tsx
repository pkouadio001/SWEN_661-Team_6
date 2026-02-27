import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

type PersonalInfo = {
  firstName: string;
  lastName: string;
  dob: string; // MM/DD/YYYY
  phone: string;
  email: string;
};

type AddressInfo = {
  street: string;
  city: string;
  state: string;
  zip: string;
};

type MedicalInfo = {
  primaryDoctor: string;
  doctorPhone: string;
  preferredHospital: string;
  bloodType: string;
  insuranceProvider: string;
  insuranceId: string;
  allergies: string;
  currentMedications: string;
  medicalConditions: string;
};

type Profile = {
  personal: PersonalInfo;
  address: AddressInfo;
  medical: MedicalInfo;
};

const STORAGE_KEY = "careconnect.profile";

const defaultProfile: Profile = {
  personal: {
    firstName: "Robert",
    lastName: "Johnson",
    dob: "04/15/1955",
    phone: "(555) 234-5678",
    email: "robert.johnson@email.com"
  },
  address: {
    street: "456 Oak Avenue",
    city: "San Francisco",
    state: "CA",
    zip: "94105"
  },
  medical: {
    primaryDoctor: "Dr. Sarah Mitchell",
    doctorPhone: "(555) 987-6543",
    preferredHospital: "San Francisco General Hospital",
    bloodType: "O+",
    insuranceProvider: "Blue Cross Blue Shield",
    insuranceId: "BCBS987654321",
    allergies: "Penicillin, Shellfish",
    currentMedications:
      "Carbidopa-Levodopa 25–100mg (3 times daily)\nAmantadine 100mg (twice daily)\nRasagiline 1mg (once daily)",
    medicalConditions:
      "Parkinson’s Disease (diagnosed 2018)\nHypertension\nMild Osteoarthritis"
  }
};

function readProfile(): Profile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProfile;
    const parsed = JSON.parse(raw) as Profile;
    return parsed;
  } catch {
    return defaultProfile;
  }
}

function writeProfile(p: Profile) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function Field({
  label,
  value,
  editable,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  editable: boolean;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="field">
      <div className="fieldLabel">{label}</div>
      {editable ? (
        <input
          className="input"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
        />
      ) : (
        <div className="readonly">{value}</div>
      )}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  editable,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  editable: boolean;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="field">
      <div className="fieldLabel">{label}</div>
      {editable ? (
        <textarea
          className="textarea"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange?.(e.target.value)}
          rows={4}
        />
      ) : (
        <div className="readonly pre">{value}</div>
      )}
    </div>
  );
}

export default function MyInfoScreen() {
  const nav = useNavigate();

  // persisted profile
  const [profile, setProfile] = useState<Profile>(() => readProfile());

  // section edit mode
  const [editPersonal, setEditPersonal] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [editMedical, setEditMedical] = useState(false);

  // section draft copies (for cancel)
  const [draftPersonal, setDraftPersonal] = useState<PersonalInfo>(profile.personal);
  const [draftAddress, setDraftAddress] = useState<AddressInfo>(profile.address);
  const [draftMedical, setDraftMedical] = useState<MedicalInfo>(profile.medical);

  // keep drafts in sync when profile changes (e.g. after save)
  useMemo(() => {
    setDraftPersonal(profile.personal);
    setDraftAddress(profile.address);
    setDraftMedical(profile.medical);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  function savePersonal() {
    const next: Profile = { ...profile, personal: draftPersonal };
    setProfile(next);
    writeProfile(next);
    setEditPersonal(false);
  }
  function cancelPersonal() {
    setDraftPersonal(profile.personal);
    setEditPersonal(false);
  }

  function saveAddress() {
    const next: Profile = { ...profile, address: draftAddress };
    setProfile(next);
    writeProfile(next);
    setEditAddress(false);
  }
  function cancelAddress() {
    setDraftAddress(profile.address);
    setEditAddress(false);
  }

  function saveMedical() {
    const next: Profile = { ...profile, medical: draftMedical };
    setProfile(next);
    writeProfile(next);
    setEditMedical(false);
  }
  function cancelMedical() {
    setDraftMedical(profile.medical);
    setEditMedical(false);
  }

  return (
    <div className="shell">
      <Sidebar />
      <div className="main">
        <TopBar onLogout={() => nav("/login")} onQuit={() => window.careconnect.quitApp()} />

        <div className="content">
          <div className="pageTitle">User Information</div>
          <div className="pageSub">Manage your personal and medical information</div>

          {/* PERSONAL */}
          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panelHeaderRow">
              <div className="panelHeaderLeft">
                <div className="panelIcon blue">👤</div>
                <div>
                  <div className="panelTitle">Personal Information</div>
                  <div className="panelSub">Your basic contact details</div>
                </div>
              </div>

              <div className="panelActions">
                {editPersonal ? (
                  <>
                    <button className="btn outline" onClick={cancelPersonal}>
                      Cancel
                    </button>
                    <button className="btn" onClick={savePersonal}>
                      💾 Save
                    </button>
                  </>
                ) : (
                  <button className="btn" onClick={() => setEditPersonal(true)}>
                    ✏ Edit
                  </button>
                )}
              </div>
            </div>

            <div className="formGrid2">
              <Field
                label="First Name"
                value={editPersonal ? draftPersonal.firstName : profile.personal.firstName}
                editable={editPersonal}
                onChange={(v) => setDraftPersonal((p) => ({ ...p, firstName: v }))}
              />
              <Field
                label="Last Name"
                value={editPersonal ? draftPersonal.lastName : profile.personal.lastName}
                editable={editPersonal}
                onChange={(v) => setDraftPersonal((p) => ({ ...p, lastName: v }))}
              />
              <Field
                label="Date of Birth"
                value={editPersonal ? draftPersonal.dob : profile.personal.dob}
                editable={editPersonal}
                onChange={(v) => setDraftPersonal((p) => ({ ...p, dob: v }))}
                placeholder="MM/DD/YYYY"
              />
              <Field
                label="Phone Number"
                value={editPersonal ? draftPersonal.phone : profile.personal.phone}
                editable={editPersonal}
                onChange={(v) => setDraftPersonal((p) => ({ ...p, phone: v }))}
              />
              <div className="span2">
                <Field
                  label="Email Address"
                  value={editPersonal ? draftPersonal.email : profile.personal.email}
                  editable={editPersonal}
                  onChange={(v) => setDraftPersonal((p) => ({ ...p, email: v }))}
                />
              </div>
            </div>
          </div>

          {/* ADDRESS */}
          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panelHeaderRow">
              <div className="panelHeaderLeft">
                <div className="panelIcon green">📍</div>
                <div>
                  <div className="panelTitle">Home Address</div>
                  <div className="panelSub">Your residential address</div>
                </div>
              </div>

              <div className="panelActions">
                {editAddress ? (
                  <>
                    <button className="btn outline" onClick={cancelAddress}>
                      Cancel
                    </button>
                    <button className="btn" onClick={saveAddress}>
                      💾 Save
                    </button>
                  </>
                ) : (
                  <button className="btn" onClick={() => setEditAddress(true)}>
                    ✏ Edit
                  </button>
                )}
              </div>
            </div>

            <div className="formGrid3">
              <div className="span3">
                <Field
                  label="Street Address"
                  value={editAddress ? draftAddress.street : profile.address.street}
                  editable={editAddress}
                  onChange={(v) => setDraftAddress((a) => ({ ...a, street: v }))}
                />
              </div>
              <Field
                label="City"
                value={editAddress ? draftAddress.city : profile.address.city}
                editable={editAddress}
                onChange={(v) => setDraftAddress((a) => ({ ...a, city: v }))}
              />
              <Field
                label="State"
                value={editAddress ? draftAddress.state : profile.address.state}
                editable={editAddress}
                onChange={(v) => setDraftAddress((a) => ({ ...a, state: v }))}
              />
              <Field
                label="ZIP Code"
                value={editAddress ? draftAddress.zip : profile.address.zip}
                editable={editAddress}
                onChange={(v) => setDraftAddress((a) => ({ ...a, zip: v }))}
              />
            </div>
          </div>

          {/* MEDICAL */}
          <div className="panel" style={{ marginTop: 14 }}>
            <div className="panelHeaderRow">
              <div className="panelHeaderLeft">
                <div className="panelIcon purple">🩺</div>
                <div>
                  <div className="panelTitle">Medical Information</div>
                  <div className="panelSub">Healthcare provider and insurance details</div>
                </div>
              </div>

              <div className="panelActions">
                {editMedical ? (
                  <>
                    <button className="btn outline" onClick={cancelMedical}>
                      Cancel
                    </button>
                    <button className="btn" onClick={saveMedical}>
                      💾 Save
                    </button>
                  </>
                ) : (
                  <button className="btn" onClick={() => setEditMedical(true)}>
                    ✏ Edit
                  </button>
                )}
              </div>
            </div>

            <div className="formGrid2">
              <Field
                label="Primary Doctor"
                value={editMedical ? draftMedical.primaryDoctor : profile.medical.primaryDoctor}
                editable={editMedical}
                onChange={(v) => setDraftMedical((m) => ({ ...m, primaryDoctor: v }))}
              />
              <Field
                label="Doctor's Phone"
                value={editMedical ? draftMedical.doctorPhone : profile.medical.doctorPhone}
                editable={editMedical}
                onChange={(v) => setDraftMedical((m) => ({ ...m, doctorPhone: v }))}
              />
              <Field
                label="Preferred Hospital"
                value={
                  editMedical ? draftMedical.preferredHospital : profile.medical.preferredHospital
                }
                editable={editMedical}
                onChange={(v) => setDraftMedical((m) => ({ ...m, preferredHospital: v }))}
              />
              <Field
                label="Blood Type"
                value={editMedical ? draftMedical.bloodType : profile.medical.bloodType}
                editable={editMedical}
                onChange={(v) => setDraftMedical((m) => ({ ...m, bloodType: v }))}
              />
              <Field
                label="Insurance Provider"
                value={
                  editMedical ? draftMedical.insuranceProvider : profile.medical.insuranceProvider
                }
                editable={editMedical}
                onChange={(v) => setDraftMedical((m) => ({ ...m, insuranceProvider: v }))}
              />
              <Field
                label="Insurance ID"
                value={editMedical ? draftMedical.insuranceId : profile.medical.insuranceId}
                editable={editMedical}
                onChange={(v) => setDraftMedical((m) => ({ ...m, insuranceId: v }))}
              />

              <div className="span2">
                <TextAreaField
                  label="Allergies"
                  value={editMedical ? draftMedical.allergies : profile.medical.allergies}
                  editable={editMedical}
                  onChange={(v) => setDraftMedical((m) => ({ ...m, allergies: v }))}
                  placeholder="List allergies separated by commas..."
                />
              </div>

              <div className="span2">
                <TextAreaField
                  label="Current Medications"
                  value={
                    editMedical ? draftMedical.currentMedications : profile.medical.currentMedications
                  }
                  editable={editMedical}
                  onChange={(v) => setDraftMedical((m) => ({ ...m, currentMedications: v }))}
                  placeholder="One per line..."
                />
              </div>

              <div className="span2">
                <TextAreaField
                  label="Medical Conditions"
                  value={
                    editMedical ? draftMedical.medicalConditions : profile.medical.medicalConditions
                  }
                  editable={editMedical}
                  onChange={(v) => setDraftMedical((m) => ({ ...m, medicalConditions: v }))}
                  placeholder="One per line..."
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}