import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'router/app_router.dart';
import 'state/settings_controller.dart';
import 'theme/app_theme.dart';

void main() {
  runApp(const ProviderScope(child: CareConnectApp()));
}

class CareConnectApp extends StatelessWidget {
  const CareConnectApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      routerConfig: appRouter,
      builder: (context, child) => _ThemeWrapper(child: child ?? const SizedBox()),
    );
  }
}

class _ThemeWrapper extends ConsumerWidget {
  final Widget child;

  const _ThemeWrapper({required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    
    return Theme(
      data: settings.highContrast ? AppTheme.highContrast() : AppTheme.light(),
      child: child,
    );
  }
}
