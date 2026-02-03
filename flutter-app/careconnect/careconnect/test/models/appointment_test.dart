import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/models/appointment.dart';

void main() {
  group('AppointmentItem', () {
    final testDateTime = DateTime(2024, 1, 15, 10, 30);

    test('creates instance with required fields', () {
      final appointment = AppointmentItem(
        id: 'a1',
        title: 'Doctor Appointment',
        dateTime: testDateTime,
      );

      expect(appointment.id, 'a1');
      expect(appointment.title, 'Doctor Appointment');
      expect(appointment.dateTime, testDateTime);
    });

    test('creates multiple appointments with different ids', () {
      final appointment1 = AppointmentItem(
        id: 'a1',
        title: 'Checkup',
        dateTime: testDateTime,
      );

      final appointment2 = AppointmentItem(
        id: 'a2',
        title: 'Follow-up',
        dateTime: testDateTime.add(const Duration(days: 7)),
      );

      expect(appointment1.id, isNot(equals(appointment2.id)));
      expect(appointment1.title, isNot(equals(appointment2.title)));
    });
  });
}
