import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:careconnect/widgets/back_pill.dart';

void main() {
  group('BackPill', () {
    testWidgets('renders with text', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Home',
              onTap: () {},
            ),
          ),
        ),
      );

      expect(find.text('Back to Dashboard'), findsOneWidget);
    });

    testWidgets('shows back arrow icon', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Home',
              onTap: () {},
            ),
          ),
        ),
      );

      expect(find.byIcon(Icons.arrow_back), findsOneWidget);
    });

    testWidgets('calls onTap callback when tapped', (WidgetTester tester) async {
      var wasTapped = false;

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Home',
              onTap: () {
                wasTapped = true;
              },
            ),
          ),
        ),
      );

      await tester.tap(find.byType(BackPill));
      await tester.pump();

      expect(wasTapped, true);
    });

    testWidgets('has full width', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Home',
              onTap: () {},
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
            body: BackPill(
              text: 'Back to Home',
              onTap: () {},
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
            body: BackPill(
              text: 'Back to Home',
              onTap: () {},
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
        BorderRadius.circular(12),
      );
    });

    testWidgets('is semantically marked as a button', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Home',
              onTap: () {},
            ),
          ),
        ),
      );

      expect(find.bySemanticsLabel('Back to Home'), findsOneWidget);
    });

    testWidgets('has correct vertical padding', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: BackPill(
              text: 'Back to Home',
              onTap: () {},
            ),
          ),
        ),
      );

      final container = tester.widget<Container>(
        find.byType(Container),
      );

      expect(
        container.padding,
        const EdgeInsets.symmetric(vertical: 14),
      );
    });
  });
}
