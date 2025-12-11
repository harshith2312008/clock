import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class WorldClockScreen extends StatefulWidget {
  const WorldClockScreen({Key? key}) : super(key: key);

  @override
  State<WorldClockScreen> createState() => _WorldClockScreenState();
}

class _WorldClockScreenState extends State<WorldClockScreen> {
  // Simplified list of offsets for demo purposes
  // In a real app, use 'timezone' package
  final Map<String, double> _cities = {
    'New York': -5.0,
    'London': 0.0,
    'Tokyo': 9.0,
    'Sydney': 11.0,
    'Paris': 1.0,
    'Dubai': 4.0,
  };

  List<String> _selectedCities = ['New York', 'London', 'Tokyo'];
  Timer? _timer;
  DateTime _now = DateTime.now().toUtc();

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() => _now = DateTime.now().toUtc());
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddCity(context),
        label: const Text('Add City'),
        icon: const Icon(Icons.add),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _selectedCities.length,
        itemBuilder: (context, index) {
          final city = _selectedCities[index];
          final offset = _cities[city] ?? 0.0;
          final cityTime = _now.add(Duration(minutes: (offset * 60).toInt()));
          
          final timeStr = DateFormat('HH:mm').format(cityTime);
          final dayStr = DateFormat('EEE, MMM d').format(cityTime);
          
          // Calculate relative time (e.g., "+5 HRS")
          // Comparing to local time is tricky without knowing local offset roughly
          // We'll just show the time.
          
          return Dismissible(
            key: Key(city),
            onDismissed: (_) {
              setState(() => _selectedCities.removeAt(index));
            },
            background: Container(color: Theme.of(context).colorScheme.errorContainer),
            child: Card(
              margin: const EdgeInsets.only(bottom: 12),
              color: Theme.of(context).colorScheme.surfaceVariant,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(dayStr, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Theme.of(context).colorScheme.error)),
                        Text(city, style: Theme.of(context).textTheme.headlineSmall),
                      ],
                    ),
                    Text(
                      timeStr,
                      style: Theme.of(context).textTheme.displayMedium?.copyWith(
                        fontWeight: FontWeight.w300,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  void _showAddCity(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (context) {
        final available = _cities.keys.where((c) => !_selectedCities.contains(c)).toList();
        return ListView.builder(
          itemCount: available.length,
          itemBuilder: (context, index) {
            return ListTile(
              title: Text(available[index]),
              onTap: () {
                setState(() => _selectedCities.add(available[index]));
                Navigator.pop(context);
              },
            );
          },
        );
      },
    );
  }
}
