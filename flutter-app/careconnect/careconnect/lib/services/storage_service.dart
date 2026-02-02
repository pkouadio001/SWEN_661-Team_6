import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const _kHighContrast = 'high_contrast';
  static const _kPushEnabled = 'push_enabled';

  Future<bool> getHighContrast() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_kHighContrast) ?? false;
  }

  Future<void> setHighContrast(bool v) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_kHighContrast, v);
  }

  Future<bool> getPushEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_kPushEnabled) ?? true;
  }

  Future<void> setPushEnabled(bool v) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_kPushEnabled, v);
  }
}
