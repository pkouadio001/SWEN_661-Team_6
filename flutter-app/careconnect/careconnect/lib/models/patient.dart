class PatientInfo {
  final String fullName;
  final String dobText;
  final String email;
  final String address;

  final String physician;
  final String specialty;
  final String conditions;
  final String meds;
  final String allergies;

  final String emergencyName;
  final String emergencyPhone;

  const PatientInfo({
    required this.fullName,
    required this.dobText,
    required this.email,
    required this.address,
    required this.physician,
    required this.specialty,
    required this.conditions,
    required this.meds,
    required this.allergies,
    required this.emergencyName,
    required this.emergencyPhone,
  });

  PatientInfo copyWith({
    String? fullName,
    String? dobText,
    String? email,
    String? address,
    String? physician,
    String? specialty,
    String? conditions,
    String? meds,
    String? allergies,
    String? emergencyName,
    String? emergencyPhone,
  }) {
    return PatientInfo(
      fullName: fullName ?? this.fullName,
      dobText: dobText ?? this.dobText,
      email: email ?? this.email,
      address: address ?? this.address,
      physician: physician ?? this.physician,
      specialty: specialty ?? this.specialty,
      conditions: conditions ?? this.conditions,
      meds: meds ?? this.meds,
      allergies: allergies ?? this.allergies,
      emergencyName: emergencyName ?? this.emergencyName,
      emergencyPhone: emergencyPhone ?? this.emergencyPhone,
    );
  }

  static const demo = PatientInfo(
    fullName: 'John Doe',
    dobText: 'March 15, 1958 (67 years old)',
    email: 'Jdoe@hotmail.com',
    address: '123 Oak Street, Springfield, IL 62701',
    physician: 'Dr. Sarah Smith',
    specialty: 'Cardiology Specialist',
    conditions: 'Hypertension, Type 2 Diabetes',
    meds: 'Lisinopril, Metformin',
    allergies: 'Penicillin, Sulfa drugs',
    emergencyName: 'Jane Doe (Daughter)',
    emergencyPhone: '(555) 123-4567',
  );
}
