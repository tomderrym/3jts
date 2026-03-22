import React from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';
import { Twitter, Youtube, Send, Gamepad2 } from 'https://esm.sh/lucide-react';

export default function FollowUsIconsWidget() {
  const networks = [
    { Icon: Gamepad2, color: 'hover:bg-[#5865F2] hover:border-[#5865F2]' }, // Discord
    { Icon: Twitter, color: 'hover:bg-[#1DA1F2] hover:border-[#1DA1F2]' },
    { Icon: Send, color: 'hover:bg-[#0088cc] hover:border-[#0088cc]' }, // Telegram
    { Icon: Youtube, color: 'hover:bg-[#FF0000] hover:border-[#FF0000]' }
  ];

  return createElement('div', { className: 'bg-white p-4 md:p-8 font-sans' },
    createElement('div', { className: 'max-w-5xl mx-auto flex flex-col md:flex-row gap-8' },
      // Content Placeholder
      createElement('div', { className: 'w-full md:flex-1 bg-gray-100 rounded-xl h-64 md:h-auto min-h-[300px]' }),
      // Widget
      createElement('div', { className: 'w-full md:w-80 shrink-0 flex flex-col justify-center' },
        createElement('div', { className: 'text-center md:text-left' },
          createElement('h3', { className: 'text-lg font-bold text-gray-900 mb-2' }, 'Follow us on'),
          createElement('p', { className: 'text-gray-500 text-sm leading-relaxed mb-6' }, 'Lorem ipsum dolor sit amet, cons tetur adipiscing elit'),
          createElement('div', { className: 'h-px w-16 bg-gray-200 mx-auto md:mx-0 mb-6' }),
          createElement('div', { className: 'flex justify-center md:justify-start gap-3' },
            networks.map((net, idx) => 
              createElement('a', { 
                key: idx, 
                href: '#', 
                className: `w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-600 hover:text-white transition-colors ${net.color}` 
              }, createElement(net.Icon, { size: 20 }))
            )
          )
        )
      )
    )
  );
}