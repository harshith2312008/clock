import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:audioplayers/audioplayers.dart';
import 'providers/clock_provider.dart';
import 'providers/alarm_provider.dart';
import 'providers/theme_provider.dart';
import 'screens/analog_clock_screen.dart';
import 'screens/alarm_screen.dart';
import 'screens/stopwatch_screen.dart';
import 'screens/timer_screen.dart';
import 'screens/world_clock_screen.dart';
import 'screens/settings_screen.dart';

void main() {
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => ThemeProvider()), // First so app can use it
        ChangeNotifierProvider(create: (_) => ClockProvider()),
        ChangeNotifierProvider(create: (_) => AlarmProvider()),
      ],
      child: const ClockApp(),
    ),
  );
}

class ClockApp extends StatelessWidget {
  const ClockApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeProvider>(
      builder: (context, themeProvider, child) {
        return MaterialApp(
          title: 'Clock',
          debugShowCheckedModeBanner: false,
          themeMode: themeProvider.themeMode,
          theme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF6750A4),
              brightness: Brightness.light,
            ),
            textTheme: GoogleFonts.outfitTextTheme(),
          ),
          darkTheme: ThemeData(
            useMaterial3: true,
            colorScheme: ColorScheme.fromSeed(
              seedColor: const Color(0xFF6750A4),
              brightness: Brightness.dark,
            ),
            textTheme: GoogleFonts.outfitTextTheme().apply(
              bodyColor: Colors.white,
              displayColor: Colors.white,
            ),
          ),
          home: const HomeScreen(),
        );
      },
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  final AudioPlayer _audioPlayer = AudioPlayer();

  final List<Widget> _screens = const [
    AnalogClockScreen(),
    AlarmScreen(),
    StopwatchScreen(),
    TimerScreen(),
    WorldClockScreen(),
  ];

  @override
  void initState() {
    super.initState();
    // Hook up alarm checking
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final clock = Provider.of<ClockProvider>(context, listen: false);
      final alarmProvider = Provider.of<AlarmProvider>(context, listen: false);
      
      clock.onSecondTick = (DateTime now) {
         // Simple check: if second is 0, check match
         if (now.second == 0) {
           _checkAlarms(now, alarmProvider);
         }
      };
    });
  }

  void _checkAlarms(DateTime now, AlarmProvider provider) {
    final currentStr = '${now.hour.toString().padLeft(2,'0')}:${now.minute.toString().padLeft(2,'0')}';
    
    // Find active alarms matching time
    // Also check days (omitted for brevity, assume daily if day list empty or contains weekday)
    final firing = provider.alarms.where((a) => 
      a.isActive && a.time == currentStr
    ).toList();

    if (firing.isNotEmpty) {
      _fireAlarm(firing.first.label);
    }
  }

  void _fireAlarm(String label) async {
    // Play sound (beep)
    // For demo, we assume internet or asset. If offline, this might fail silently.
    try {
      await _audioPlayer.play(UrlSource('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg'));
    } catch (e) { print(e); }

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => AlertDialog(
        title: const Text('Alarm'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.alarm_on, size: 48, color: Colors.orange),
            const SizedBox(height: 16),
            Text(label, style: Theme.of(context).textTheme.headlineSmall),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              _audioPlayer.stop();
              Navigator.pop(context);
            },
            child: const Text('Dismiss'),
          ),
          TextButton(
            onPressed: () {
               _audioPlayer.stop();
               // Snooze logic (not implemented)
               Navigator.pop(context);
            },
            child: const Text('Snooze'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Clock'),
        actions: [
          IconButton(
            icon: const Icon(Icons.settings),
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SettingsScreen())),
          )
        ],
      ),
      body: SafeArea(
        child: IndexedStack(
          index: _currentIndex,
          children: _screens,
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: const [
          NavigationDestination(icon: Icon(Icons.access_time), label: 'Clock'),
          NavigationDestination(icon: Icon(Icons.alarm), label: 'Alarm'),
          NavigationDestination(icon: Icon(Icons.timer), label: 'Stopwatch'),
          NavigationDestination(icon: Icon(Icons.hourglass_bottom), label: 'Timer'),
          NavigationDestination(icon: Icon(Icons.public), label: 'World'),
        ],
      ),
    );
  }
}
