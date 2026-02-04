import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:careconnect/state/settings_controller.dart';
import 'package:careconnect/models/settings.dart';
import 'package:careconnect/services/storage_service.dart';

/// Fake StorageService for unit testing.
/// It records what was saved so we can assert side-effects.
class FakeStorageService implements StorageService {
  bool highContrastValue;
  bool pushEnabledValue;

  bool? lastSavedHighContrast;
  bool? lastSavedPushEnabled;

  FakeStorageService({
    required this.highContrastValue,
    required this.pushEnabledValue,
  });

  @override
  Future<bool> getHighContrast() async => highContrastValue;

  @override
  Future<bool> getPushEnabled() async => pushEnabledValue;

  @override
  Future<void> setHighContrast(bool v) async {
    lastSavedHighContrast = v;
    highContrastValue = v;
  }

  @override
  Future<void> setPushEnabled(bool v) async {
    lastSavedPushEnabled = v;
    pushEnabledValue = v;
  }
}

void main() {
  group('SettingsController (unit)', () {
    test('load() reads values from storage and updates state', () async {
      final fakeStorage = FakeStorageService(
        highContrastValue: true,
        pushEnabledValue: false,
      );

      final container = ProviderContainer(
        overrides: [storageProvider.overrideWithValue(fakeStorage)],
      );
      addTearDown(container.dispose);

      // Before load, controller starts at defaults
      final before = container.read(settingsProvider);
      expect(before, isA<Settings>());

      // Trigger load and wait
      await container.read(settingsProvider.notifier).load();

      final after = container.read(settingsProvider);
      expect(after.highContrast, true);
      expect(after.pushEnabled, false);
    });

    test('setHighContrast() updates state and persists to storage', () async {
      final fakeStorage = FakeStorageService(
        highContrastValue: false,
        pushEnabledValue: true,
      );

      final container = ProviderContainer(
        overrides: [storageProvider.overrideWithValue(fakeStorage)],
      );
      addTearDown(container.dispose);

      await container.read(settingsProvider.notifier).setHighContrast(true);

      final state = container.read(settingsProvider);
      expect(state.highContrast, true);
      expect(fakeStorage.lastSavedHighContrast, true);
    });

    test('setPushEnabled() updates state and persists to storage', () async {
      final fakeStorage = FakeStorageService(
        highContrastValue: false,
        pushEnabledValue: false,
      );

      final container = ProviderContainer(
        overrides: [storageProvider.overrideWithValue(fakeStorage)],
      );
      addTearDown(container.dispose);

      await container.read(settingsProvider.notifier).setPushEnabled(true);

      final state = container.read(settingsProvider);
      expect(state.pushEnabled, true);
      expect(fakeStorage.lastSavedPushEnabled, true);
    });
  });
}
