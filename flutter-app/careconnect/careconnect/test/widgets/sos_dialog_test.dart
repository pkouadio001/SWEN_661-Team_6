import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/screens/communication/widgets/sos_dialog.dart';

void main() {
  group('SosDialog', () {
    testWidgets('renders dialog with title', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SosDialog(),
          ),
        ),
      );

      expect(find.text('Emergency SOS Activated'), findsOneWidget);
    });

    testWidgets('renders dialog with subtitle', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SosDialog(),
          ),
        ),
      );

      expect(find.text('Select a contact to call immediately'), findsOneWidget);
    });

    testWidgets('displays caregiver contact option', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SosDialog(),
          ),
        ),
      );

      expect(find.text('Caregiver Maria'), findsOneWidget);
      expect(find.text('555-0123'), findsOneWidget);
    });

    testWidgets('displays emergency 911 contact option', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SosDialog(),
          ),
        ),
      );

      expect(find.text('Emergency: 911'), findsOneWidget);
      expect(find.text('Police/Fire/EMS'), findsOneWidget);
    });

    testWidgets('has Cancel button', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SosDialog(),
          ),
        ),
      );

      expect(find.text('Cancel'), findsOneWidget);
    });

    testWidgets('closes dialog when Cancel button is tapped', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Builder(
              builder: (context) => ElevatedButton(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (_) => SosDialog(),
                  );
                },
                child: Text('Show Dialog'),
              ),
            ),
          ),
        ),
      );

      // Open dialog
      await tester.tap(find.text('Show Dialog'));
      await tester.pumpAndSettle();

      expect(find.byType(SosDialog), findsOneWidget);

      // Close dialog
      await tester.tap(find.text('Cancel'));
      await tester.pumpAndSettle();

      expect(find.byType(SosDialog), findsNothing);
    });

    testWidgets('displays call icons', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SosDialog(),
          ),
        ),
      );

      expect(find.byIcon(Icons.call), findsNWidgets(2));
    });

    testWidgets('caregiver contact is semantically marked as button', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SosDialog(),
          ),
        ),
      );

      expect(find.bySemanticsLabel('Call Caregiver Maria'), findsOneWidget);
    });

    testWidgets('911 contact is semantically marked as button', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SosDialog(),
          ),
        ),
      );

      expect(find.bySemanticsLabel('Call Emergency: 911'), findsOneWidget);
    });

    testWidgets('shows snackbar and closes when caregiver contact is tapped', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Builder(
              builder: (context) => ElevatedButton(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (_) => SosDialog(),
                  );
                },
                child: Text('Show Dialog'),
              ),
            ),
          ),
        ),
      );

      // Open dialog
      await tester.tap(find.text('Show Dialog'));
      await tester.pumpAndSettle();

      // Tap caregiver contact
      await tester.tap(find.text('Caregiver Maria'));
      await tester.pumpAndSettle();

      // Should show snackbar
      expect(find.text('Calling Caregiver Maria (demo)'), findsOneWidget);

      // Dialog should be closed
      expect(find.byType(SosDialog), findsNothing);
    });

    testWidgets('shows snackbar and closes when 911 contact is tapped', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Builder(
              builder: (context) => ElevatedButton(
                onPressed: () {
                  showDialog(
                    context: context,
                    builder: (_) => SosDialog(),
                  );
                },
                child: Text('Show Dialog'),
              ),
            ),
          ),
        ),
      );

      // Open dialog
      await tester.tap(find.text('Show Dialog'));
      await tester.pumpAndSettle();

      // Tap 911 contact
      await tester.tap(find.text('Emergency: 911'));
      await tester.pumpAndSettle();

      // Should show snackbar
      expect(find.text('Calling Emergency: 911 (demo)'), findsOneWidget);

      // Dialog should be closed
      expect(find.byType(SosDialog), findsNothing);
    });

    testWidgets('header has red background color', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SosDialog(),
          ),
        ),
      );

      final containers = tester.widgetList<Container>(find.byType(Container));
      final headerContainer = containers.firstWhere(
        (c) => (c.decoration as BoxDecoration?)?.color == const Color(0xFFE60000),
      );

      expect(headerContainer, isNotNull);
    });

    testWidgets('has rounded corners', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: SosDialog(),
          ),
        ),
      );

      final containers = tester.widgetList<Container>(find.byType(Container));
      final mainContainer = containers.firstWhere(
        (c) => (c.decoration as BoxDecoration?)?.color == Colors.white && 
               (c.decoration as BoxDecoration?)?.borderRadius == BorderRadius.circular(16),
      );

      expect(mainContainer, isNotNull);
    });
  });
}
