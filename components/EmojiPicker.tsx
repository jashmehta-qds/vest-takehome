import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useState } from 'react';
import { PlusIcon } from './TopBar/components/Icons';

interface EmojiPickerProps {
  show: boolean;
  onSelect: (emoji: string) => void;
  onEmojiDrop?: (emoji: string, x: number, y: number) => void;
}

const EmojiPicker = ({ show, onSelect, onEmojiDrop }: EmojiPickerProps) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [commonEmojis, setCommonEmojis] = useState(['🚀', '🐻', '🐂', '💎', '🔥']);

  const handleDragStart = (e: React.DragEvent, emoji: string) => {
    e.dataTransfer.setData('text/plain', emoji);
  };

  return (
    <div className="relative h-full ">
      <div className="flex flex-row items-center gap-2 p-2 bg-custom-darkest-gray w-fit rounded-full ">
        {commonEmojis.map((emoji) => (
          <button
            key={emoji}
            draggable
            onDragStart={(e) => handleDragStart(e, emoji)}
            className="w-10 h-10 rounded-full hover:bg-custom-darkest flex items-center justify-center text-xl cursor-grab active:cursor-grabbing"
            onClick={() => onSelect(emoji)}
          >
            {emoji}
          </button>
        ))}
        
        <button
          className="w-10 h-10 rounded-full hover:bg-custom-darkest flex items-center justify-center text-xl bg-custom-darker text-custom-light"
          onClick={() => setIsPickerVisible(!isPickerVisible)}
        >
          <PlusIcon />
        </button>
      </div>

      {isPickerVisible && (
        <div className="relative bottom-[500px] z-50">
          <Picker
            data={data}
            onEmojiSelect={(emoji: any) => {
              onSelect(emoji.native);
              setCommonEmojis((prev) => [...prev, emoji.native]);
              setIsPickerVisible(false);
            }}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker; 