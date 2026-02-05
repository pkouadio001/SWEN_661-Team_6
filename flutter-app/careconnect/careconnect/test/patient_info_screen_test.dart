import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

// Update these imports to your real paths:
import 'package:careconnect/screens/patient/patient_info_screen.dart';
import 'package:careconnect/state/patient_controller.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('PatientInfoScreen', () {
    testWidgets('renders labels and shows patient values from provider', (
      tester,
    ) async {
      // ✅ Use real provider default state (no manual Patient construction)
      final container = ProviderContainer();
      addTearDown(container.dispose);

      final p = container.read(patientProvider);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: _routerApp(initialLocation: '/patient'),
        ),
      );

      // Headings
      expect(
        find.text('Patient Information'),
        findsWidgets,
      ); // AppBar + title in card
      expect(find.text('Personal Details'), findsOneWidget);
      expect(find.text('Medical Information'), findsOneWidget);
      expect(find.text('Emergency Contact'), findsOneWidget);

      // Labels
      expect(find.text('Full Name'), findsOneWidget);
      expect(find.text('Date of Birth'), findsOneWidget);
      expect(find.text('Email'), findsOneWidget);
      expect(find.text('Address'), findsOneWidget);

      expect(find.text('Primary Physician'), findsOneWidget);
      expect(find.text('Specialty'), findsOneWidget);
      expect(find.text('Medical Conditions'), findsOneWidget);
      expect(find.text('Current Medications'), findsOneWidget);
      expect(find.text('Allergies'), findsOneWidget);

      expect(find.text('Contact Name'), findsOneWidget);
      expect(find.text('Phone Number'), findsOneWidget);

      // ✅ Values from provider (whatever your default patient is)
      expect(find.text(p.fullName), findsOneWidget);
      expect(find.text(p.dobText), findsOneWidget);
      expect(find.text(p.email), findsOneWidget);
      expect(find.text(p.address), findsOneWidget);

      expect(find.text(p.physician), findsOneWidget);
      expect(find.text(p.specialty), findsOneWidget);
      expect(find.text(p.conditions), findsOneWidget);
      expect(find.text(p.meds), findsOneWidget);
      expect(find.text(p.allergies), findsOneWidget);

      expect(find.text(p.emergencyName), findsOneWidget);
      expect(find.text(p.emergencyPhone), findsOneWidget);

      // Two edit buttons
      expect(find.text('Edit'), findsNWidgets(2));
    });

    testWidgets('tapping Edit navigates to /patient/edit', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: _routerApp(initialLocation: '/patient'),
        ),
      );

      await tester.tap(find.text('Edit').first);
      await tester.pumpAndSettle();

      expect(find.text('PATIENT_EDIT_SCREEN'), findsOneWidget);
    });

    testWidgets('tapping Back to Dashboard pill navigates to /home', (
      tester,
    ) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: _routerApp(initialLocation: '/patient'),
        ),
      );

      await tester.tap(find.text('Back to Dashboard'));
      await tester.pumpAndSettle();

      expect(find.text('HOME_SCREEN'), findsOneWidget);
    });

    testWidgets('tapping AppBar back arrow navigates to /home', (tester) async {
      final container = ProviderContainer();
      addTearDown(container.dispose);

      await tester.pumpWidget(
        UncontrolledProviderScope(
          container: container,
          child: _routerApp(initialLocation: '/patient'),
        ),
      );

      await tester.tap(find.byIcon(Icons.arrow_back).first);
      await tester.pumpAndSettle();

      expect(find.text('HOME_SCREEN'), findsOneWidget);
    });
  });
}

/// Router wrapper with stub destinations for navigation assertions.
Widget _routerApp({required String initialLocation}) {
  final router = GoRouter(
    initialLocation: initialLocation,
    routes: [
      GoRoute(
        path: '/patient',
        builder: (context, state) => const PatientInfoScreen(),
      ),
      GoRoute(
        path: '/patient/edit',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('PATIENT_EDIT_SCREEN'))),
      ),
      GoRoute(
        path: '/home',
        builder: (context, state) =>
            const Scaffold(body: Center(child: Text('HOME_SCREEN'))),
      ),
    ],
  );

  return MaterialApp.router(routerConfig: router);
}
