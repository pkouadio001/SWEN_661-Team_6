import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:go_router/go_router.dart';

// ✅ Update these imports if your paths differ:
import 'package:careconnect/screens/communication/communication_safety_screen.dart';
import 'package:careconnect/screens/communication/widgets/sos_dialog.dart';

void main() {
  testWidgets('CommunicationSafetyScreen renders and actions work', (
    tester,
  ) async {
    // Minimal placeholder destinations for routing
    const homeScreen = Scaffold(body: Center(child: Text('HOME')));
    const messagesScreen = Scaffold(body: Center(child: Text('MESSAGES')));

    final router = GoRouter(
      initialLocation: '/comm',
      routes: [
        GoRoute(path: '/home', builder: (_, __) => homeScreen),
        GoRoute(
          path: '/comm',
          builder: (_, __) => const CommunicationSafetyScreen(),
          routes: [
            GoRoute(path: 'messages', builder: (_, __) => messagesScreen),
          ],
        ),
      ],
    );

    await tester.pumpWidget(MaterialApp.router(routerConfig: router));
    await tester.pumpAndSettle();

    // ---------- Render assertions ----------
    expect(find.text('Communication & Safety'), findsOneWidget);
    expect(find.text('Messages and emergency contacts'), findsOneWidget);

    // Back pill
    expect(find.text('Back to Dashboard'), findsOneWidget);

    // Messages card
    expect(find.text('Messages'), findsOneWidget);
    expect(find.text('Stay connected with your care team'), findsOneWidget);
    expect(find.text('Open Messages'), findsOneWidget);

    // Safety card
    expect(find.text('Safety'), findsOneWidget);
    expect(find.text('Emergency contacts'), findsOneWidget);
    expect(find.text('Emergency SOS'), findsOneWidget);

    // Contacts
    expect(find.text('Caregiver Maria'), findsOneWidget);
    expect(find.text('555-0123'), findsOneWidget);
    expect(find.text('Emergency: 911'), findsOneWidget);
    expect(find.text('Police/Fire/EMS'), findsOneWidget);

    // ---------- Tap: Open Messages -> navigate ----------
    await tester.tap(find.text('Open Messages'));
    await tester.pumpAndSettle();
    expect(find.text('MESSAGES'), findsOneWidget);

    // Navigate back to /comm to continue test
    router.go('/comm');
    await tester.pumpAndSettle();

    // ---------- Tap: SOS opens bottom sheet ----------
    await tester.tap(find.text('Emergency SOS'));
    await tester.pumpAndSettle();

    // Bottom sheet content should be SosDialog
    expect(find.byType(SosDialog), findsOneWidget);
  });
}
