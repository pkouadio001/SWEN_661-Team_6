import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/widgets/back_pill.dart';

void main() {
  group('BackPill Widget Tests', () {
    testWidgets('renders with correct text', (WidgetTester tester) async {
      const testText = 'Back to Dashboard';
      
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: testText,
              onTap: () {},
            ),
          ),
        ),
      );

      expect(find.text(testText), findsOneWidget);
    });

    testWidgets('calls onTap when tapped', (WidgetTester tester) async {
      var tapped = false;
      
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Dashboard',
              onTap: () {
                tapped = true;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.byType(BackPill));
      await tester.pump();

      expect(tapped, isTrue);
    });

    testWidgets('displays back arrow icon', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Dashboard',
              onTap: () {},
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    });

    testWidgets('has correct semantic properties', (WidgetTester tester) async {
      const testText = 'Back to Dashboard';
      
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: testText,
              onTap: () {},
            ),
          ),
        ),
      );

      final semantics = tester.getSemantics(find.byType(Semantics).first);
      expect(semantics.isButton, isTrue);
      expect(semantics.label, testText);
    });

    testWidgets('has full width', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Dashboard',
              onTap: () {},
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(InkWell),
          matching: find.byType(Container),
        ),
      );

      expect(container.constraints?.maxWidth, double.infinity);
    });

    testWidgets('has correct visual styling', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Dashboard',
              onTap: () {},
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(InkWell),
          matching: find.byType(Container),
        ),
      );

      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, Colors.white);
      expect(decoration.borderRadius, BorderRadius.circular(12));
      expect(decoration.border, isA<Border>());
      expect(decoration.boxShadow, isNotNull);
    });

    testWidgets('icon and text are centered horizontally', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Dashboard',
              onTap: () {},
            ),
          ),
        ),
      );

      final row = tester.widget<Row>(
        find.descendant(
          of: find.byType(BackPill),
          matching: find.byType(Row),
        ),
      );

      expect(row.mainAxisAlignment, MainAxisAlignment.center);
    });
  });
}
