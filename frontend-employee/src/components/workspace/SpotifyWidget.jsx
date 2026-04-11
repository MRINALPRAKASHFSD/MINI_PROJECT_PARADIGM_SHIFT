import React, { useState } from 'react';
import { Music, Check } from 'lucide-react';
import './Widgets.css';

const SpotifyWidget = () => {
  // Lofi Girl default playlist
  const defaultUri = "0vvXsWCC9xrXsKd4ZySYz0"; 
  const defaultType = "playlist";
  
  const [playlistId, setPlaylistId] = useState(defaultUri);
  const [embedType, setEmbedType] = useState(defaultType);
  const [inputUrl, setInputUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleApplyUrl = () => {
    // Extract ID and TYPE from Spotify URL: https://open.spotify.com/track/37i9dQZF1DXcBWIGoYBM5M?si...
    try {
      if (!inputUrl) return;
      let id = inputUrl;
      let type = 'playlist'; // fallback

      if (inputUrl.includes('spotify.com')) {
        const urlObj = new URL(inputUrl);
        const pathParts = urlObj.pathname.split('/').filter(Boolean); // e.g. ['track', 'ID']
        
        if (pathParts.length >= 2) {
          type = pathParts[pathParts.length - 2]; // 'track' or 'album' or 'playlist'
          id = pathParts[pathParts.length - 1];
        }
      } else if (inputUrl.includes(':')) {
        // Handle spotify:track:ID format
        const parts = inputUrl.split(':');
        if (parts.length >= 3) {
          type = parts[parts.length - 2];
          id = parts[parts.length - 1];
        }
      }
      
      setEmbedType(type);
      setPlaylistId(id);
      setIsEditing(false);
      setInputUrl('');
    } catch (e) {
      console.error("Invalid Spotify URL");
    }
  };

  return (
    <div className="workspace-widget spotify-widget">
      <div className="widget-header">
        <h3><Music size={16} /> Focus Tunes</h3>
        <button className="text-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Change'}
        </button>
      </div>
      
      {isEditing ? (
        <div className="spotify-input-overlay">
          <p>Paste any Spotify URL (Song, Playlist, or Album)</p>
          <div className="input-row">
            <input 
              type="text" 
              placeholder="Paste any Spotify song, album, or playlist link..." 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
            />
            <button onClick={handleApplyUrl}><Check size={16}/></button>
          </div>
        </div>
      ) : (
        <div className="spotify-player-wrapper">
          <div className="music-visualizer">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="vis-bar" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>
          <div className="spotify-iframe-container">
            <iframe 
              style={{ borderRadius: '12px' }} 
              src={`https://open.spotify.com/embed/${embedType}/${playlistId}?utm_source=generator&theme=0`} 
              width="100%" 
              height="180" 
              frameBorder="0" 
              allowFullScreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy">
            </iframe>
          </div>
          <div className="spotify-aura-glow"></div>
        </div>
      )}
    </div>
  );
};

export default SpotifyWidget;
