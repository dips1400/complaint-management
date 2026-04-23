import { useEffect, useRef, useState } from "react";
import type * as LeafletNS from "leaflet";

export interface MapMarkerData {
  id: string;
  lat: number;
  lng: number;
  title: string;
  color?: string;
}

interface Props {
  markers: MapMarkerData[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  onPick?: (lat: number, lng: number) => void;
  picked?: { lat: number; lng: number } | null;
}

export function ComplaintMap(props: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        style={{ height: props.height ?? "400px" }}
        className="flex items-center justify-center rounded-xl border bg-muted/30 text-sm text-muted-foreground"
      >
        Loading map…
      </div>
    );
  }
  return <ClientMap {...props} />;
}

function ClientMap({
  markers,
  center = [19.076, 72.8777],
  zoom = 12,
  height = "400px",
  onPick,
  picked,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const LRef = useRef<typeof LeafletNS | null>(null);
  const mapRef = useRef<LeafletNS.Map | null>(null);
  const layerRef = useRef<LeafletNS.LayerGroup | null>(null);
  const pickerRef = useRef<LeafletNS.Marker | null>(null);
  const iconCacheRef = useRef<Record<string, LeafletNS.DivIcon>>({});

  const getIcon = (color: string) => {
    const L = LRef.current!;
    if (!iconCacheRef.current[color]) {
      iconCacheRef.current[color] = L.divIcon({
        className: "",
        html: `<div style="background:${color};width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
    }
    return iconCacheRef.current[color];
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      if (cancelled || !ref.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(ref.current).setView(center, zoom);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        maxZoom: 19,
      }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      if (onPick) {
        map.on("click", (e: LeafletNS.LeafletMouseEvent) => {
          onPick(e.latlng.lat, e.latlng.lng);
        });
      }

      // initial render of markers/picker
      markers.forEach((m) => {
        L.marker([m.lat, m.lng], { icon: getIcon(m.color ?? "#1d4ed8") })
          .bindPopup(`<strong>${m.title}</strong>`)
          .addTo(layerRef.current!);
      });
      if (picked) {
        pickerRef.current = L.marker([picked.lat, picked.lng], {
          icon: getIcon("#dc2626"),
        }).addTo(map);
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
      pickerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const L = LRef.current;
    if (!L || !layerRef.current) return;
    layerRef.current.clearLayers();
    markers.forEach((m) => {
      L.marker([m.lat, m.lng], { icon: getIcon(m.color ?? "#1d4ed8") })
        .bindPopup(`<strong>${m.title}</strong>`)
        .addTo(layerRef.current!);
    });
  }, [markers]);

  useEffect(() => {
    const L = LRef.current;
    if (!L || !mapRef.current) return;
    if (pickerRef.current) {
      pickerRef.current.remove();
      pickerRef.current = null;
    }
    if (picked) {
      pickerRef.current = L.marker([picked.lat, picked.lng], {
        icon: getIcon("#dc2626"),
      }).addTo(mapRef.current);
    }
  }, [picked]);

  return <div ref={ref} style={{ height }} className="rounded-xl border" />;
}
