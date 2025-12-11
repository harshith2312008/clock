import 'dart:async';
import 'package:flutter/material.dart';

class StopwatchScreen extends StatefulWidget {
  const StopwatchScreen({Key? key}) : super(key: key);

  @override
  State<StopwatchScreen> createState() => _StopwatchScreenState();
}

class _StopwatchScreenState extends State<StopwatchScreen> {
  late Stopwatch _stopwatch;
  Timer? _timer;
  List<Duration> _laps = [];

  @override
  void initState() {
    super.initState();
    _stopwatch = Stopwatch();
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startStop() {
    if (_stopwatch.isRunning) {
      _stopwatch.stop();
      _timer?.cancel();
    } else {
      _stopwatch.start();
      _timer = Timer.periodic(const Duration(milliseconds: 30), (timer) {
        setState(() {}); // Re-render for UI update
      });
    }
    setState(() {});
  }

  void _reset() {
    _stopwatch.reset();
    _laps.clear();
    setState(() {});
  }

  void _lap() {
    if (_stopwatch.isRunning) {
      _laps.insert(0, _stopwatch.elapsed);
      setState(() {});
    }
  }

  String _formatDuration(Duration d) {
    String twoDigits(int n) => n.toString().padLeft(2, "0");
    String twoDigitMinutes = twoDigits(d.inMinutes.remainder(60));
    String twoDigitSeconds = twoDigits(d.inSeconds.remainder(60));
    String fraction = (d.inMilliseconds % 1000 ~/ 10).toString().padLeft(2, "0");
    return "$twoDigitMinutes:$twoDigitSeconds.$fraction";
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final elapsed = _stopwatch.elapsed;

    return Padding(
      padding: const EdgeInsets.all(24.0),
      child: Column(
        children: [
          const Spacer(),
          Text(
            _formatDuration(elapsed),
            style: theme.textTheme.displayLarge?.copyWith(
              fontSize: 72,
              fontWeight: FontWeight.w300,
              fontFeatures: [const FontFeature.tabularFigures()],
            ),
          ),
          const Spacer(),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              FloatingActionButton.large(
                heroTag: 'reset',
                onPressed: elapsed.inMilliseconds > 0 ? _reset : null,
                backgroundColor: theme.colorScheme.secondaryContainer,
                foregroundColor: theme.colorScheme.onSecondaryContainer,
                elevation: 0,
                child: const Icon(Icons.refresh),
              ),
              const SizedBox(width: 32),
              FloatingActionButton.large(
                heroTag: 'play',
                onPressed: _startStop,
                backgroundColor: _stopwatch.isRunning ? theme.colorScheme.tertiary : theme.colorScheme.primary,
                foregroundColor: _stopwatch.isRunning ? theme.colorScheme.onTertiary : theme.colorScheme.onPrimary,
                child: Icon(_stopwatch.isRunning ? Icons.pause : Icons.play_arrow),
              ),
              const SizedBox(width: 32),
              FloatingActionButton.large(
                heroTag: 'lap',
                onPressed: _stopwatch.isRunning ? _lap : null,
                backgroundColor: theme.colorScheme.secondaryContainer,
                foregroundColor: theme.colorScheme.onSecondaryContainer,
                elevation: 0,
                child: const Icon(Icons.flag),
              ),
            ],
          ),
          const SizedBox(height: 32),
          Expanded(
            flex: 2,
            child: ListView.builder(
              itemCount: _laps.length,
              itemBuilder: (context, index) {
                final lapTime = _laps[index];
                return ListTile(
                  leading: Text('Lap ${_laps.length - index}'),
                  trailing: Text(
                    _formatDuration(lapTime),
                    style: const TextStyle(fontFamily: 'monospace', fontSize: 18),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
