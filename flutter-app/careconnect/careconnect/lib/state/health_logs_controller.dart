import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/health_log.dart';

final healthLogsProvider = Provider<List<HealthLogItem>>((ref) {
  final now = DateTime.now();
  return [
    HealthLogItem(
      id: 'h1',
      label: 'Blood Pressure',
      value: '120/80',
      dateTime: now,
    ),
    HealthLogItem(
      id: 'h2',
      label: 'Heart Rate',
      value: '72 bpm',
      dateTime: now,
    ),
    HealthLogItem(
      id: 'h3',
      label: 'Blood Pressure',
      value: '118/78',
      dateTime: now.subtract(const Duration(days: 1)),
    ),
    HealthLogItem(
      id: 'h4',
      label: 'Temperature',
      value: '98.6°F',
      dateTime: now.subtract(const Duration(days: 1)),
    ),
    HealthLogItem(
      id: 'h5',
      label: 'Blood Sugar',
      value: '105 mg/dL',
      dateTime: now.subtract(const Duration(days: 1)),
    ),
  ];
});
