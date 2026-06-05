
import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Boxes, Play, Pause, RotateCw, ZoomIn, ZoomOut, X, Map as MapIcon, Navigation, AlertTriangle, Shield } from "lucide-react";
import { Incident, Asset, TravelRoute } from "@/entities/all";
import { format } from "date-fns";
import * as THREE from "three";

export default function ThreeDVisualization() {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animationIdRef = useRef(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());
  const clickableObjectsRef = useRef([]); // Reference to store all clickable Three.js objects
  const mouseDownCoordsRef = useRef({ x: 0, y: 0 }); // To track mouse position on press down for click/drag distinction
  
  const [activeView, setActiveView] = useState("threats");
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

    // Clear previous clickable objects when effect re-runs
    clickableObjectsRef.current = [];

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

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
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
    let tileUrl = '';
    
    const zoom = Math.min(Math.floor(zoomLevel), 18);
    const tileX = Math.floor((centerLng + 180) / 360 * Math.pow(2, zoom));
    const tileY = Math.floor((1 - Math.log(Math.tan(centerLat * Math.PI / 180) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
    
    if (mapStyle === 'satellite') {
      tileUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${tileY}/${tileX}`;
    } else if (mapStyle === 'street') {
      tileUrl = `https://tile.openstreetmap.org/${zoom}/${tileY}/${tileX}.png`;
    } else if (mapStyle === 'terrain') {
      tileUrl = `https://stamen-tiles.a.ssl.fastly.net/terrain/${zoom}/${tileY}/${tileX}.jpg`;
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

    const buildingGroup = new THREE.Group();
    for (let i = 0; i < 30; i++) {
      const height = 5 + Math.random() * 20;
      const width = 3 + Math.random() * 5;
      const depth = 3 + Math.random() * 5;
      
      const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
      const buildingMaterial = new THREE.MeshPhongMaterial({
        color: 0x888888 + Math.floor(Math.random() * 0x333333),
        flatShading: true
      });
      
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.x = (Math.random() - 0.5) * mapSize * 0.8;
      building.position.z = (Math.random() - 0.5) * mapSize * 0.8;
      building.position.y = height / 2;
      building.castShadow = true;
      building.receiveShadow = true;
      
      buildingGroup.add(building);
    }
    scene.add(buildingGroup);

    const getRiskAssessment = (incident) => {
      const assessments = {
        critical: {
          level: 'EXTREME RISK',
          description: 'Immediate threat to life and safety. Evacuate area immediately. Armed response may be required.',
          color: '#DC2626'
        },
        high: {
          level: 'HIGH RISK',
          description: 'Significant threat present. Avoid area if possible. Enhanced security protocols required.',
          color: '#F59E0B'
        },
        medium: {
          level: 'MODERATE RISK',
          description: 'Elevated threat level. Monitor situation closely. Maintain heightened awareness.',
          color: '#FBBF24'
        },
        low: {
          level: 'LOW RISK',
          description: 'Minimal threat. Continue with standard security protocols.',
          color: '#06B6D4'
        }
      };
      return assessments[incident.severity] || assessments.low;
    };

    const getImmediateActions = (incident) => {
      const actionsByType = {
        terrorism: [
          'Evacuate to safe distance (minimum 500m)',
          'Contact local law enforcement immediately',
          'Account for all personnel',
          'Activate crisis management protocols',
          'Monitor local news and official channels'
        ],
        civil_unrest: [
          'Avoid demonstration areas',
          'Shelter in place if caught in area',
          'Monitor multiple news sources',
          'Prepare evacuation routes',
          'Stay away from government buildings'
        ],
        crime: [
          'Increase security presence',
          'Vary travel routes and times',
          'Report suspicious activity',
          'Enhance personal protection measures',
          'Coordinate with local security forces'
        ],
        natural_disaster: [
          'Follow official evacuation orders',
          'Move to higher ground if flooding',
          'Secure shelter immediately',
          'Prepare emergency supplies',
          'Establish communication protocols'
        ],
        health: [
          'Follow public health guidance',
          'Limit physical contact',
          'Wear appropriate PPE',
          'Establish quarantine protocols',
          'Monitor health status of all personnel'
        ],
        cybersecurity: [
          'Disconnect affected systems',
          'Change all passwords',
          'Enable 2FA on all accounts',
          'Contact IT security team',
          'Preserve evidence for investigation'
        ],
        political: [
          'Monitor political developments',
          'Avoid political gatherings',
          'Maintain low profile',
          'Prepare contingency plans',
          'Coordinate with embassy/consulate'
        ],
        infrastructure: [
          'Use alternative routes',
          'Stock emergency supplies',
          'Prepare backup communications',
          'Identify shelter locations',
          'Monitor utility status'
        ]
      };
      return actionsByType[incident.threat_type] || [
        'Assess situation carefully',
        'Contact security operations center',
        'Follow established protocols',
        'Maintain situational awareness',
        'Document all observations'
      ];
    };

    const getSituationalContext = (incident) => {
      const contexts = {
        terrorism: 'Terrorist activities pose extreme risks to personnel safety. These incidents often occur with little warning and can escalate rapidly. Secondary attacks targeting first responders are common. Maintain maximum distance and coordinate all movements with security professionals.',
        civil_unrest: 'Civil unrest situations can change rapidly and unpredictably. Crowds may become violent without warning. Government responses can include curfews, road closures, and use of force. Foreign nationals may be targeted. Avoid all demonstration areas.',
        crime: 'Criminal activity in this area suggests organized or opportunistic targeting. Criminal groups may specifically target foreigners or high-value individuals. Kidnapping for ransom is a possibility in high-risk zones. Enhanced security protocols are essential.',
        natural_disaster: 'Natural disasters create hazardous conditions and can trigger secondary threats including infrastructure failure, disease outbreak, and civil disorder. Emergency services may be overwhelmed. Self-sufficiency and evacuation preparedness are critical.',
        health: 'Health emergencies require immediate protective measures and may escalate to epidemic proportions. Healthcare infrastructure may become overwhelmed. Quarantine measures and travel restrictions may be imposed. Personal protective equipment is essential.',
        cybersecurity: 'Cyber threats can compromise sensitive information, financial assets, and operational security. Attacks may be precursors to physical security incidents. Nation-state actors or criminal organizations may be involved. Immediate containment is critical.',
        political: 'Political instability creates an unpredictable security environment. Government changes can occur suddenly. Foreign nationals may face restrictions or become targets. Embassy services may be limited. Multiple evacuation routes should be identified.',
        infrastructure: 'Infrastructure failures create cascading security challenges. Power outages, water shortages, and transportation disruptions can lead to civil disorder. Supply chains may be interrupted. Self-sufficiency planning is essential for sustained operations.'
      };
      return contexts[incident.threat_type] || 'This incident requires careful monitoring and adherence to established security protocols. Maintain regular communication with security operations center and be prepared to adjust plans based on evolving conditions.';
    };

    const createThreatMarker = (incident) => {
      if (!incident.latitude || !incident.longitude) return;

      const position = latLngToPosition(incident.latitude, incident.longitude);
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(position);

      const pinHeight = incident.severity === 'critical' ? 8 : 
                       incident.severity === 'high' ? 6 : 
                       incident.severity === 'medium' ? 4 : 3;
      
      const color = incident.severity === 'critical' ? 0xDC2626 :
                    incident.severity === 'high' ? 0xF59E0B :
                    incident.severity === 'medium' ? 0xFBBF24 : 0x06B6D4;
      
      // Create larger clickable sphere
      const headGeometry = new THREE.SphereGeometry(1.2, 16, 16); // Increased size for easier clicking
      const headMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        shininess: 100
      });
      
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = pinHeight;
      head.castShadow = true;
      
      // Store data directly on the mesh
      head.userData = { 
        type: 'threat', 
        clickable: true, // Mark as clickable
        data: {
          ...incident,
          intelligence: {
            threatLevel: incident.severity,
            threatCategory: incident.threat_type,
            affectedRadius: incident.radius_km ? `${incident.radius_km} km` : 'N/A',
            verificationStatus: incident.verified ? 'VERIFIED' : 'UNVERIFIED',
            reportedBy: incident.source || 'Unknown Source',
            firstReported: incident.created_date,
            lastUpdated: incident.updated_date,
            casualties: incident.casualties || 0,
            securityRecommendation: incident.recommendation || 'Exercise caution in this area',
            riskAssessment: getRiskAssessment(incident),
            immediateActions: getImmediateActions(incident),
            situationalContext: getSituationalContext(incident)
          }
        }
      };
      
      markerGroup.add(head);
      clickableObjectsRef.current.push(head); // Add to the ref for raycasting

      const stemGeometry = new THREE.CylinderGeometry(0.2, 0.2, pinHeight, 8);
      const stemMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3
      });
      const stem = new THREE.Mesh(stemGeometry, stemMaterial);
      stem.position.y = pinHeight / 2;
      stem.castShadow = true;
      markerGroup.add(stem);

      if (incident.severity === 'critical') {
        const ringGeometry = new THREE.RingGeometry(2, 2.5, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xDC2626,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.5
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.1;
        markerGroup.add(ring);

        ring.userData.animate = true;
        ring.userData.scale = 1;
      }

      if (incident.radius_km) {
        const radiusInUnits = incident.radius_km * 2;
        const dangerZoneGeometry = new THREE.CircleGeometry(radiusInUnits, 32);
        const dangerZoneMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.15,
          side: THREE.DoubleSide
        });
        const dangerZone = new THREE.Mesh(dangerZoneGeometry, dangerZoneMaterial);
        dangerZone.rotation.x = -Math.PI / 2;
        dangerZone.position.y = 0.05;
        markerGroup.add(dangerZone);
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 128;
      
      context.fillStyle = 'rgba(0, 0, 0, 0.85)';
      context.fillRect(10, 10, 492, 108);
      
      context.fillStyle = incident.severity === 'critical' ? '#DC2626' :
                          incident.severity === 'high' ? '#F59E0B' :
                          incident.severity === 'medium' ? '#FBBF24' : '#06B6D4';
      context.fillRect(10, 10, 8, 108);
      
      context.fillStyle = '#ffffff';
      context.font = 'Bold 32px Arial';
      context.textAlign = 'left';
      context.fillText(incident.title?.substring(0, 25) || 'Threat', 30, 50);
      
      context.font = '20px Arial';
      context.fillStyle = '#9CA3AF';
      const threatType = incident.threat_type?.replace(/_/g, ' ').toUpperCase() || 'UNKNOWN';
      context.fillText(threatType, 30, 80);
      
      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true
      });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(15, 4, 1);
      label.position.y = pinHeight + 3;
      markerGroup.add(label);

      scene.add(markerGroup);
    };

    const getAssetSecurityAssessment = (asset) => {
      const assessments = {
        safe: {
          status: 'SECURE',
          description: 'Asset is in secure location with no immediate threats detected. All security protocols functioning normally.',
          color: '#10B981'
        },
        in_transit: {
          status: 'IN TRANSIT',
          description: 'Asset is mobile and vulnerable during movement. Enhanced vigilance required. Security team activated.',
          color: '#06B6D4'
        },
        at_risk: {
          status: 'AT RISK',
          description: 'Potential threat detected in vicinity. Security team on alert. Evacuation may be necessary.',
          color: '#F59E0B'
        },
        emergency: {
          status: 'EMERGENCY',
          description: 'IMMEDIATE THREAT. Crisis protocols activated. Emergency response team deployed. Evacuation in progress.',
          color: '#DC2626'
        }
      };
      return assessments[asset.status] || assessments.safe;
    };

    const getProtocolStatus = (asset) => {
      return {
        communicationCheck: asset.last_check_in ? 'ACTIVE' : 'OVERDUE',
        securityDetail: asset.security_level === 'maximum' || asset.security_level === 'high' ? 'ASSIGNED' : 'STANDARD',
        evacuationPlan: 'PREPARED',
        medicalSupport: 'AVAILABLE',
        backupLocation: 'IDENTIFIED'
      };
    };

    const getEmergencyProcedures = (asset) => {
      return [
        'Immediate notification to operations center',
        'Activate personal security detail',
        'Proceed to nearest safe house',
        'Maintain constant communication',
        'Follow evacuation route Alpha-1',
        'Rendezvous at designated rally point',
        'Account for all team members',
        'Prepare for extended shelter-in-place if needed'
      ];
    };

    const createAssetMarker = (asset) => {
      if (!asset.latitude || !asset.longitude) return;

      const position = latLngToPosition(asset.latitude, asset.longitude);
      const markerGroup = new THREE.Group();
      markerGroup.position.copy(position);

      const geometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 16); // Increased base size
      const color = asset.status === 'safe' ? 0x10B981 :
                    asset.status === 'at_risk' ? 0xF59E0B :
                    asset.status === 'emergency' ? 0xDC2626 : 0x06B6D4;
      
      const material = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.4,
        shininess: 80
      });
      
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.y = 1.5;
      cylinder.castShadow = true;
      markerGroup.add(cylinder);

      // Create larger clickable head
      const headGeometry = new THREE.SphereGeometry(1, 16, 16); // Increased size for easier clicking
      const head = new THREE.Mesh(headGeometry, material);
      head.position.y = 3.5;
      head.castShadow = true;
      
      head.userData = { 
        type: 'asset',
        clickable: true, // Mark as clickable
        data: {
          ...asset,
          intelligence: {
            protectionLevel: asset.security_level,
            currentStatus: asset.status,
            assetCategory: asset.asset_type,
            lastContact: asset.last_check_in,
            securityAssessment: getAssetSecurityAssessment(asset),
            protocolStatus: getProtocolStatus(asset),
            emergencyProcedures: getEmergencyProcedures(asset)
          }
        }
      };
      
      markerGroup.add(head);
      clickableObjectsRef.current.push(head); // Add to the ref for raycasting

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 128;
      context.fillStyle = 'rgba(0, 0, 0, 0.85)';
      context.fillRect(10, 10, 492, 108);
      
      context.fillStyle = asset.status === 'safe' ? '#10B981' :
                          asset.status === 'at_risk' ? '#F59E0B' :
                          asset.status === 'emergency' ? '#DC2626' : '#06B6D4';
      context.fillRect(10, 10, 8, 108);
      
      context.fillStyle = '#ffffff';
      context.font = 'Bold 32px Arial';
      context.textAlign = 'left';
      context.fillText(asset.name?.substring(0, 25) || 'Asset', 30, 50);
      
      context.font = '20px Arial';
      context.fillStyle = '#9CA3AF';
      const assetType = asset.asset_type?.replace(/_/g, ' ').toUpperCase() || 'ASSET';
      context.fillText(assetType, 30, 80);
      
      const texture = new THREE.CanvasTexture(canvas);
      const labelMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const label = new THREE.Sprite(labelMaterial);
      label.scale.set(15, 4, 1);
      label.position.y = 6;
      markerGroup.add(label);

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
          Math.max(startPos.y, endPos.y) + 10,
          (startPos.z + endPos.z) / 2
        ),
        endPos
      );

      const points = curve.getPoints(50);
      const color = route.risk_level === 'critical' ? 0xDC2626 :
                    route.risk_level === 'high' ? 0xF59E0B : 
                    route.risk_level === 'medium' ? 0xFBBF24 : 0x10B981;

      // Make tube thicker for better visibility
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

      // Make flags larger
      const startFlagGeometry = new THREE.ConeGeometry(1.2, 5, 4);
      const startFlagMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x10B981,
        emissive: 0x10B981,
        emissiveIntensity: 0.6
      });
      const startFlag = new THREE.Mesh(startFlagGeometry, startFlagMaterial);
      startFlag.position.copy(startPos);
      startFlag.position.y += 2.5; // Adjust Y position based on new height
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
      endFlag.position.y += 2.5; // Adjust Y position based on new height
      endFlag.castShadow = true;
      scene.add(endFlag);
    };

    if (activeView === 'threats' || activeView === 'all') {
      incidents.forEach(createThreatMarker);
    }
    
    if (activeView === 'assets' || activeView === 'all') {
      assets.forEach(createAssetMarker);
    }
    
    if (activeView === 'routes' || activeView === 'all') {
      routes.forEach(createRoute);
    }

    console.log('Clickable objects created:', clickableObjectsRef.current.length);

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    // No mouseDownTime needed here, using mouseDownCoordsRef instead for movement check

    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const currentMouseX = (event.clientX - rect.left);
      const currentMouseY = (event.clientY - rect.top);

      // Check if mouse moved significantly from where it was pressed down
      const movedX = Math.abs(currentMouseX - mouseDownCoordsRef.current.x);
      const movedY = Math.abs(currentMouseY - mouseDownCoordsRef.current.y);
      
      // If the mouse moved more than a few pixels, consider it a drag and not a click
      if (movedX > 5 || movedY > 5) {
        return; 
      }

      mouseRef.current.x = (currentMouseX / rect.width) * 2 - 1;
      mouseRef.current.y = -(currentMouseY / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(clickableObjectsRef.current, false); // Use ref

      console.log('Click detected, intersects:', intersects.length);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log('Clicked object:', clickedObject.userData);
        if (clickedObject.userData.clickable) { // Ensure the object is marked as clickable
          setSelectedObject(clickedObject.userData);
        }
      } else {
        console.log('No intersects found');
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
      
      previousMousePosition = { x: event.clientX, y: event.clientY }; // Update for next move or drag

      // Update hover state
      const rect = renderer.domElement.getBoundingClientRect();
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(clickableObjectsRef.current, false); // Use ref

      if (intersects.length > 0) {
        if (intersects[0].object.userData.clickable) { // Check for clickable flag
          renderer.domElement.style.cursor = 'pointer';
          setHoveredObject(intersects[0].object.userData);
        } else {
          // Object is intersected but not explicitly clickable
          renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';
          setHoveredObject(null);
        }
      } else {
        renderer.domElement.style.cursor = isDragging ? 'grabbing' : 'grab';
        setHoveredObject(null);
      }
    };

    const onMouseDown = (event) => { 
      isDragging = true;
      mouseDownCoordsRef.current = { x: event.clientX, y: event.clientY }; // Store initial mouse down position
      previousMousePosition = { x: event.clientX, y: event.clientY }; // Also set for camera drag
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
          object.material.opacity = 0.3 + Math.sin(time * 2) * 0.2;
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
      renderer.domElement.removeEventListener('click', onClick);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      clickableObjectsRef.current = []; // Clear ref on unmount/re-run
    };
  }, [isPlaying, activeView, incidents, assets, routes, isLoading, centerLat, centerLng, zoomLevel, mapStyle]);

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

  const visualizations = [
    {
      name: "All Data",
      value: "all",
      description: "Show threats, assets, and routes together",
    },
    {
      name: "Threats Only",
      value: "threats",
      description: "Focus on threat intelligence markers",
    },
    {
      name: "Assets Only",
      value: "assets",
      description: "Show protected assets and personnel",
    },
    {
      name: "Routes Only",
      value: "routes",
      description: "Display planned and active routes",
    }
  ];

  const mapStyles = [
    { name: "Satellite", value: "satellite", icon: "🛰️" },
    { name: "Street Map", value: "street", icon: "🗺️" },
    { name: "Terrain", value: "terrain", icon: "⛰️" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Boxes className="w-8 h-8 text-[#DC2626]" />
            3D Real-World Map Visualization
          </h1>
          <p className="text-gray-400">Interactive 3D map with real satellite imagery, street view, and terrain</p>
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
                        <Boxes className="w-24 h-24 text-gray-700 mx-auto mb-4 animate-pulse" />
                        <p className="text-gray-500">Loading real-world map data...</p>
                      </div>
                    </div>
                  )}
                  
                  {hoveredObject && !selectedObject && (
                    <div className="absolute top-4 left-4 bg-[#000000]/90 border border-[#2a2a2a] rounded-lg p-3 max-w-xs z-10">
                      <p className="text-white font-semibold text-sm">
                        {hoveredObject.type === 'threat' ? hoveredObject.data.title : hoveredObject.data.name}
                      </p>
                      <p className="text-gray-400 text-xs">Click for details</p>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4 bg-[#000000]/90 border border-[#2a2a2a] rounded-lg p-2 z-10">
                    <p className="text-white text-xs font-mono">
                      {centerLat.toFixed(6)}°N, {centerLng.toFixed(6)}°W | Zoom: {zoomLevel}
                    </p>
                  </div>
                </div>
                <div className="p-4 border-t border-[#1a1a1a] flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-[#2a2a2a] text-white"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-[#2a2a2a] text-white"
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
                      className="text-gray-400"
                      onClick={handleZoomIn}
                    >
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-gray-400"
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
                  Location
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
                  <MapIcon className="w-4 h-4 mr-2" />
                  Update Map
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
                    className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                      mapStyle === style.value
                        ? 'bg-[#DC2626]/20 border border-[#DC2626]/50'
                        : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#DC2626]/30'
                    }`}
                  >
                    <span className="text-2xl">{style.icon}</span>
                    <span className="text-white text-sm font-medium">{style.name}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white text-sm">Map Layers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {visualizations.map((viz, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveView(viz.value)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      activeView === viz.value
                        ? 'bg-[#DC2626]/20 border border-[#DC2626]/50'
                        : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#DC2626]/30'
                    }`}
                  >
                    <h3 className="font-semibold text-white text-sm mb-1">{viz.name}</h3>
                    <p className="text-xs text-gray-400">{viz.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white text-sm">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-xs text-gray-400">
                  <p className="mb-1">• Click markers for details</p>
                  <p className="mb-1">• Drag to rotate view</p>
                  <p className="mb-1">• Scroll to zoom in/out</p>
                  <p className="mb-1">• Change map style for terrain/satellite</p>
                  <p>• Enter coordinates to jump to location</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white text-sm">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Threats on Map</p>
                  <p className="text-2xl font-bold text-white">{incidents.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Assets Tracked</p>
                  <p className="text-2xl font-bold text-white">{assets.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Active Routes</p>
                  <p className="text-2xl font-bold text-white">{routes.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {selectedObject && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedObject(null)}>
            <Card className="border-[#1a1a1a] bg-[#0a0a0a] max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="border-b border-[#1a1a1a]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <CardTitle className="text-white text-2xl">
                        {selectedObject.type === 'threat' ? '🚨 THREAT INTELLIGENCE' : '🛡️ PROTECTED ASSET'}
                      </CardTitle>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">
                      {selectedObject.type === 'threat' ? selectedObject.data.title : selectedObject.data.name}
                    </h2>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={
                        selectedObject.type === 'threat'
                          ? selectedObject.data.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                            selectedObject.data.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' :
                            selectedObject.data.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' :
                            'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                          : selectedObject.data.status === 'safe' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' :
                            selectedObject.data.status === 'emergency' ? 'bg-red-500/20 text-red-400 border-red-500/50' :
                            'bg-amber-500/20 text-amber-400 border-amber-500/50'
                      }>
                        {selectedObject.type === 'threat' 
                          ? selectedObject.data.intelligence?.riskAssessment?.level 
                          : selectedObject.data.intelligence?.securityAssessment?.status}
                      </Badge>
                      <Badge variant="outline" className="capitalize border-gray-700 text-gray-300">
                        {selectedObject.type === 'threat' 
                          ? selectedObject.data.threat_type?.replace(/_/g, ' ') 
                          : selectedObject.data.asset_type?.replace(/_/g, ' ')}
                      </Badge>
                      {selectedObject.type === 'threat' && selectedObject.data.verified && (
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">✓ VERIFIED</Badge>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedObject(null)}
                    className="text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 p-6">
                {selectedObject.type === 'threat' ? (
                  <>
                    <div className="p-4 rounded-lg border" style={{
                      backgroundColor: `${selectedObject.data.intelligence?.riskAssessment?.color}15`,
                      borderColor: `${selectedObject.data.intelligence?.riskAssessment?.color}50`
                    }}>
                      <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Risk Assessment
                      </h3>
                      <p className="text-gray-300">{selectedObject.data.intelligence?.riskAssessment?.description}</p>
                    </div>

                    {selectedObject.data.intelligence?.situationalContext && (
                      <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                        <h3 className="font-bold text-white mb-2">📋 Situational Context</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {selectedObject.data.intelligence.situationalContext}
                        </p>
                      </div>
                    )}

                    {selectedObject.data.description && (
                      <div>
                        <h3 className="font-bold text-white mb-2">Description</h3>
                        <p className="text-gray-300">{selectedObject.data.description}</p>
                      </div>
                    )}

                    {selectedObject.data.intelligence?.immediateActions && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <h3 className="font-bold text-red-400 mb-3">⚡ Immediate Actions Required</h3>
                        <ul className="space-y-2">
                          {selectedObject.data.intelligence.immediateActions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                              <span className="text-red-400 font-bold mt-0.5">{idx + 1}.</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedObject.data.intelligence?.securityRecommendation && (
                      <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                        <h3 className="font-bold text-cyan-400 mb-2">🎯 Security Recommendation</h3>
                        <p className="text-cyan-300">{selectedObject.data.intelligence.securityRecommendation}</p>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-3 bg-[#1a1a1a] rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Location</p>
                        <p className="text-white font-medium">{selectedObject.data.location_name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {selectedObject.data.latitude?.toFixed(6)}°N, {selectedObject.data.longitude?.toFixed(6)}°W
                        </p>
                      </div>

                      <div className="p-3 bg-[#1a1a1a] rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Affected Radius</p>
                        <p className="text-white font-medium">{selectedObject.data.intelligence?.affectedRadius}</p>
                      </div>

                      <div className="p-3 bg-[#1a1a1a] rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Source</p>
                        <p className="text-white font-medium">{selectedObject.data.intelligence?.reportedBy}</p>
                      </div>

                      <div className="p-3 bg-[#1a1a1a] rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Verification Status</p>
                        <p className="text-white font-medium">{selectedObject.data.intelligence?.verificationStatus}</p>
                      </div>

                      {selectedObject.data.casualties > 0 && (
                        <div className="p-3 bg-[#1a1a1a] rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Casualties Reported</p>
                          <p className="text-red-400 font-bold">{selectedObject.data.casualties}</p>
                        </div>
                      )}

                      <div className="p-3 bg-[#1a1a1a] rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">First Reported</p>
                        <p className="text-white font-medium">
                          {selectedObject.data.created_date && format(new Date(selectedObject.data.created_date), 'MMM d, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-lg border" style={{
                      backgroundColor: `${selectedObject.data.intelligence?.securityAssessment?.color}15`,
                      borderColor: `${selectedObject.data.intelligence?.securityAssessment?.color}50`
                    }}>
                      <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Security Assessment
                      </h3>
                      <p className="text-gray-300">{selectedObject.data.intelligence?.securityAssessment?.description}</p>
                    </div>

                    {selectedObject.data.intelligence?.protocolStatus && (
                      <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                        <h3 className="font-bold text-white mb-3">📊 Protocol Status</h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(selectedObject.data.intelligence.protocolStatus).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between p-2 bg-[#0a0a0a] rounded">
                              <span className="text-sm text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <Badge className={value === 'ACTIVE' || value === 'ASSIGNED' || value === 'PREPARED' || value === 'AVAILABLE' || value === 'IDENTIFIED' 
                                ? 'bg-emerald-500/20 text-emerald-400' 
                                : 'bg-amber-500/20 text-amber-400'}
                              >
                                {value}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedObject.data.intelligence?.emergencyProcedures && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <h3 className="font-bold text-amber-400 mb-3">🚨 Emergency Procedures</h3>
                        <ul className="space-y-2">
                          {selectedObject.data.intelligence.emergencyProcedures.map((procedure, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                              <span className="text-amber-400 font-bold mt-0.5">•</span>
                              <span>{procedure}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-4">
                      {selectedObject.data.current_location && (
                        <div className="p-3 bg-[#1a1a1a] rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Current Location</p>
                          <p className="text-white font-medium">{selectedObject.data.current_location}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedObject.data.latitude?.toFixed(6)}°N, {selectedObject.data.longitude?.toFixed(6)}°W
                          </p>
                        </div>
                      )}

                      {selectedObject.data.security_level && (
                        <div className="p-3 bg-[#1a1a1a] rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Security Level</p>
                          <p className="text-white font-medium capitalize">{selectedObject.data.security_level}</p>
                        </div>
                      )}

                      {selectedObject.data.contact_info && (
                        <div className="p-3 bg-[#1a1a1a] rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Emergency Contact</p>
                          <p className="text-white font-medium">{selectedObject.data.contact_info}</p>
                        </div>
                      )}

                      {selectedObject.data.last_check_in && (
                        <div className="p-3 bg-[#1a1a1a] rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Last Check-in</p>
                          <p className="text-white font-medium">
                            {format(new Date(selectedObject.data.last_check_in), 'MMM d, yyyy HH:mm')}
                          </p>
                        </div>
                      )}
                    </div>
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
