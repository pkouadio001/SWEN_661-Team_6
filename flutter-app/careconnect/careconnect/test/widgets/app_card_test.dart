import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/widgets/app_card.dart';

void main() {
  group('AppCard Widget Tests', () {
    testWidgets('renders child widget', (WidgetTester tester) async {
      const testText = 'Test Content';
      
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text(testText),
            ),
          ),
        ),
      );

      expect(find.text(testText), findsOneWidget);
    });

    testWidgets('has correct default padding', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text('Test'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(AppCard),
          matching: find.byType(Container),
        ),
      );

      expect(container.padding, const EdgeInsets.fromLTRB(16, 14, 16, 16));
    });

    testWidgets('allows custom padding', (WidgetTester tester) async {
      const customPadding = EdgeInsets.all(20);
      
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AppCard(
              padding: customPadding,
              child: Text('Test'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(AppCard),
          matching: find.byType(Container),
        ),
      );

      expect(container.padding, customPadding);
    });

    testWidgets('has correct visual properties', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text('Test'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(AppCard),
          matching: find.byType(Container),
        ),
      );

      final decoration = container.decoration as BoxDecoration;
      
      expect(decoration.color, Colors.white);
      expect(decoration.borderRadius, BorderRadius.circular(16));
      expect(decoration.border, isA<Border>());
      expect(decoration.boxShadow, isNotNull);
      expect(decoration.boxShadow!.length, 1);
    });

    testWidgets('takes full width', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: AppCard(
              child: Text('Test'),
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(AppCard),
          matching: find.byType(Container),
        ),
      );

      expect(container.constraints?.maxWidth, double.infinity);
    });
  });
}
