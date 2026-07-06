import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:halaqi/app.dart';

void main() {
  testWidgets('Halaqi app renders', (WidgetTester tester) async {
    await tester.pumpWidget(const HalaqiApp());
    expect(find.text('Halaqi'), findsOneWidget);
    expect(find.byIcon(Icons.cut), findsOneWidget);
  });
}
