import React, { useState } from 'react';

interface AvatarSelectorProps {
  handle: string;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ handle }) => {
  const avatarOptions = [
    `https://api.readyplayer.me/v1/avatars/${handle}.png`,
    `https://api.readyplayer.me/v1/avatars/${handle}/headshot.png`,
    `https://api.readyplayer.me/v1/avatars/${handle}/bust.png`,
    `https://api.readyplayer.me/v1/avatars/${handle}/half-body.png`,
  ];

  const [currentAvatar, setCurrentAvatar] = useState(avatarOptions[0]);
  const [error, setError] = useState(false);

  const handleAvatarChange = () => {
    const nextIndex = (avatarOptions.indexOf(currentAvatar) + 1) % avatarOptions.length;
    setCurrentAvatar(avatarOptions[nextIndex]);
  };

  const handleImageError = () => {
    setError(true);
    // Fallback to Boring Avatars if ReadyPlayer.me fails
    setCurrentAvatar(`https://source.boringavatars.com/marble/120/${handle}?colors=6366F1,818CF8,4F46E5,4338CA,3730A3`);
  };

  return (
    <div className="text-center space-y-4 mb-8">
      <div 
        className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-gray-800 relative cursor-pointer" 
        onClick={!error ? handleAvatarChange : undefined}
      >
        <img
          src={currentAvatar}
          alt={`${handle}'s avatar`}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <h1 className="text-4xl font-bold">@{handle}</h1>
      <div className="text-purple-400 text-2xl font-semibold">2024 Year in Code</div>
      {!error && (
        <div className="flex justify-center space-x-2">
          {avatarOptions.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar option ${index + 1}`}
              className={`w-8 h-8 rounded-full border-2 cursor-pointer
                ${currentAvatar === avatar ? 'border-purple-500' : 'border-transparent'}
                hover:border-purple-300 transition-colors duration-200`}
              onClick={() => setCurrentAvatar(avatar)}
              onError={handleImageError}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarSelector; 