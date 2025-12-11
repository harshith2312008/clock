import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/alarm_model.dart';
import '../providers/alarm_provider.dart';

class AlarmScreen extends StatelessWidget {
  const AlarmScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAlarmEditor(context),
        child: const Icon(Icons.add),
      ),
      body: Consumer<AlarmProvider>(
        builder: (context, provider, child) {
          if (provider.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          
          if (provider.alarms.isEmpty) {
            return Center(
              child: Text(
                'No alarms set',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Theme.of(context).colorScheme.outline,
                ),
              ),
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: provider.alarms.length,
            itemBuilder: (context, index) {
              final alarm = provider.alarms[index];
              return Dismissible(
                key: Key(alarm.id),
                direction: DismissDirection.endToStart,
                background: Container(
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(right: 24),
                  color: Theme.of(context).colorScheme.errorContainer,
                  child: Icon(Icons.delete, color: Theme.of(context).colorScheme.onErrorContainer),
                ),
                onDismissed: (_) {
                  provider.deleteAlarm(alarm.id);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Alarm deleted')),
                  );
                },
                child: Card(
                  elevation: 0,
                  color: Theme.of(context).colorScheme.surfaceVariant,
                  margin: const EdgeInsets.only(bottom: 12),
                  child: SwitchListTile(
                    value: alarm.isActive,
                    onChanged: (val) => provider.toggleAlarm(alarm.id, val),
                    title: Text(
                      alarm.time,
                      style: Theme.of(context).textTheme.displaySmall?.copyWith(
                        color: alarm.isActive 
                          ? Theme.of(context).colorScheme.onSurfaceVariant 
                          : Theme.of(context).colorScheme.onSurfaceVariant.withOpacity(0.5),
                      ),
                    ),
                    subtitle: Text(
                      alarm.label + (alarm.days.isNotEmpty ? ' • ${_formatDays(alarm.days)}' : ''),
                    ),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }

  String _formatDays(List<int> days) {
    if (days.length == 7) return 'Every day';
    const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    return days.map((d) => weekdays[d]).join(' ');
  }

  void _showAlarmEditor(BuildContext context, [Alarm? existing]) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) => AlarmEditor(alarm: existing),
    );
  }
}

class AlarmEditor extends StatefulWidget {
  final Alarm? alarm;
  const AlarmEditor({Key? key, this.alarm}) : super(key: key);

  @override
  State<AlarmEditor> createState() => _AlarmEditorState();
}

class _AlarmEditorState extends State<AlarmEditor> {
  TimeOfDay _time = TimeOfDay.now();
  final TextEditingController _labelController = TextEditingController(text: 'Alarm');
  final Set<int> _selectedDays = {};

  @override
  void initState() {
    super.initState();
    if (widget.alarm != null) {
      final parts = widget.alarm!.time.split(':');
      _time = TimeOfDay(hour: int.parse(parts[0]), minute: int.parse(parts[1]));
      _labelController.text = widget.alarm!.label;
      _selectedDays.addAll(widget.alarm!.days);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Padding(
      padding: EdgeInsets.only(
        bottom: MediaQuery.of(context).viewInsets.bottom,
        left: 24,
        right: 24,
        top: 24,
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Text(widget.alarm == null ? 'New Alarm' : 'Edit Alarm', style: theme.textTheme.headlineSmall),
          const SizedBox(height: 24),
          
          InkWell(
            onTap: () async {
              final picked = await showTimePicker(context: context, initialTime: _time);
              if (picked != null) setState(() => _time = picked);
            },
            child: Text(
              _time.format(context),
              textAlign: TextAlign.center,
              style: theme.textTheme.displayLarge?.copyWith(fontSize: 64),
            ),
          ),
          
          const SizedBox(height: 24),
          TextField(
            controller: _labelController,
            decoration: const InputDecoration(labelText: 'Label', border: OutlineInputBorder()),
          ),
          
          const SizedBox(height: 24),
          // Days
          Wrap(
            spacing: 8,
            alignment: WrapAlignment.center,
            children: List.generate(7, (index) {
              final isSelected = _selectedDays.contains(index);
              return FilterChip(
                label: Text(['S', 'M', 'T', 'W', 'T', 'F', 'S'][index]),
                selected: isSelected,
                onSelected: (val) {
                  setState(() {
                    if (val) _selectedDays.add(index);
                    else _selectedDays.remove(index);
                  });
                },
              );
            }),
          ),
          
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
              const SizedBox(width: 8),
              FilledButton(
                onPressed: () {
                  final timeStr = '${_time.hour.toString().padLeft(2,'0')}:${_time.minute.toString().padLeft(2,'0')}';
                  final alarm = Alarm(
                    id: widget.alarm?.id ?? DateTime.now().millisecondsSinceEpoch.toString(),
                    time: timeStr,
                    label: _labelController.text,
                    days: _selectedDays.toList()..sort(),
                    isActive: true,
                  );
                  
                  final provider = Provider.of<AlarmProvider>(context, listen: false);
                  if (widget.alarm == null) {
                    provider.addAlarm(alarm);
                  } else {
                    provider.updateAlarm(alarm);
                  }
                  Navigator.pop(context);
                },
                child: const Text('Save'),
              ),
            ],
          ),
          const SizedBox(height: 24),
        ],
      ),
    );
  }
}
