// Copyright 2013 The Flutter Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
#version 460 core

precision highp float;

#include <flutter/runtime_effect.glsl>

uniform vec2 uPixels;
uniform vec2 uSize;
uniform sampler2D uTexture;

out vec4 fragColor;

// void main() {
//   vec2 uv = FlutterFragCoord().xy / uSize;
//   vec2 puv = round(uv * uPixels) / uPixels;
//   fragColor = texture(uTexture, puv);
// }

#define PI    3.14159265
#define S     smoothstep
#define PX(a) a/uSize.y

mat2 Rot (float a) {
    return mat2(cos(a), sin(-a), sin(a), cos(a)); 
}

float Box (vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float IconPhoto (vec2 uv) {
    float c = 0.0;
    for (float i = 0.0; i < 1.0; i+=1.0/8.0) {
        vec2 u = uv;
        u *= Rot(i * 2.0 * PI);
        u += vec2(0.0, PX(40.0));
        float b = Box(u, vec2(PX(0.0), PX(13.0)));
        c += S(PX(1.5), 0.0, b - PX(15.0)) * 0.2;
    }
    
    return c;
}

vec4 LiquidGlass (sampler2D tex, vec2 uv, float direction, float quality, float size) {
   
    // vec2 radius = size / uSize;
    vec4 color = texture(tex, uv);
    
    // for (float d = 0.0; d < PI; d += PI/direction) {
	// 	for (float i = 1.0 / quality; i <= 1.0; i += 1.0/quality) {
	// 		color += texture(tex, uv + vec2(cos(d),sin(d)) * radius * i);		
    //     }
    // }
    
    // color /= quality * direction;
    return color;
}

vec4 Icon (vec2 uv) {
    float box = Box(uv, vec2(PX(50.0))),
          boxShape = S(PX(1.5), 0.0, box - PX(50.0)),
          boxDisp = S(PX(35.0), 0.0, box - PX(25.0)),
          boxLight = boxShape * S(0.0, PX(30.0), box - PX(40.0)),
          icon = IconPhoto(uv);
    return vec4(boxShape, boxDisp, boxLight, 0.0);
}

void main() {
    vec3 iMouse = vec3(uPixels, 1.0);

    vec2 I = FlutterFragCoord().xy;

    vec2 uv = I / uSize;

    vec2 puv = round(uv * uPixels) / uPixels;

    vec2 st = (I - 0.5 * uSize) / uSize.y;

    vec2 M  = iMouse.z > 0.0 ? (iMouse.xy - 0.5 * uSize) / uSize.y : vec2(0.);
    
    vec4 icon = Icon( st - M);
    
    vec2 uv2 = uv - iMouse.xy/uSize;
    uv2 *= S(-0.6, 1.0, icon.y);
    uv2 += iMouse.xy / uSize;
    
   
    float size = 10.0;
    float quality = 10.0;
    float direction = 10.0;

    vec2 radius = size / uSize;
    vec4 color = texture(uTexture, uv);

    float step0 = 3.1415 / direction;

    // float d = 0.0;
    // float i = 1.0 / quality;
    
    for (float d = 0.0; d < 3.1415; d += 0.31415) {
    // for (float i = 0; i < 10; i += 0.5) {
		for (float i = 0.1; i <= 1.0; i += 0.1) {
			color += texture(uTexture, uv2 + vec2(cos(d), sin(d)) * radius * i);		
        }
    }
    
    color /= quality * direction;

    vec3 col = mix(texture(uTexture, uv).rgb * 0.8, 0.1 + color.rgb * 0.7, icon.x);

    float alpha = texture(uTexture, uv).a;

    col += icon.z * .9 + icon.w;
    
    fragColor = vec4(col, 1.0);
    // fragColor = texture(uTexture, uv);
}