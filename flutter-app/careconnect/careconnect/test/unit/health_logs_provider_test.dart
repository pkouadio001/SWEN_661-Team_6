import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:careconnect/state/health_logs_controller.dart';
import 'package:careconnect/models/health_log.dart';

void main() {
  group('healthLogsProvider (unit)', () {
    test('returns a list of 5 health log items', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final logs = container.read(healthLogsProvider);

      expect(logs, isA<List<HealthLogItem>>());
      expect(logs.length, 5);
    });

    test('health log items contain correct labels and values', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final logs = container.read(healthLogsProvider);

      expect(logs[0].label, 'Blood Pressure');
      expect(logs[0].value, '120/80');

      expect(logs[1].label, 'Heart Rate');
      expect(logs[1].value, '72 bpm');

      expect(logs[3].label, 'Temperature');
      expect(logs[3].value, '98.6°F');
    });

    test('health log dates are today or in the past', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final now = DateTime.now();
      final logs = container.read(healthLogsProvider);

      for (final log in logs) {
        expect(
          log.dateTime.isBefore(now.add(const Duration(seconds: 1))),
          isTrue,
          reason: 'Health log ${log.id} should not be in the future',
        );
      }
    });

    test('health log ids are unique', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final logs = container.read(healthLogsProvider);
      final ids = logs.map((e) => e.id).toSet();

      expect(ids.length, logs.length);
    });
  });
}
