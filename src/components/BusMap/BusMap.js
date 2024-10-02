import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import busIconImg from "../../assets/bus.svg";
import userIconImg from "../../assets/user.svg";
import { QRCodeCanvas } from 'qrcode.react';
import Modal from 'react-modal';
import { FaQrcode } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../../config/firebaseConfig';

const center = { lat: 7.117835, lng: -73.1095366 };

const createRotatedImage = (src, rotation) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const angle = (rotation * Math.PI) / 180;

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(angle);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      resolve(canvas.toDataURL());
    };
  });
};

const BusMap = () => {
  const [busData, setBusData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [rotatedIcons, setRotatedIcons] = useState({});
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [qrData, setQrData] = useState("");
  const [selectedBus, setSelectedBus] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user); 
    });
    return () => unsubscribe();
  }, []);

  const fetchBusData = async () => {
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://api2.gpsmobile.net/api/rep-actual/ultimo-avl/d6871041==')}`);
      const data = await response.json();
      const jsonData = JSON.parse(data.contents);
      const filteredBuses = jsonData.filter((bus) => bus.placa.startsWith("RUTA"));
      setBusData(filteredBuses);
    } catch (error) {
      console.error("Error fetching bus data:", error);
    }
  };  

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => console.error("Error obteniendo la ubicación del usuario", error),
      { enableHighAccuracy: true }
    );

    fetchBusData();

    const interval = setInterval(fetchBusData, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadIcons = async () => {
      const icons = {};
      for (const bus of busData) {
        icons[bus.id] = await createRotatedImage(busIconImg, bus.sentido);
      }
      setRotatedIcons(icons);
    };

    if (busData.length > 0) {
      loadIcons();
    }
  }, [busData]);

  const openModal = () => {
    if (isAuthenticated) {
      setQrData(`https://example.com/bus/${busData.map(bus => bus.placa).join(', ')}`);
      setModalIsOpen(true);
    } else {
      toast.error("Debes iniciar sesión para acceder al código QR.");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleBusClick = (bus) => {
    setSelectedBus(bus);
    if (userLocation) {
      calculateRoute(userLocation, { lat: bus.lat, lng: bus.lng });
    }
  };

  const calculateRoute = (origin, destination) => {
    setDirections({ origin, destination });
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div style={{ width: "100%", height: "100%" }}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={center}
          zoom={15}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: 'auto',
          }}
        >
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url: userIconImg,
                scaledSize: { width: 40, height: 40 },
              }}
            />
          )}

          {busData.map((bus) => (
            <Marker
              key={bus.id}
              position={{ lat: bus.lat, lng: bus.lng }}
              icon={{
                url: rotatedIcons[bus.id] || busIconImg,
                scaledSize: { width: 40, height: 40 },
                anchor: { x: 20, y: 20 },
              }}
              label={{
                text: bus.placa,
                color: "white",
                fontWeight: "bold",
                className: "bus-label",
              }}
              onClick={() => handleBusClick(bus)}
            />
          ))}

          {selectedBus && directions && (
            <DirectionsService
              options={{
                origin: directions.origin,
                destination: directions.destination,
                travelMode: 'DRIVING',
              }}
              callback={(result, status) => {
                if (status === 'OK') {
                  setDirections(result);
                } else {
                  console.error(`error fetching directions ${result}`);
                }
              }}
            />
          )}

          {directions && (
            <DirectionsRenderer
              options={{
                directions: directions,
              }}
            />
          )}
        </GoogleMap>

        <button
          onClick={openModal}
          style={{
            position: "absolute",
            top: "70px",
            right: "20px",
            background: "white",
            border: "none",
            borderRadius: "50%",
            padding: "10px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
            cursor: "pointer",
          }}
          aria-label="Abrir código QR"
        >
          <FaQrcode size={30} color="#000" />
        </button>

        <Modal 
          isOpen={modalIsOpen} 
          onRequestClose={closeModal} 
          style={{ content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)' } }}
        >
          <h2>Código QR</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <QRCodeCanvas value={qrData} size={100} />
          </div>
          <button onClick={closeModal} style={{ marginTop: '20px' }}>Cerrar</button>
        </Modal>

        <ToastContainer 
          position="bottom-right" 
          autoClose={3000} 
          hideProgressBar 
          closeOnClick 
          draggable 
          pauseOnHover 
        />
      </div>
    </LoadScript>
  );
};

export default BusMap;
