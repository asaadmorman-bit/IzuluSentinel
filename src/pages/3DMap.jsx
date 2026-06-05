
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Play, Pause, RotateCw, ZoomIn, ZoomOut, X, Navigation, Layers } from "lucide-react";
import { Incident, Asset, TravelRoute } from "@/entities/all";
import { format } from "date-fns";
import * as THREE from "three";

export default function ThreeDMap() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  
  const [mapStyle, setMapStyle] = useState("satellite");
  const [isPlaying, setIsPlaying] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [assets, setAssets] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedObject, setSelectedObject] = useState(null);
  const [hoveredObject, setHoveredObject] = useState(null);
  const [centerLat, setCenterLat] = useState(40.7128);
  const [centerLng, setCenterLng] = useState(-74.0060);
  const [zoomLevel, setZoomLevel] = useState(13);
  const [showLayers, setShowLayers] = useState({ threats: true, assets: true, routes: true });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [incidentsData, assetsData, routesData] = await Promise.all([
        Incident.list("-created_date", 100),
        Asset.list("-last_check_in", 50),
        TravelRoute.list("-departure_time", 20)
      ]);
      setIncidents(incidentsData);
      setAssets(assetsData);
      setRoutes(routesData);
      
      if (incidentsData.length > 0 && incidentsData[0].latitude && incidentsData[0].longitude) {
        setCenterLat(incidentsData[0].latitude);
        setCenterLng(incidentsData[0].longitude);
      } else if (assetsData.length > 0 && assetsData[0].latitude && assetsData[0].longitude) {
        setCenterLat(assetsData[0].latitude);
        setCenterLng(assetsData[0].longitude);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount || isLoading) return;

    const latLngToPosition = (lat, lng) => {
      const latOffset = lat - centerLat;
      const lngOffset = lng - centerLng;
      const scale = Math.pow(2, zoomLevel - 10) * 50;
      const x = lngOffset * scale;
      const z = -latOffset * scale;
      const y = 0.5;
      return new THREE.Vector3(x, y, z);
    };

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB);
    scene.fog = new THREE.Fog(0x87CEEB, 200, 500);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      60,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      2000
    );
    camera.position.set(0, 100, 150);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const mapSize = 400;
    const tileGeometry = new THREE.PlaneGeometry(mapSize, mapSize, 50, 50);
    
    const vertices = tileGeometry.attributes.position;
    for (let i = 0; i < vertices.count; i++) {
      const x = vertices.getX(i);
      const y = vertices.getY(i);
      const elevation = 
        Math.sin(x * 0.02) * Math.cos(y * 0.02) * 3 +
        Math.sin(x * 0.05) * 2 +
        Math.cos(y * 0.03) * 1.5;
      vertices.setZ(i, elevation);
    }
    tileGeometry.computeVertexNormals();

    const textureLoader = new THREE.TextureLoader();
    const zoom = Math.min(Math.floor(zoomLevel), 18);
    const tileX = Math.floor((centerLng + 180) / 360 * Math.pow(2, zoom));
    const tileY = Math.floor((1 - Math.log(Math.tan(centerLat * Math.PI / 180) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    
    let tileUrl = '';
    if (mapStyle === 'satellite') {
      tileUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`;
    } else if (mapStyle === 'street') {
      tileUrl = `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
    } else if (mapStyle === 'terrain') {
      tileUrl = `https://stamen-tiles.a.ssl.fastly.net/terrain/${zoom}/${tileX}/${tileY}.jpg`;
    }

    const tileMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      shininess: 10
    });

    textureLoader.load(
      tileUrl,
      (texture) => {
        tileMaterial.map = texture;
        tileMaterial.needsUpdate = true;
      },
      undefined,
      () => {
        tileMaterial.color.setHex(0x3a5a3a);
      }
    );

    const mapPlane = new THREE.Mesh(tileGeometry, tileMaterial);
    mapPlane.rotation.x = -Math.PI / 2;
    mapPlane.receiveShadow = true;
    scene.add(mapPlane);

    const gridHelper = new THREE.GridHelper(mapSize, 50, 0x444444, 0x222222);
    gridHelper.position.y = 0.1;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.2;
    scene.add(gridHelper);

    // Add city buildings
    const buildingGroup = new THREE.Group();
    for (let i = 0; i < 40; i++) {
      const height = 5 + Math.random() * 25;
      const width = 3 + Math.random() * 6;
      const depth = 3 + Math.random() * 6;
      
      const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      const buildingMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888 + Math.floor(Math.random() * 0x333333),
        flatShading: true
      });
      
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.x = (Math.random() - 0.5) * mapSize * 0.7;
      building.position.z = (Math.random() - 0.5) * mapSize * 0.7;
      building.position.y = height / 2;
      building.castShadow = true;
      building.receiveShadow = true;
      
      buildingGroup.add(building);
    }
    scene.add(buildingGroup);

    const clickableObjects = [];

    const createThreatMarker = (incident) => {
      if (!incident.latitude || !incident.longitude) return;

      const position = latLngToPosition(incident.latitude, incident.longitude);
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(position);

      const pinHeight = incident.severity === 'critical' ? 8 : 
                       incident.severity === 'high' ? 6 : 4;
      
      const headGeometry = new THREE.SphereGeometry(1, 16, 16);
      const color = incident.severity === 'critical' ? 0xDC2626 :
                    incident.severity === 'high' ? 0xF59E0B :
                    incident.severity === 'medium' ? 0xFBBF24 : 0x06B6D4;
      
      const headMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        shininess: 100
      });
      
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = pinHeight;
      head.castShadow = true;
      markerGroup.add(head);

      const stemGeometry = new THREE.CylinderGeometry(0.3, 0.3, pinHeight, 8);
      const stemMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.4
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = pinHeight / 2;
      stem.castShadow = true;
      markerGroup.add(stem);

      if (incident.severity === 'critical') {
        const ringGeometry = new THREE.RingGeometry(2.5, 3, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xDC2626,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.1;
        markerGroup.add(ring);
        ring.userData.animate = true;
        ring.userData.scale = 1;
      }

      // Create a canvas for multi-line text label
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 256; // Increased height for more information
      
      context.fillStyle = 'rgba(0, 0, 0, 0.8)';
      context.beginPath();
      context.roundRect(10, 10, 492, 236, 10); // Adjusted roundRect height
      context.fill();

      context.textAlign = 'center';
      
      // Title
      context.fillStyle = '#ffffff';
      context.font = 'Bold 36px Arial';
      const titleText = incident.title?.substring(0, 25) || 'Threat';
      context.fillText(titleText, 256, 50);

      // Severity
      context.font = '24px Arial';
      let severityColor;
      switch (incident.severity) {
        case 'critical': severityColor = '#DC2626'; break;
        case 'high': severityColor = '#F59E0B'; break;
        case 'medium': severityColor = '#FBBF24'; break;
        default: severityColor = '#06B6D4'; break; // low or unknown
      }
      context.fillStyle = severityColor;
      const severityDisplay = (incident.severity?.toUpperCase() || 'UNKNOWN') + ' ALERT';
      context.fillText(severityDisplay, 256, 90);

      // Short description
      context.fillStyle = '#ffffff'; // Reset color for description
      context.font = '18px Arial';
      const description = incident.description || '';
      
      const maxTextWidth = 450; // Max width for description lines
      const words = description.split(' ');
      let currentLine = '';
      const lines = [];
      
      for (let i = 0; i < words.length; i++) {
        const testLine = currentLine + words[i] + ' ';
        if (context.measureText(testLine).width < maxTextWidth) {
          currentLine = testLine;
        } else {
          lines.push(currentLine.trim());
          currentLine = words[i] + ' ';
        }
      }
      lines.push(currentLine.trim());

      let lineHeight = 22;
      let startY = 130;
      for (let i = 0; i < Math.min(lines.length, 3); i++) { // Limit to 3 lines
        context.fillText(lines[i], 256, startY + i * lineHeight);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(24, 12, 1); // Adjusted scale to fit new canvas size and content
      label.position.y = pinHeight + 7; // Adjusted position higher up
      markerGroup.add(label);

      markerGroup.userData = { type: 'threat', data: incident };
      clickableObjects.push(head);
      head.userData = markerGroup.userData;
      scene.add(markerGroup);
    };

    const createAssetMarker = (asset) => {
      if (!asset.latitude || !asset.longitude) return;

      const position = latLngToPosition(asset.latitude, asset.longitude);
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(position);

      const geometry = new THREE.CylinderGeometry(0.7, 0.7, 4, 16);
      const color = asset.status === 'safe' ? 0x10B981 :
                    asset.status === 'at_risk' ? 0xF59E0B :
                    asset.status === 'emergency' ? 0xDC2626 : 0x06B6D4;
      
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        shininess: 80
      });
      
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.y = 2;
      cylinder.castShadow = true;
      markerGroup.add(cylinder);

      const headGeometry = new THREE.SphereGeometry(0.8, 16, 16);
      const head = new THREE.Mesh(headGeometry, material);
      head.position.y = 4.8;
      head.castShadow = true;
      markerGroup.add(head);

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 128;
      context.fillStyle = 'rgba(0, 0, 0, 0.8)';
      context.beginPath();
      context.roundRect(10, 10, 492, 108, 10);
      context.fill();
      context.fillStyle = '#ffffff';
      context.font = 'Bold 32px Arial';
      context.textAlign = 'center';
      context.fillText(asset.name?.substring(0, 25) || 'Asset', 256, 70);
      
      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(16, 4, 1);
      label.position.y = 7;
      markerGroup.add(label);

      markerGroup.userData = { type: 'asset', data: asset };
      clickableObjects.push(head);
      head.userData = markerGroup.userData;
      scene.add(markerGroup);
    };

    const createRoute = (route) => {
      if (!route.start_lat || !route.start_lng || !route.end_lat || !route.end_lng) return;

      const startPos = latLngToPosition(route.start_lat, route.start_lng);
      const endPos = latLngToPosition(route.end_lat, route.end_lng);

      const curve = new THREE.QuadraticBezierCurve3(
        startPos,
        new THREE.Vector3(
          (startPos.x + endPos.x) / 2,
          Math.max(startPos.y, endPos.y) + 12,
          (startPos.z + endPos.z) / 2
        ),
        endPos
      );

      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      
      const color = route.risk_level === 'critical' ? 0xDC2626 :
                    route.risk_level === 'high' ? 0xF59E0B : 
                    route.risk_level === 'medium' ? 0xFBBF24 : 0x10B981;
      
      const tubeGeometry = new THREE.TubeGeometry(curve, 50, 0.4, 8, false);
      const tubeMaterial = new THREE.MeshPhongMaterial({
        color: color,
        transparent: true,
        opacity: 0.8,
        emissive: color,
        emissiveIntensity: 0.4
      });
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      scene.add(tube);

      const startFlagGeometry = new THREE.ConeGeometry(1.2, 5, 4);
      const startFlagMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x10B981,
        emissive: 0x10B981,
        emissiveIntensity: 0.6
      });
      const startFlag = new THREE.Mesh(startFlagGeometry, startFlagMaterial);
      startFlag.position.copy(startPos);
      startFlag.position.y += 2.5;
      startFlag.castShadow = true;
      scene.add(startFlag);

      const endFlagGeometry = new THREE.ConeGeometry(1.2, 5, 4);
      const endFlagMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xDC2626,
        emissive: 0xDC2626,
        emissiveIntensity: 0.6
      });
      const endFlag = new THREE.Mesh(endFlagGeometry, endFlagMaterial);
      endFlag.position.copy(endPos);
      endFlag.position.y += 2.5;
      endFlag.castShadow = true;
      scene.add(endFlag);
    };

    if (showLayers.threats) {
      incidents.forEach(createThreatMarker);
    }
    
    if (showLayers.assets) {
      assets.forEach(createAssetMarker);
    }
    
    if (showLayers.routes) {
      routes.forEach(createRoute);
    }

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(clickableObjects, false);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        setSelectedObject(object.userData);
      }
    };

    const onMouseMove = (event) => {
      if (isDragging) {
        const deltaX = event.clientX - previousMousePosition.x;
        const deltaY = event.clientY - previousMousePosition.y;
        
        const rotationSpeed = 0.005;
        camera.position.x += deltaX * rotationSpeed * camera.position.z / 50;
        camera.position.z -= deltaY * rotationSpeed * camera.position.z / 50;
        camera.lookAt(0, 0, 0);
      }
      
      previousMousePosition = { x: event.clientX, y: event.clientY };

      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(clickableObjects, false);

      if (intersects.length > 0) {
        renderer.domElement.style.cursor = 'pointer';
        setHoveredObject(intersects[0].object.userData);
      } else {
        renderer.domElement.style.cursor = 'grab';
        setHoveredObject(null);
      }
    };

    const onMouseDown = () => { 
      isDragging = true;
      renderer.domElement.style.cursor = 'grabbing';
    };
    
    const onMouseUp = () => { 
      isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    };

    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    const onWheel = (e) => {
      e.preventDefault();
      const zoomSpeed = e.deltaY * 0.1;
      camera.position.y += zoomSpeed;
      camera.position.z += zoomSpeed * 0.5;
      camera.position.y = Math.max(10, Math.min(300, camera.position.y));
      camera.position.z = Math.max(20, Math.min(300, camera.position.z));
      camera.lookAt(0, 0, 0);
    };
    renderer.domElement.addEventListener('wheel', onWheel, { passive: false });

    let time = 0;
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      time += 0.01;

      if (isPlaying) {
        scene.rotation.y += 0.0005;
      }

      scene.traverse((object) => {
        if (object.userData.animate) {
          object.userData.scale = 1 + Math.sin(time * 2) * 0.2;
          object.scale.set(object.userData.scale, 1, object.userData.scale);
          object.material.opacity = 0.4 + Math.sin(time * 2) * 0.2;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isPlaying, incidents, assets, routes, isLoading, centerLat, centerLng, zoomLevel, mapStyle, showLayers]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(0, 100, 150);
      cameraRef.current.lookAt(0, 0, 0);
    }
    if (sceneRef.current) {
      sceneRef.current.rotation.set(0, 0, 0);
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.y -= 15;
      cameraRef.current.position.z -= 10;
      cameraRef.current.position.y = Math.max(10, cameraRef.current.position.y);
      cameraRef.current.position.z = Math.max(20, cameraRef.current.position.z);
      cameraRef.current.lookAt(0, 0, 0);
    }
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.y += 15;
      cameraRef.current.position.z += 10;
      cameraRef.current.position.y = Math.min(300, cameraRef.current.position.y);
      cameraRef.current.position.z = Math.min(300, cameraRef.current.position.z);
      cameraRef.current.lookAt(0, 0, 0);
    }
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  const handleLocationSearch = () => {
    loadData();
  };

  const toggleLayer = (layer) => {
    setShowLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const mapStyles = [
    { name: "Satellite View", value: "satellite", icon: "🛰️", desc: "High-resolution satellite imagery" },
    { name: "Street Map", value: "street", icon: "🗺️", desc: "Detailed street-level mapping" },
    { name: "Terrain View", value: "terrain", icon: "⛰️", desc: "Topographic terrain visualization" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <MapPin className="w-8 h-8 text-[#DC2626]" />
            3D Geographic Intelligence Map
          </h1>
          <p className="text-gray-400">Advanced 3D terrain mapping with real-time threat intelligence overlay</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <MapPin className="w-8 h-8 text-red-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Threats Visualized</p>
              <p className="text-3xl font-bold text-white">{incidents.length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Navigation className="w-8 h-8 text-cyan-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Assets Tracked</p>
              <p className="text-3xl font-bold text-white">{assets.length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Layers className="w-8 h-8 text-emerald-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Active Routes</p>
              <p className="text-3xl font-bold text-white">{routes.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-0">
                <div 
                  ref={mountRef} 
                  className="w-full h-[700px] rounded-t-lg relative overflow-hidden"
                >
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                      <div className="text-center">
                        <MapPin className="w-24 h-24 text-gray-700 mx-auto mb-4 animate-pulse" />
                        <p className="text-gray-500">Loading 3D map data...</p>
                      </div>
                    </div>
                  )}
                  
                  {hoveredObject && !selectedObject && (
                    <div className="absolute top-4 left-4 bg-[#000000]/90 border border-[#2a2a2a] rounded-lg p-3 max-w-xs z-10">
                      <p className="text-white font-semibold text-sm">
                        {hoveredObject.type === 'threat' ? hoveredObject.data.title : hoveredObject.data.name}
                      </p>
                      <p className="text-gray-400 text-xs">Click for detailed information</p>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 bg-[#000000]/90 border border-[#2a2a2a] rounded-lg p-2 z-10">
                    <p className="text-white text-xs font-mono">
                      📍 {centerLat.toFixed(6)}°N, {centerLng.toFixed(6)}°W | Zoom: {zoomLevel}x
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 bg-[#000000]/90 border border-[#2a2a2a] rounded-lg p-3 z-10">
                    <p className="text-white text-xs font-semibold mb-2">Legend</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-300">Critical Threat</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <span className="text-xs text-gray-300">High Threat</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-gray-300">Protected Asset</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-[#1a1a1a] flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                      {isPlaying ? 'Pause' : 'Auto-Rotate'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-[#2a2a2a] text-white hover:bg-[#2a2a2a]"
                      onClick={handleReset}
                    >
                      <RotateCw className="w-4 h-4 mr-1" />
                      Reset View
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                      onClick={handleZoomOut}
                    >
                      <ZoomOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Map Center
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Latitude</label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={centerLat}
                    onChange={(e) => setCenterLat(parseFloat(e.target.value) || 0)}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Longitude</label>
                  <Input
                    type="number"
                    step="0.000001"
                    value={centerLng}
                    onChange={(e) => setCenterLng(parseFloat(e.target.value) || 0)}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white text-sm"
                  />
                </div>
                <Button 
                  onClick={handleLocationSearch}
                  className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                  size="sm"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Go to Location
                </Button>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white text-sm">Map Style</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {mapStyles.map((style) => (
                  <div
                    key={style.value}
                    onClick={() => setMapStyle(style.value)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      mapStyle === style.value
                        ? 'bg-[#DC2626]/20 border border-[#DC2626]/50'
                        : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#DC2626]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-2xl">{style.icon}</span>
                      <span className="text-white text-sm font-medium">{style.name}</span>
                    </div>
                    <p className="text-xs text-gray-400 ml-10">{style.desc}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Map Layers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div
                  onClick={() => toggleLayer('threats')}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    showLayers.threats
                      ? 'bg-[#DC2626]/20 border border-[#DC2626]/50'
                      : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#DC2626]/30'
                  }`}
                >
                  <h3 className="font-semibold text-white text-sm mb-1">
                    🚨 Threats ({incidents.length})
                  </h3>
                  <p className="text-xs text-gray-400">Show threat markers and zones</p>
                </div>

                <div
                  onClick={() => toggleLayer('assets')}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    showLayers.assets
                      ? 'bg-[#DC2626]/20 border border-[#DC2626]/50'
                      : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#DC2626]/30'
                  }`}
                >
                  <h3 className="font-semibold text-white text-sm mb-1">
                    👤 Assets ({assets.length})
                  </h3>
                  <p className="text-xs text-gray-400">Protected personnel and facilities</p>
                </div>

                <div
                  onClick={() => toggleLayer('routes')}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    showLayers.routes
                      ? 'bg-[#DC2626]/20 border border-[#DC2626]/50'
                      : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#DC2626]/30'
                  }`}
                >
                  <h3 className="font-semibold text-white text-sm mb-1">
                    🛣️ Routes ({routes.length})
                  </h3>
                  <p className="text-xs text-gray-400">Travel routes and waypoints</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-gray-400">
                  <p className="mb-1">🖱️ Drag to rotate and explore</p>
                  <p className="mb-1">🔍 Scroll to zoom in/out</p>
                  <p className="mb-1">👆 Click markers for details</p>
                  <p className="mb-1">📍 Enter coordinates to relocate</p>
                  <p>🗺️ Switch map styles for different views</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {selectedObject && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedObject(null)}>
            <Card className="border-[#1a1a1a] bg-[#0f0f0f] max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-xl mb-2">
                      {selectedObject.type === 'threat' ? selectedObject.data.title : selectedObject.data.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className={
                        selectedObject.type === 'threat'
                          ? selectedObject.data.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                            selectedObject.data.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                            'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                          : selectedObject.data.status === 'safe' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                            'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      }>
                        {selectedObject.type === 'threat' ? selectedObject.data.severity : selectedObject.data.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {selectedObject.type === 'threat' ? selectedObject.data.threat_type?.replace(/_/g, ' ') : selectedObject.data.asset_type?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedObject(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedObject.type === 'threat' ? (
                  <>
                    {selectedObject.data.description && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Description</p>
                        <p className="text-white">{selectedObject.data.description}</p>
                      </div>
                    )}
                    {selectedObject.data.location_name && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Location</p>
                        <p className="text-white">{selectedObject.data.location_name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedObject.data.latitude?.toFixed(6)}°N, {selectedObject.data.longitude?.toFixed(6)}°W
                        </p>
                      </div>
                    )}
                    {selectedObject.data.recommendation && (
                      <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <p className="text-sm text-gray-400 mb-1">Security Recommendation</p>
                        <p className="text-cyan-400">{selectedObject.data.recommendation}</p>
                      </div>
                    )}
                    {selectedObject.data.source && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Source</p>
                        <p className="text-white">{selectedObject.data.source}</p>
                      </div>
                    )}
                    {selectedObject.data.created_date && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Reported</p>
                        <p className="text-white">{format(new Date(selectedObject.data.created_date), 'MMM d, yyyy HH:mm')}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {selectedObject.data.current_location && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Current Location</p>
                        <p className="text-white">{selectedObject.data.current_location}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedObject.data.latitude?.toFixed(6)}°N, {selectedObject.data.longitude?.toFixed(6)}°W
                        </p>
                      </div>
                    )}
                    {selectedObject.data.security_level && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Security Level</p>
                        <p className="text-white capitalize">{selectedObject.data.security_level}</p>
                      </div>
                    )}
                    {selectedObject.data.contact_info && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Contact</p>
                        <p className="text-white">{selectedObject.data.contact_info}</p>
                      </div>
                    )}
                    {selectedObject.data.last_check_in && (
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Last Check-in</p>
                        <p className="text-white">{format(new Date(selectedObject.data.last_check_in), 'MMM d, yyyy HH:mm')}</p>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
