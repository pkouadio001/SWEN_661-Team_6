import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/screens/dashboard/dashboard_screen.dart';

void main() {
  group('DashboardScreen Widget Tests', () {
    testWidgets('renders app bar with title', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      expect(find.text('CareConnect'), findsOneWidget);
      expect(find.byType(AppBar), findsOneWidget);
    });

    testWidgets('displays welcome message', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      expect(find.text('Welcome, John Doe'), findsOneWidget);
      expect(find.text('Select a module to continue'), findsOneWidget);
    });

    testWidgets('displays all dashboard tiles', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      expect(find.text('Profile & Settings'), findsOneWidget);
      expect(find.text('Notifications'), findsOneWidget);
      expect(find.text('Patient Information'), findsOneWidget);
    });

    testWidgets('dashboard tiles have correct icons', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      expect(find.byIcon(Icons.person_outline), findsOneWidget);
      expect(find.byIcon(Icons.notifications_none), findsOneWidget);
      expect(find.byIcon(Icons.badge_outlined), findsOneWidget);
    });

    testWidgets('displays SOS emergency button', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      expect(find.text('SOS EMERGENCY'), findsOneWidget);
      expect(find.byIcon(Icons.warning_amber_rounded), findsOneWidget);
    });

    testWidgets('SOS button shows confirmation dialog when tapped', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      // Tap the SOS button
      await tester.tap(find.text('SOS EMERGENCY'));
      await tester.pumpAndSettle();

      // Verify dialog appears
      expect(find.text('Emergency Alert'), findsOneWidget);
      expect(find.text('This will notify your emergency contacts and caregivers.\n\nDo you want to continue?'), findsOneWidget);
      expect(find.text('Cancel'), findsOneWidget);
      expect(find.text('Send SOS'), findsOneWidget);
    });

    testWidgets('SOS confirmation dialog can be cancelled', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      // Tap the SOS button
      await tester.tap(find.text('SOS EMERGENCY'));
      await tester.pumpAndSettle();

      // Tap cancel button
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();

      // Dialog should be closed
      expect(find.text('Emergency Alert'), findsNothing);
    });

    testWidgets('SOS confirmation dialog triggers alert on confirm', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      // Tap the SOS button
      await tester.tap(find.text('SOS EMERGENCY'));
      await tester.pumpAndSettle();

      // Tap Send SOS button
      await tester.tap(find.text('Send SOS'));
      await tester.pumpAndSettle();

      // Verify snackbar appears
      expect(find.text('Emergency alert sent!'), findsOneWidget);
    });

    testWidgets('dashboard tiles have chevron icons', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      // There should be 3 chevron_right icons (one for each tile)
      expect(find.byIcon(Icons.chevron_right), findsNWidgets(3));
    });

    testWidgets('screen is scrollable', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      expect(find.byType(SingleChildScrollView), findsOneWidget);
    });

    testWidgets('dashboard has correct semantic labels for accessibility', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: DashboardScreen(),
        ),
      );

      // Find semantics for dashboard tiles
      final profileTileSemantics = tester.getSemantics(
        find.ancestor(
          of: find.text('Profile & Settings'),
          matching: find.byType(Semantics),
        ).first,
      );
      expect(profileTileSemantics.isButton, isTrue);
      expect(profileTileSemantics.label, 'Profile & Settings');

      // Find semantics for SOS button
      final sosBtnSemantics = tester.getSemantics(
        find.ancestor(
          of: find.text('SOS EMERGENCY'),
          matching: find.byType(Semantics),
        ).first,
      );
      expect(sosBtnSemantics.isButton, isTrue);
      expect(sosBtnSemantics.label, 'Emergency SOS button');
      expect(sosBtnSemantics.hint, 'Tap to request emergency assistance');
    });
  });
}
