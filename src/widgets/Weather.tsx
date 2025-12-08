import React, { useEffect, useState } from "react";
import Widget from "../Widget";
import { fetchWeatherApi } from "openmeteo";
import {
  Icon,
  IconProps,
  CloudIcon,
  CloudSunIcon,
  SunIcon,
} from "@phosphor-icons/react";
import globalStyles from "../App.css";
import styles from "./Weather.css";

interface DailyStats {
  minTemp: number;
  maxTemp: number;
  cloudCover: number;
}

export function Weather() {
  const [stats, setStats] = useState<DailyStats[]>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (location) => {
      const responses = await fetchWeatherApi(
        "https://api.open-meteo.com/v1/forecast",
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          temperature_unit: "fahrenheit",
          daily: [
            "temperature_2m_min",
            "temperature_2m_max",
            "cloud_cover_mean",
          ],
          timezone: "auto",
        },
      );

      const daily = responses[0].daily();
      const minTemp = daily.variables(0)!.valuesArray();
      const maxTemp = daily.variables(1)!.valuesArray();
      const cloudCover = daily.variables(2)!.valuesArray();

      const _stats = [];

      for (let i = 0; i < maxTemp.length; i++) {
        _stats.push({
          minTemp: minTemp[i],
          maxTemp: maxTemp[i],
          cloudCover: cloudCover[i],
        });
      }

      setStats(_stats);
    });
  }, []);

  function getIcon(cloudCover: number, props?: IconProps): React.ReactElement {
    return cloudCover <= 100 * 0.25 ? (
      <SunIcon {...props}></SunIcon>
    ) : cloudCover <= 100 * 0.625 ? (
      <CloudSunIcon {...props}></CloudSunIcon>
    ) : (
      <CloudIcon {...props}></CloudIcon>
    );
  }

  return (
    <div className={styles.body}>
      {!stats && <span style={{ position: "absolute" }}>Loading...</span>}
      <div className={styles.forecast}>
        {!stats &&
          Array.from(Array(7)).map((_, i) => (
            <div className={styles.day} key={i}></div>
          ))}
        {stats &&
          stats.map((t, i) => {
            return (
              <div
                className={[globalStyles.container, styles.day].join(" ")}
                key={i}
              >
                {getIcon(t.cloudCover, {
                  size: 16,
                  weight: "fill",
                  color: "#fff8",
                })}
                <div className={styles.temp}>
                  <span className={styles.tempMin}>
                    {Math.round(t.minTemp)}
                  </span>
                  <span className={styles.tempMax}>
                    {Math.round(t.maxTemp)}
                  </span>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
