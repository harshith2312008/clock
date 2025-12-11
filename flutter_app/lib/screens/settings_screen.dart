import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/theme_provider.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: Consumer<ThemeProvider>(
        builder: (context, theme, child) {
          return ListView(
            children: [
              ListTile(
                title: const Text('Theme'),
                trailing: DropdownButton<ThemeMode>(
                  value: theme.themeMode,
                  onChanged: (val) {
                    if (val != null) theme.setThemeMode(val);
                  },
                  underline: Container(),
                  items: const [
                    DropdownMenuItem(value: ThemeMode.system, child: Text('System')),
                    DropdownMenuItem(value: ThemeMode.light, child: Text('Light')),
                    DropdownMenuItem(value: ThemeMode.dark, child: Text('Dark')),
                  ],
                ),
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.info_outline),
                title: const Text('About'),
                subtitle: const Text('Flutter Clock App v1.0'),
              ),
            ],
          );
        },
      ),
    );
  }
}
