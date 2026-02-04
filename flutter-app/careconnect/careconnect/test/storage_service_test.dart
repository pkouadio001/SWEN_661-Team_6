import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/services/storage_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  group('StorageService', () {
    late StorageService service;

    setUp(() {
      service = StorageService();
    });

    tearDown(() async {
      // Clean up shared preferences after each test
      final prefs = await SharedPreferences.getInstance();
      await prefs.clear();
    });

    group('High Contrast', () {
      test('getHighContrast returns false by default', () async {
        SharedPreferences.setMockInitialValues({});

        final result = await service.getHighContrast();

        expect(result, false);
      });

      test('setHighContrast stores value', () async {
        SharedPreferences.setMockInitialValues({});

        await service.setHighContrast(true);
        final result = await service.getHighContrast();

        expect(result, true);
      });

      test('setHighContrast can toggle value', () async {
        SharedPreferences.setMockInitialValues({});

        await service.setHighContrast(true);
        expect(await service.getHighContrast(), true);

        await service.setHighContrast(false);
        expect(await service.getHighContrast(), false);
      });

      test('getHighContrast retrieves persisted value', () async {
        SharedPreferences.setMockInitialValues({'high_contrast': true});

        final result = await service.getHighContrast();

        expect(result, true);
      });
    });

    group('Push Notifications', () {
      test('getPushEnabled returns true by default', () async {
        SharedPreferences.setMockInitialValues({});

        final result = await service.getPushEnabled();

        expect(result, true);
      });

      test('setPushEnabled stores value', () async {
        SharedPreferences.setMockInitialValues({});

        await service.setPushEnabled(false);
        final result = await service.getPushEnabled();

        expect(result, false);
      });

      test('setPushEnabled can toggle value', () async {
        SharedPreferences.setMockInitialValues({});

        await service.setPushEnabled(false);
        expect(await service.getPushEnabled(), false);

        await service.setPushEnabled(true);
        expect(await service.getPushEnabled(), true);
      });

      test('getPushEnabled retrieves persisted value', () async {
        SharedPreferences.setMockInitialValues({'push_enabled': false});

        final result = await service.getPushEnabled();

        expect(result, false);
      });
    });

    group('Multiple Settings', () {
      test('both settings can be stored independently', () async {
        SharedPreferences.setMockInitialValues({});

        await service.setHighContrast(true);
        await service.setPushEnabled(false);

        expect(await service.getHighContrast(), true);
        expect(await service.getPushEnabled(), false);
      });

      test('changing one setting does not affect the other', () async {
        SharedPreferences.setMockInitialValues({});

        await service.setHighContrast(true);
        await service.setPushEnabled(false);

        await service.setHighContrast(false);

        expect(await service.getHighContrast(), false);
        expect(await service.getPushEnabled(), false);
      });
    });
  });
}
