import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:careconnect/screens/profile/profile_settings_screen.dart';
import 'package:careconnect/state/profile_controller.dart';
import 'package:careconnect/state/settings_controller.dart';
import 'package:careconnect/screens/profile/change_pin_dialog.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('ProfileSettingsScreen', () {
    Future<ProviderContainer> pumpScreen(WidgetTester tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: _routerApp(initialLocation: '/profile'),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.byType(ProfileSettingsScreen), findsOneWidget);
      return container;
    }

    Future<void> tapVisible(WidgetTester tester, Finder finder) async {
      await tester.ensureVisible(finder);
      await tester.pumpAndSettle();
      await tester.tap(finder);
      await tester.pump(); // allow immediate UI effects (SnackBar/dialog)
    }

    testWidgets('Edit -> Save updates provider + snackbar, exits edit mode', (
      tester,
    ) async {
      final container = await pumpScreen(tester);

      // Enter edit mode (Edit is near top, should be visible)
      await tapVisible(tester, find.text('Edit'));

      expect(find.text('Save Changes'), findsOneWidget);
      expect(find.text('Cancel'), findsOneWidget);

      // 4 TextFields: Full Name, Email, Username, Role
      final fields = find.byType(TextField);
      expect(fields, findsNWidgets(4));

      await tester.enterText(fields.at(0), 'New Name');
      await tester.enterText(fields.at(1), 'new@email.com');
      await tester.enterText(fields.at(2), 'newusername');
      await tester.pump();

      // Save might be off-screen depending on device size — ensureVisible first.
      await tapVisible(tester, find.text('Save Changes'));

      // SnackBar
      expect(find.text('Profile updated'), findsOneWidget);

      // After save, edit mode off
      await tester.pumpAndSettle();
      expect(find.text('Edit'), findsOneWidget);
      expect(find.text('Save Changes'), findsNothing);

      // Provider updated
      final updated = container.read(profileProvider);
      expect(updated.fullName, 'New Name');
      expect(updated.email, 'new@email.com');
      expect(updated.username, 'newusername');
    });

    testWidgets('Cancel exits edit mode without saving', (tester) async {
      final container = await pumpScreen(tester);

      final before = container.read(profileProvider);

      await tapVisible(tester, find.text('Edit'));

      final fields = find.byType(TextField);
      expect(fields, findsNWidgets(4));

      await tester.enterText(fields.at(0), 'SHOULD NOT SAVE');
      await tester.pump();

      await tapVisible(tester, find.text('Cancel'));
      await tester.pumpAndSettle();

      final after = container.read(profileProvider);
      expect(after.fullName, before.fullName);
      expect(find.text('Edit'), findsOneWidget);
    });

    testWidgets('toggling High Contrast Mode updates settings provider', (
      tester,
    ) async {
      final container = await pumpScreen(tester);

      final before = container.read(settingsProvider).highContrast;

      // Switch is lower on the page; scroll to it before tapping.
      final switchFinder = find.byType(Switch);
      await tester.ensureVisible(switchFinder);
      await tester.pumpAndSettle();

      await tester.tap(switchFinder);
      await tester.pumpAndSettle();

      final after = container.read(settingsProvider).highContrast;
      expect(after, isNot(equals(before)));
    });

    testWidgets('tapping Update opens ChangePinDialog', (tester) async {
      await pumpScreen(tester);

      // The Update button is in Settings card; scroll to it.
      final updateBtn = find.text('Update');
      await tapVisible(tester, updateBtn);
      await tester.pumpAndSettle();

      expect(find.byType(ChangePinDialog), findsOneWidget);
    });

    testWidgets('Logout navigates to /auth', (tester) async {
      await pumpScreen(tester);

      final logoutBtn = find.text('Logout');
      await tapVisible(tester, logoutBtn);
      await tester.pumpAndSettle();

      expect(find.text('AUTH_SCREEN'), findsOneWidget);
    });
  });
}

/// Minimal router to validate navigation.
Widget _routerApp({required String initialLocation}) {
  final router = GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: '/profile',
        builder: (context, state) => const ProfileSettingsScreen(),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('HOME_SCREEN'))),
      ),
      GoRoute(
        path: '/auth',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('AUTH_SCREEN'))),
      ),
    ],
  );

  return MaterialApp.router(routerConfig: router);
}
