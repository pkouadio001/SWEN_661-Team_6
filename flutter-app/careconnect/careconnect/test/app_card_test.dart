import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/widgets/app_card.dart';

void main() {
  group('AppCard', () {
    testWidgets('renders with child widget', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text('Test Content'),
            ),
          ),
        ),
      );

      expect(find.text('Test Content'), findsOneWidget);
    });

    testWidgets('has default padding', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text('Test Content'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.byType(Container),
      );

      expect(
        container.padding,
        const EdgeInsets.fromLTRB(16, 14, 16, 16),
      );
    });

    testWidgets('accepts custom padding', (WidgetTester tester) async {
      const customPadding = EdgeInsets.all(20);

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppCard(
              padding: customPadding,
              child: Text('Test Content'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.byType(Container),
      );

      expect(container.padding, customPadding);
    });

    testWidgets('has full width', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text('Test Content'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.byType(Container),
      );

      expect(container.constraints?.maxWidth, double.infinity);
    });

    testWidgets('has white background color', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text('Test Content'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.byType(Container),
      );

      final decoration = container.decoration as BoxDecoration;
      expect(decoration.color, Colors.white);
    });

    testWidgets('has rounded corners', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text('Test Content'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.byType(Container),
      );

      final decoration = container.decoration as BoxDecoration;
      expect(
        decoration.borderRadius,
        BorderRadius.circular(16),
      );
    });

    testWidgets('has border', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text('Test Content'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.byType(Container),
      );

      final decoration = container.decoration as BoxDecoration;
      expect(decoration.border, isNotNull);
    });

    testWidgets('has shadow', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text('Test Content'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.byType(Container),
      );

      final decoration = container.decoration as BoxDecoration;
      expect(decoration.boxShadow, isNotNull);
      expect(decoration.boxShadow!.length, 1);
    });
  });
}
