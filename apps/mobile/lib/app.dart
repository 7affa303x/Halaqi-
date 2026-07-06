import 'package:flutter/material.dart';
import 'package:halaqi/screens/home_screen.dart';

class HalaqiApp extends StatelessWidget {
  const HalaqiApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Halaqi',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}
