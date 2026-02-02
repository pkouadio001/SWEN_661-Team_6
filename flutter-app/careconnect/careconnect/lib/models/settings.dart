class Settings {
  final bool highContrast;
  final bool pushEnabled;

  const Settings({required this.highContrast, required this.pushEnabled});

  Settings copyWith({bool? highContrast, bool? pushEnabled}) {
    return Settings(
      highContrast: highContrast ?? this.highContrast,
      pushEnabled: pushEnabled ?? this.pushEnabled,
    );
  }

  static const Settings defaults = Settings(
    highContrast: false,
    pushEnabled: true,
  );
}
