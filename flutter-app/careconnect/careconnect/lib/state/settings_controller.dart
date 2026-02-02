import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/settings.dart';
import '../services/storage_service.dart';

final storageProvider = Provider<StorageService>((_) => StorageService());

final settingsProvider = StateNotifierProvider<SettingsController, Settings>((
  ref,
) {
  return SettingsController(ref.read(storageProvider))..load();
});

class SettingsController extends StateNotifier<Settings> {
  final StorageService storage;

  SettingsController(this.storage) : super(Settings.defaults);

  Future<void> load() async {
    final hc = await storage.getHighContrast();
    final push = await storage.getPushEnabled();
    state = state.copyWith(highContrast: hc, pushEnabled: push);
  }

  Future<void> setHighContrast(bool v) async {
    state = state.copyWith(highContrast: v);
    await storage.setHighContrast(v);
  }

  Future<void> setPushEnabled(bool v) async {
    state = state.copyWith(pushEnabled: v);
    await storage.setPushEnabled(v);
  }
}
