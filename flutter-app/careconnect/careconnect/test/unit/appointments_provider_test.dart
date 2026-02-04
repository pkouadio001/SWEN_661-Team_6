import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:careconnect/state/appointments_controller.dart';
import 'package:careconnect/models/appointment.dart';

void main() {
  group('appointmentsProvider (unit)', () {
    test('returns 5 appointments with expected ids and titles', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final appts = container.read(appointmentsProvider);

      expect(appts, isA<List<AppointmentItem>>());
      expect(appts.length, 5);

      expect(appts[0].id, 'a1');
      expect(appts[0].title, 'Dr. Smith - Cardiology');

      expect(appts[1].id, 'a2');
      expect(appts[1].title, 'Dr. Johnson - General Checkup');

      expect(appts[2].id, 'a3');
      expect(appts[2].title, 'Physical Therapist');

      expect(appts[3].id, 'a4');
      expect(appts[3].title, 'Lab Work');

      expect(appts[4].id, 'a5');
      expect(appts[4].title, 'Dental Checkup');
    });

    test('all appointment dates are in the future', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final now = DateTime.now();
      final appts = container.read(appointmentsProvider);

      for (final a in appts) {
        expect(
          a.dateTime.isAfter(now),
          isTrue,
          reason: 'Appointment ${a.id} should be in the future',
        );
      }
    });
  });
}
