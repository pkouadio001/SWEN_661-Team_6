import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/screens/profile/change_pin_dialog.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('ChangePinDialog', () {
    Future<void> pumpDialog(WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Builder(
              builder: (context) {
                return Center(
                  child: ElevatedButton(
                    onPressed: () {
                      showDialog<void>(
                        context: context,
                        builder: (_) => const ChangePinDialog(),
                      );
                    },
                    child: const Text('OPEN'),
                  ),
                );
              },
            ),
          ),
        ),
      );

      await tester.tap(find.text('OPEN'));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsOneWidget);
      expect(find.text('Change PIN'), findsOneWidget);
    }

    Future<void> enterPinByIndex(
      WidgetTester tester, {
      required int index, // 0=current, 1=new, 2=confirm
      required String value,
    }) async {
      final fields = find.byType(TextField);
      expect(fields, findsNWidgets(3));

      await tester.enterText(fields.at(index), value);
      await tester.pump();
    }

    testWidgets('renders all fields and buttons', (tester) async {
      await pumpDialog(tester);

      expect(find.text('Enter your current PIN and a new PIN'), findsOneWidget);

      expect(find.text('Current PIN'), findsOneWidget);
      expect(find.text('New PIN'), findsOneWidget);
      expect(find.text('Confirm New PIN'), findsOneWidget);

      expect(find.text('Cancel'), findsOneWidget);
      expect(find.text('Save Changes'), findsOneWidget);
      expect(find.byIcon(Icons.close), findsOneWidget);
    });

    testWidgets('close icon dismisses dialog', (tester) async {
      await pumpDialog(tester);

      await tester.tap(find.byIcon(Icons.close));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('Cancel button dismisses dialog', (tester) async {
      await pumpDialog(tester);

      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('shows SnackBar when new PIN is not 6 digits', (tester) async {
      await pumpDialog(tester);

      await enterPinByIndex(
        tester,
        index: 1,
        value: '123',
      ); // New PIN (invalid length)
      await enterPinByIndex(tester, index: 2, value: '123'); // Confirm

      await tester.tap(find.text('Save Changes'));
      await tester.pump(); // show SnackBar

      expect(find.text('PINs must match and be 6 digits'), findsOneWidget);
      expect(find.byType(Dialog), findsOneWidget);
    });

    testWidgets('shows SnackBar when PINs do not match', (tester) async {
      await pumpDialog(tester);

      await enterPinByIndex(tester, index: 1, value: '123456'); // New
      await enterPinByIndex(
        tester,
        index: 2,
        value: '654321',
      ); // Confirm mismatch

      await tester.tap(find.text('Save Changes'));
      await tester.pump();

      expect(find.text('PINs must match and be 6 digits'), findsOneWidget);
      expect(find.byType(Dialog), findsOneWidget);
    });

    testWidgets('valid PIN closes dialog', (tester) async {
      await pumpDialog(tester);

      await enterPinByIndex(tester, index: 1, value: '123456'); // New
      await enterPinByIndex(tester, index: 2, value: '123456'); // Confirm

      await tester.tap(find.text('Save Changes'));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsNothing);
    });
  });
}
