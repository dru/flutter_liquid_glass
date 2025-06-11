import 'package:flutter/material.dart';
import 'package:flutter_shaders/flutter_shaders.dart';

void main() {
  runApp(const ExampleApp());
}

class ExampleApp extends StatefulWidget {
  const ExampleApp({super.key});

  @override
  State<ExampleApp> createState() => _ExampleAppState();
}

class _ExampleAppState extends State<ExampleApp> {
  double _value = 2.0;

  void _onChanged(double newValue) {
    setState(() {
      _value = newValue;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(title: Text('Liquid Glass!')),
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              SampledText(text: 'This is some sampled text', value: _value),
              Slider(value: _value, onChanged: _onChanged, min: 2, max: 150),
            ],
          ),
        ),
      ),
    );
  }
}

class SampledText extends StatelessWidget {
  const SampledText({super.key, required this.text, required this.value});

  final String text;
  final double value;

  @override
  Widget build(BuildContext context) {
    return ShaderBuilder((context, shader, child) {
      return AnimatedSampler(
        (image, size, canvas) {
          shader.setFloatUniforms((uniforms) {
            uniforms
              ..setFloat(value)
              ..setFloat(value)
              ..setSize(size);
          });

          shader.setImageSampler(0, image);

          canvas.drawRect(
            Rect.fromLTWH(0, 0, size.width, size.height),
            Paint()..shader = shader,
          );
        },
        child: Container(
          color: Colors.white,
          height: 300,
          width: 500,
          child: ListView(children: [
            Text(text, style: TextStyle(fontSize: 70)),
            Text(text, style: TextStyle(fontSize: 60)),
            Text(text, style: TextStyle(fontSize: 50)),
            Text(text, style: TextStyle(fontSize: 70)),
            Text(text, style: TextStyle(fontSize: 60)),
            Text(text, style: TextStyle(fontSize: 50)),
            Text(text, style: TextStyle(fontSize: 70)),
            Text(text, style: TextStyle(fontSize: 60)),
            Text(text, style: TextStyle(fontSize: 50)),
          ]),
        ),
      );
    }, assetKey: 'shaders/v.frag');
  }
}
