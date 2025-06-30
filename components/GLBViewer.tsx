import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Platform } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer, Scene, PerspectiveCamera, AmbientLight, DirectionalLight } from 'expo-three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';
import { RotateCcw, ZoomIn, ZoomOut, Rotate3d as RotateLeft, Rotate3d as RotateRight } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

interface GLBViewerProps {
  modelUrl: string;
  style?: any;
}

export default function GLBViewer({ modelUrl, style }: GLBViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const cameraRef = useRef<PerspectiveCamera | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const animationRef = useRef<number | null>(null);

  // Camera controls
  const [cameraDistance, setCameraDistance] = useState(5);
  const [rotationY, setRotationY] = useState(0);
  const [rotationX, setRotationX] = useState(0);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const onContextCreate = async (gl: any) => {
    try {
      setLoading(true);
      setError(null);

      // Create renderer
      const renderer = new Renderer({ gl });
      renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;

      // Create scene
      const scene = new Scene();
      sceneRef.current = scene;

      // Create camera
      const camera = new PerspectiveCamera(
        75,
        gl.drawingBufferWidth / gl.drawingBufferHeight,
        0.1,
        1000
      );
      camera.position.set(0, 0, cameraDistance);
      cameraRef.current = camera;

      // Add lights
      const ambientLight = new AmbientLight(0x404040, 0.6);
      scene.add(ambientLight);

      const directionalLight = new DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);

      const directionalLight2 = new DirectionalLight(0xffffff, 0.4);
      directionalLight2.position.set(-1, -1, -1);
      scene.add(directionalLight2);

      // Load GLB model
      if (Platform.OS === 'web') {
        // For web, we'll show a placeholder since GLTFLoader might not work properly
        createPlaceholderModel(scene);
      } else {
        await loadGLBModel(scene, modelUrl);
      }

      setLoading(false);

      // Start render loop
      const render = () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          // Update camera position based on controls
          const camera = cameraRef.current;
          camera.position.x = cameraDistance * Math.sin(rotationY) * Math.cos(rotationX);
          camera.position.y = cameraDistance * Math.sin(rotationX);
          camera.position.z = cameraDistance * Math.cos(rotationY) * Math.cos(rotationX);
          camera.lookAt(0, 0, 0);

          // Rotate model slowly
          if (modelRef.current) {
            modelRef.current.rotation.y += 0.005;
          }

          rendererRef.current.render(sceneRef.current, camera);
          gl.endFrameEXP();
        }
        animationRef.current = requestAnimationFrame(render);
      };
      render();

    } catch (err) {
      console.error('Error setting up 3D scene:', err);
      setError('Failed to load 3D model');
      setLoading(false);
    }
  };

  const loadGLBModel = async (scene: Scene, url: string) => {
    try {
      const loader = new GLTFLoader();
      
      // For demo purposes, create a placeholder model
      // In production, you would load the actual GLB file
      createPlaceholderModel(scene);
      
      // Uncomment this for actual GLB loading:
      /*
      loader.load(
        url,
        (gltf) => {
          const model = gltf.scene;
          
          // Scale and position the model
          const box = new THREE.Box3().setFromObject(model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 2 / maxDim;
          model.scale.setScalar(scale);
          
          model.position.sub(center.multiplyScalar(scale));
          
          scene.add(model);
          modelRef.current = model;
        },
        (progress) => {
          console.log('Loading progress:', progress);
        },
        (error) => {
          console.error('Error loading GLB:', error);
          createPlaceholderModel(scene);
        }
      );
      */
    } catch (error) {
      console.error('Error in loadGLBModel:', error);
      createPlaceholderModel(scene);
    }
  };

  const createPlaceholderModel = (scene: Scene) => {
    // Create a placeholder heart-like shape
    const group = new THREE.Group();
    
    // Main body (sphere)
    const bodyGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff6b6b,
      shininess: 30
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.scale.set(1, 1.2, 0.8);
    group.add(body);

    // Left atrium
    const leftAtriumGeometry = new THREE.SphereGeometry(0.4, 16, 16);
    const leftAtriumMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xff8a8a,
      shininess: 30
    });
    const leftAtrium = new THREE.Mesh(leftAtriumGeometry, leftAtriumMaterial);
    leftAtrium.position.set(-0.6, 0.6, 0.2);
    group.add(leftAtrium);

    // Right atrium
    const rightAtrium = new THREE.Mesh(leftAtriumGeometry, leftAtriumMaterial);
    rightAtrium.position.set(0.6, 0.6, 0.2);
    group.add(rightAtrium);

    // Aorta (cylinder)
    const aortaGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 8);
    const aortaMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffaaaa,
      shininess: 30
    });
    const aorta = new THREE.Mesh(aortaGeometry, aortaMaterial);
    aorta.position.set(0, 1.2, 0);
    aorta.rotation.z = Math.PI * 0.1;
    group.add(aorta);

    scene.add(group);
    modelRef.current = group;
  };

  const resetView = () => {
    setCameraDistance(5);
    setRotationY(0);
    setRotationX(0);
  };

  const zoomIn = () => {
    setCameraDistance(prev => Math.max(prev - 0.5, 1));
  };

  const zoomOut = () => {
    setCameraDistance(prev => Math.min(prev + 0.5, 10));
  };

  const rotateLeft = () => {
    setRotationY(prev => prev - 0.2);
  };

  const rotateRight = () => {
    setRotationY(prev => prev + 0.2);
  };

  if (error) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <GLView
        style={styles.glView}
        onContextCreate={onContextCreate}
      />
      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4FACFE" />
          <Text style={styles.loadingText}>Loading 3D Model...</Text>
        </View>
      )}

      {/* 3D Controls */}
      <View style={styles.controlsContainer}>
        <BlurView intensity={20} tint="dark" style={styles.controlsBlur}>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={resetView}>
              <RotateCcw size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={zoomIn}>
              <ZoomIn size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={zoomOut}>
              <ZoomOut size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={rotateLeft}>
              <RotateLeft size={20} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={rotateRight}>
              <RotateRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  glView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 16,
    textAlign: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  controlsBlur: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});