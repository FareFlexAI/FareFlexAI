import { Flight, SearchParams } from '../types';

export interface ShareableFlightData {
  flight: Flight;
  searchParams: SearchParams;
}

export function encodeFlightData(data: ShareableFlightData): string {
  const base64 = btoa(JSON.stringify(data));
  return encodeURIComponent(base64);
}

export function decodeFlightData(encoded: string): ShareableFlightData | null {
  try {
    const decoded = decodeURIComponent(encoded);
    const json = atob(decoded);
    return JSON.parse(json);
  } catch (error) {
    console.error('Failed to decode flight data:', error);
    return null;
  }
}

export function generateShareUrl(data: ShareableFlightData): string {
  const encoded = encodeFlightData(data);
  const baseUrl = window.location.origin;
  return `${baseUrl}?share=${encoded}`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }

  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return Promise.resolve();
  } catch (err) {
    document.body.removeChild(textArea);
    return Promise.reject(err);
  }
}
