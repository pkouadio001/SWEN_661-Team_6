import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:careconnect/state/notifications_controller.dart';

void main() {
  group('PushSettings (unit)', () {
    test('demo has all toggles enabled', () {
      const s = PushSettings.demo;

      expect(s.master, isTrue);
      expect(s.meds, isTrue);
      expect(s.appts, isTrue);
      expect(s.tasks, isTrue);
      expect(s.health, isTrue);
      expect(s.caregiverMsgs, isTrue);
      expect(s.sound, isTrue);
    });

    test('copyWith changes only provided fields', () {
      const s = PushSettings.demo;

      final updated = s.copyWith(meds: false, sound: false);

      expect(updated.master, isTrue);
      expect(updated.meds, isFalse);
      expect(updated.appts, isTrue);
      expect(updated.tasks, isTrue);
      expect(updated.health, isTrue);
      expect(updated.caregiverMsgs, isTrue);
      expect(updated.sound, isFalse);
    });
  });

  group('PushSettingsController (unit)', () {
    test('provider starts with demo settings', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final state = container.read(pushSettingsProvider);

      expect(state, isA<PushSettings>());
      expect(state.master, isTrue);
      expect(state.meds, isTrue);
      expect(state.sound, isTrue);
    });

    test('toggleMaster updates master only', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final controller = container.read(pushSettingsProvider.notifier);

      controller.toggleMaster(false);
      final state = container.read(pushSettingsProvider);

      expect(state.master, isFalse);

      // others unchanged
      expect(state.meds, isTrue);
      expect(state.appts, isTrue);
      expect(state.tasks, isTrue);
      expect(state.health, isTrue);
      expect(state.caregiverMsgs, isTrue);
      expect(state.sound, isTrue);
    });

    test('toggleMeds updates meds only', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final controller = container.read(pushSettingsProvider.notifier);

      controller.toggleMeds(false);
      final state = container.read(pushSettingsProvider);

      expect(state.meds, isFalse);
      expect(state.master, isTrue);
      expect(state.sound, isTrue);
    });

    test('toggleAppts updates appts only', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final controller = container.read(pushSettingsProvider.notifier);

      controller.toggleAppts(false);
      final state = container.read(pushSettingsProvider);

      expect(state.appts, isFalse);
      expect(state.master, isTrue);
      expect(state.meds, isTrue);
    });

    test('toggleTasks updates tasks only', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final controller = container.read(pushSettingsProvider.notifier);

      controller.toggleTasks(false);
      final state = container.read(pushSettingsProvider);

      expect(state.tasks, isFalse);
      expect(state.master, isTrue);
    });

    test('toggleHealth updates health only', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final controller = container.read(pushSettingsProvider.notifier);

      controller.toggleHealth(false);
      final state = container.read(pushSettingsProvider);

      expect(state.health, isFalse);
      expect(state.master, isTrue);
    });

    test('toggleMsgs updates caregiverMsgs only', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final controller = container.read(pushSettingsProvider.notifier);

      controller.toggleMsgs(false);
      final state = container.read(pushSettingsProvider);

      expect(state.caregiverMsgs, isFalse);
      expect(state.master, isTrue);
    });

    test('toggleSound updates sound only', () {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final controller = container.read(pushSettingsProvider.notifier);

      controller.toggleSound(false);
      final state = container.read(pushSettingsProvider);

      expect(state.sound, isFalse);
      expect(state.master, isTrue);
    });
  });
}
