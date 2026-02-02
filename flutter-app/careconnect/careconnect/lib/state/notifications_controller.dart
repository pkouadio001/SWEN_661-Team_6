import 'package:flutter_riverpod/flutter_riverpod.dart';

class PushSettings {
  final bool master;
  final bool meds;
  final bool appts;
  final bool tasks;
  final bool health;
  final bool caregiverMsgs;
  final bool sound;

  const PushSettings({
    required this.master,
    required this.meds,
    required this.appts,
    required this.tasks,
    required this.health,
    required this.caregiverMsgs,
    required this.sound,
  });

  PushSettings copyWith({
    bool? master,
    bool? meds,
    bool? appts,
    bool? tasks,
    bool? health,
    bool? caregiverMsgs,
    bool? sound,
  }) {
    return PushSettings(
      master: master ?? this.master,
      meds: meds ?? this.meds,
      appts: appts ?? this.appts,
      tasks: tasks ?? this.tasks,
      health: health ?? this.health,
      caregiverMsgs: caregiverMsgs ?? this.caregiverMsgs,
      sound: sound ?? this.sound,
    );
  }

  static const demo = PushSettings(
    master: true,
    meds: true,
    appts: true,
    tasks: true,
    health: true,
    caregiverMsgs: true,
    sound: true,
  );
}

final pushSettingsProvider =
    StateNotifierProvider<PushSettingsController, PushSettings>((ref) {
      return PushSettingsController();
    });

class PushSettingsController extends StateNotifier<PushSettings> {
  PushSettingsController() : super(PushSettings.demo);

  void toggleMaster(bool v) => state = state.copyWith(master: v);
  void toggleMeds(bool v) => state = state.copyWith(meds: v);
  void toggleAppts(bool v) => state = state.copyWith(appts: v);
  void toggleTasks(bool v) => state = state.copyWith(tasks: v);
  void toggleHealth(bool v) => state = state.copyWith(health: v);
  void toggleMsgs(bool v) => state = state.copyWith(caregiverMsgs: v);
  void toggleSound(bool v) => state = state.copyWith(sound: v);
}
