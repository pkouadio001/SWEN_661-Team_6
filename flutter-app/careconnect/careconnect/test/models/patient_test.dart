import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/models/patient.dart';

void main() {
  group('PatientInfo', () {
    test('creates instance with required fields', () {
      const patient = PatientInfo(
        fullName: 'John Doe',
        dobText: 'January 1, 1980',
        email: 'john@example.com',
        address: '123 Main St',
        physician: 'Dr. Smith',
        specialty: 'Cardiology',
        conditions: 'Hypertension',
        meds: 'Lisinopril',
        allergies: 'Penicillin',
        emergencyName: 'Jane Doe',
        emergencyPhone: '555-1234',
      );

      expect(patient.fullName, 'John Doe');
      expect(patient.dobText, 'January 1, 1980');
      expect(patient.email, 'john@example.com');
      expect(patient.address, '123 Main St');
      expect(patient.physician, 'Dr. Smith');
      expect(patient.specialty, 'Cardiology');
      expect(patient.conditions, 'Hypertension');
      expect(patient.meds, 'Lisinopril');
      expect(patient.allergies, 'Penicillin');
      expect(patient.emergencyName, 'Jane Doe');
      expect(patient.emergencyPhone, '555-1234');
    });

    test('copyWith updates personal info fields', () {
      const original = PatientInfo(
        fullName: 'John Doe',
        dobText: 'January 1, 1980',
        email: 'john@example.com',
        address: '123 Main St',
        physician: 'Dr. Smith',
        specialty: 'Cardiology',
        conditions: 'Hypertension',
        meds: 'Lisinopril',
        allergies: 'Penicillin',
        emergencyName: 'Jane Doe',
        emergencyPhone: '555-1234',
      );

      final updated = original.copyWith(
        fullName: 'Jane Doe',
        email: 'jane@example.com',
      );

      expect(updated.fullName, 'Jane Doe');
      expect(updated.email, 'jane@example.com');
      expect(updated.dobText, original.dobText);
      expect(updated.address, original.address);
    });

    test('copyWith updates medical info fields', () {
      const original = PatientInfo(
        fullName: 'John Doe',
        dobText: 'January 1, 1980',
        email: 'john@example.com',
        address: '123 Main St',
        physician: 'Dr. Smith',
        specialty: 'Cardiology',
        conditions: 'Hypertension',
        meds: 'Lisinopril',
        allergies: 'Penicillin',
        emergencyName: 'Jane Doe',
        emergencyPhone: '555-1234',
      );

      final updated = original.copyWith(
        physician: 'Dr. Jones',
        conditions: 'Diabetes',
        meds: 'Metformin',
      );

      expect(updated.physician, 'Dr. Jones');
      expect(updated.conditions, 'Diabetes');
      expect(updated.meds, 'Metformin');
      expect(updated.allergies, original.allergies);
    });

    test('copyWith updates emergency contact fields', () {
      const original = PatientInfo(
        fullName: 'John Doe',
        dobText: 'January 1, 1980',
        email: 'john@example.com',
        address: '123 Main St',
        physician: 'Dr. Smith',
        specialty: 'Cardiology',
        conditions: 'Hypertension',
        meds: 'Lisinopril',
        allergies: 'Penicillin',
        emergencyName: 'Jane Doe',
        emergencyPhone: '555-1234',
      );

      final updated = original.copyWith(
        emergencyName: 'Bob Smith',
        emergencyPhone: '555-5678',
      );

      expect(updated.emergencyName, 'Bob Smith');
      expect(updated.emergencyPhone, '555-5678');
      expect(updated.fullName, original.fullName);
    });

    test('demo constant has expected values', () {
      expect(PatientInfo.demo.fullName, 'John Doe');
      expect(PatientInfo.demo.dobText, 'March 15, 1958 (67 years old)');
      expect(PatientInfo.demo.email, 'Jdoe@hotmail.com');
      expect(PatientInfo.demo.address, '123 Oak Street, Springfield, IL 62701');
      expect(PatientInfo.demo.physician, 'Dr. Sarah Smith');
      expect(PatientInfo.demo.specialty, 'Cardiology Specialist');
      expect(PatientInfo.demo.conditions, 'Hypertension, Type 2 Diabetes');
      expect(PatientInfo.demo.meds, 'Lisinopril, Metformin');
      expect(PatientInfo.demo.allergies, 'Penicillin, Sulfa drugs');
      expect(PatientInfo.demo.emergencyName, 'Jane Doe (Daughter)');
      expect(PatientInfo.demo.emergencyPhone, '(555) 123-4567');
    });
  });
}
