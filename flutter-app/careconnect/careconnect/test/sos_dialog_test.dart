import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

// Update this import to your real path if needed:
import 'package:careconnect/screens/communication/widgets/sos_dialog.dart';

void main() {
  testWidgets('SosDialog renders and actions work', (tester) async {
    await tester.pumpWidget(
      const MaterialApp(home: Scaffold(body: SosDialog())),
    );

    await tester.pumpAndSettle();

    // ---- Render checks ----
    expect(find.text('Emergency SOS Activated'), findsOneWidget);
    expect(find.text('Select a contact to call immediately'), findsOneWidget);

    expect(find.text('Caregiver Maria'), findsOneWidget);
    expect(find.text('555-0123'), findsOneWidget);

    expect(find.text('Emergency: 911'), findsOneWidget);
    expect(find.text('Police/Fire/EMS'), findsOneWidget);

    expect(find.text('Cancel'), findsOneWidget);

    // ---- Tap "Caregiver Maria" call row ----
    await tester.tap(find.text('Caregiver Maria'));
    await tester.pump(); // start SnackBar animation
    await tester.pump(const Duration(milliseconds: 300));

    // SnackBar should appear
    expect(find.text('Calling Caregiver Maria (demo)'), findsOneWidget);
  });

  testWidgets('Cancel button closes the SosDialog', (tester) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Builder(
            builder: (context) {
              return Center(
                child: ElevatedButton(
                  onPressed: () => showModalBottomSheet(
                    context: context,
                    isScrollControlled: true,
                    backgroundColor: Colors.transparent,
                    builder: (_) => const SosDialog(),
                  ),
                  child: const Text('Open'),
                ),
              );
            },
          ),
        ),
      ),
    );

    await tester.pumpAndSettle();

    // Open bottom sheet
    await tester.tap(find.text('Open'));
    await tester.pumpAndSettle();

    expect(find.byType(SosDialog), findsOneWidget);

    // Tap cancel
    await tester.tap(find.text('Cancel'));
    await tester.pumpAndSettle();

    // Bottom sheet closed
    expect(find.byType(SosDialog), findsNothing);
  });
}
