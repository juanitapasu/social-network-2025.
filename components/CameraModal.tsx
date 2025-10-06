import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { CameraType, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

/* ========= Props ========= */
type ModalCameraProps = {
  /** Cerrar modal */
  onClose: () => void;
  /**
   * Devuelve la imagen capturada/seleccionada.
   * Para simplificar, te entrego un DATA URI (data:image/...;base64,***)
   * Si prefieres solo la base64 sin encabezado, cambia abajo donde se llama.
   */
  onCapture: (dataUri: string) => void;

  /** Permitir abrir galería también desde aquí */
  allowGallery?: boolean;
  /** Cámara inicial: "back" | "front" */
  initialFacing?: CameraType;
  /** Aspecto del recorte para galería (no afecta a la cámara nativa) */
  cropAspect?: [number, number];
  /** Calidad (0..1) */
  quality?: number;
};

/* ========= Helper: crea data URI a partir de base64 ========= */
const toDataUriFromBase64 = (base64: string, mime: string = "image/jpeg") =>
  `data:${mime};base64,${base64}`;

export default function ModalCamera({
  onClose,
  onCapture,
  allowGallery = true,
  initialFacing = "back",
  cropAspect = [1, 1],
  quality = 0.9,
}: ModalCameraProps) {
  const camRef = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>(initialFacing);

  useEffect(() => {
    setFacing(initialFacing);
  }, [initialFacing]);

  /* ========= Cámara ========= */
  const takePicture = async () => {
    try {
      // Nota: en simulador iOS no hay cámara
      const photo = await camRef.current?.takePictureAsync({ base64: true, quality });
      if (photo?.base64) {
        // Si prefieres solo el base64: onCapture(photo.base64)
        const dataUri = toDataUriFromBase64(photo.base64, "image/jpeg");
        onCapture(dataUri);
        onClose();
      }
    } catch (e) {
      console.log("[camera] error", e);
      Alert.alert("Error", "No se pudo tomar la foto.");
    }
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  /* ========= Galería ========= */
  const openGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Necesitamos acceso a tu galería.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: cropAspect,
        quality,
        base64: true, // ← para poder armar data URI aquí mismo
      });
      if (!res.canceled) {
        const asset = res.assets[0];
        // Detecta mime por extensión simple (fallback a jpeg)
        const ext = (asset.fileName?.split(".").pop() || "jpg")
          .toLowerCase()
          .replace("jpeg", "jpg");
        const mime = `image/${ext === "jpg" ? "jpeg" : ext}`;
        const dataUri = asset.base64
          ? toDataUriFromBase64(asset.base64, mime)
          : asset.uri; // por si no devolviera base64 en algún caso raro
        onCapture(dataUri);
        onClose();
      }
    } catch (e) {
      console.log("[gallery] error", e);
      Alert.alert("Error", "No se pudo abrir la galería.");
    }
  };

  return (
    <Modal animationType="slide" transparent={false} onRequestClose={onClose}>
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          ref={camRef}
          facing={facing}
          mute={false}
        />

        {/* Controles */}
        <View style={styles.controls}>
          {/* Close */}
          <Pressable onPress={onClose}>
            <AntDesign name="close" size={36} color="white" />
          </Pressable>

          {/* Shutter */}
          <Pressable onPress={takePicture}>
            <View style={styles.shutterBtn}>
              <View style={styles.shutterBtnInner} />
            </View>
          </Pressable>

          {/* Flip + Gallery */}
          <View style={{ flexDirection: "row", gap: 18 }}>
            <Pressable onPress={toggleFacing}>
              <FontAwesome6 name="rotate-left" size={36} color="white" />
            </Pressable>
            {allowGallery && (
              <Pressable onPress={openGallery}>
                <AntDesign name="picture" size={36} color="white" />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ========= estilos ========= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  camera: { ...StyleSheet.absoluteFillObject },
  controls: {
    position: "absolute",
    bottom: 44,
    left: 0,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
  },
  shutterBtn: {
    backgroundColor: "transparent",
    borderWidth: 5,
    borderColor: "white",
    width: 85,
    height: 85,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterBtnInner: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "white",
  },
});
