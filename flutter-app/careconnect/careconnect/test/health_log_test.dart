import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/models/health_log.dart';

void main() {
  group('HealthLogItem', () {
    final testDateTime = DateTime(2024, 1, 15, 10, 30);

    test('creates instance with required fields', () {
      final healthLog = HealthLogItem(
        id: 'h1',
        label: 'Blood Pressure',
        value: '120/80',
        dateTime: testDateTime,
      );

      expect(healthLog.id, 'h1');
      expect(healthLog.label, 'Blood Pressure');
      expect(healthLog.value, '120/80');
      expect(healthLog.dateTime, testDateTime);
    });

    test('creates health log with numeric value', () {
      final healthLog = HealthLogItem(
        id: 'h2',
        label: 'Weight',
        value: '150 lbs',
        dateTime: testDateTime,
      );

      expect(healthLog.label, 'Weight');
      expect(healthLog.value, '150 lbs');
    });

    test('creates health log with various measurements', () {
      final logs = [
        HealthLogItem(
          id: 'h1',
          label: 'Temperature',
          value: '98.6°F',
          dateTime: testDateTime,
        ),
        HealthLogItem(
          id: 'h2',
          label: 'Heart Rate',
          value: '72 bpm',
          dateTime: testDateTime,
        ),
        HealthLogItem(
          id: 'h3',
          label: 'Glucose',
          value: '95 mg/dL',
          dateTime: testDateTime,
        ),
      ];

      expect(logs.length, 3);
      expect(logs[0].label, 'Temperature');
      expect(logs[1].label, 'Heart Rate');
      expect(logs[2].label, 'Glucose');
    });
  });
}
