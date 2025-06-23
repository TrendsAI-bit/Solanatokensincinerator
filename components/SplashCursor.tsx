'use client';
import { useEffect, useRef } from 'react';

function SplashCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Simplified fluid simulation for cursor effect
    let gl;
    let program;
    let buffer;
    let pointers = [];
    let animationId;

    // Initialize WebGL
    function initGL() {
      gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return false;

      const vertexShader = createShader(gl.VERTEX_SHADER, `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `);

      const fragmentShader = createShader(gl.FRAGMENT_SHADER, `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform vec2 u_mouse;
        uniform float u_time;
        
        void main() {
          vec2 st = gl_FragCoord.xy / u_resolution.xy;
          vec2 mouse = u_mouse / u_resolution.xy;
          
          float dist = distance(st, mouse);
          float intensity = 1.0 - smoothstep(0.0, 0.15, dist);
          
          // Space-themed colors
          vec3 color1 = vec3(0.42, 0.27, 0.76); // stellar-purple
          vec3 color2 = vec3(0.93, 0.28, 0.60); // nebula-pink
          vec3 color3 = vec3(0.02, 0.71, 0.83); // cosmic-cyan
          
          vec3 finalColor = mix(color1, color2, sin(u_time * 2.0 + dist * 10.0) * 0.5 + 0.5);
          finalColor = mix(finalColor, color3, cos(u_time * 1.5 + dist * 8.0) * 0.3 + 0.3);
          
          gl_FragColor = vec4(finalColor, intensity * 0.6);
        }
      `);

      program = createProgram(vertexShader, fragmentShader);
      
      // Create buffer for fullscreen quad
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        -1, -1, 1, -1, -1, 1, 1, 1
      ]), gl.STATIC_DRAW);

      return true;
    }

    function createShader(type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    }

    function createProgram(vertexShader, fragmentShader) {
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
      }
      return program;
    }

    function resizeCanvas() {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function render(time) {
      if (!gl || !program) return;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      // Set uniforms
      const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
      const mouseLocation = gl.getUniformLocation(program, 'u_mouse');
      const timeLocation = gl.getUniformLocation(program, 'u_time');

      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform2f(mouseLocation, mouseX || 0, mouseY || 0);
      gl.uniform1f(timeLocation, time * 0.001);

      // Draw
      const positionLocation = gl.getAttribLocation(program, 'position');
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationId = requestAnimationFrame(render);
    }

    let mouseX = 0;
    let mouseY = 0;

    function handleMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) * window.devicePixelRatio;
      mouseY = (rect.height - (e.clientY - rect.top)) * window.devicePixelRatio;
    }

    function handleTouchMove(e) {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseX = (touch.clientX - rect.left) * window.devicePixelRatio;
      mouseY = (rect.height - (touch.clientY - rect.top)) * window.devicePixelRatio;
    }

    // Initialize
    if (initGL()) {
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      
      render(0);
    }

    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block',
        }}
      />
    </div>
  );
}

export default SplashCursor;
