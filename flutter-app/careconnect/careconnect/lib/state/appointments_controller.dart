import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/appointment.dart';

final appointmentsProvider = Provider<List<AppointmentItem>>((ref) {
  final now = DateTime.now();
  return [
    AppointmentItem(id: 'a1', title: 'Dr. Smith - Cardiology', dateTime: now.add(const Duration(days: 3, hours: 10))),
    AppointmentItem(id: 'a2', title: 'Dr. Johnson - General Checkup', dateTime: now.add(const Duration(days: 11, hours: 14))),
    AppointmentItem(id: 'a3', title: 'Physical Therapist', dateTime: now.add(const Duration(days: 2, hours: 15))),
    AppointmentItem(id: 'a4', title: 'Lab Work', dateTime: now.add(const Duration(days: 4, hours: 8))),
    AppointmentItem(id: 'a5', title: 'Dental Checkup', dateTime: now.add(const Duration(days: 6, hours: 11))),
  ];
});
