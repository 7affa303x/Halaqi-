import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Halaqi'),
        centerTitle: true,
        backgroundColor: Colors.deepPurple,
        foregroundColor: Colors.white,
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.cut, size: 80, color: Colors.deepPurple),
            SizedBox(height: 24),
            Text(
              'Halaqi',
              style: TextStyle(fontSize: 40, fontWeight: FontWeight.bold, color: Colors.deepPurple),
            ),
            SizedBox(height: 12),
            Text(
              'Barbershop Management',
              style: TextStyle(fontSize: 18, color: Colors.grey),
            ),
            SizedBox(height: 40),
            Text(
              'Find, Book, and Manage
Your Barbershop Appointments',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
