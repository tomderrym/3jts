import React, { createElement } from 'https://esm.sh/react@18';

export default function Header1({ logoPosition = 'center', navPosition = 'none', ctaCount = 0, ctaEmphasis = 'primary', background = 'solid', sticky = false }) {
  return createElement('header', { className: 'flex items-center justify-between px-6 py-4 ' }, [
    createElement('div', { key: 'logo' }, logo || 'Logo'),
    createElement('nav', { key: 'nav' }, navLinks?.map((link, i) => 
      createElement('a', { key: i, href: link.href }, link.label)
    )) || []),
    createElement('div', { key: 'actions' }, cta ? createElement('button', {}, cta) : null)
  ]);
}
