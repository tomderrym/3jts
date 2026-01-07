// Standalone PricingCards Block
// React 18 via CDN, no JSX, no bundler required

import React, { useState } from 'https://esm.sh/react@18';
import { createElement } from 'https://esm.sh/react@18';

/**
 * PricingCards
 * Props:
 *  - pricingData: Array<{
 *      id: string
 *      title: string
 *      description: string
 *      monthly: number
 *      annual: number
 *    }>
 */
export default function PricingCards({ pricingData = [] }) {
  const [isAnnual, setIsAnnual] = useState(false);

  return createElement(
    'section',
    {
      style: {
        background: '#f4f4f5',
        padding: '4rem 1rem'
      }
    },
    createElement(
      'div',
      {
        style: {
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '4rem'
        }
      },
      [
        // ---- Header ----
        createElement(
          'div',
          {
            key: 'header',
            style: {
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              alignItems: 'center'
            }
          },
          [
            createElement(
              'h2',
              {
                key: 'title',
                style: {
                  fontSize: '2.25rem',
                  fontWeight: 600
                }
              },
              'Select the Best Plan for You!'
            ),
            createElement(
              'p',
              {
                key: 'subtitle',
                style: {
                  fontSize: '1.25rem',
                  color: '#6b7280',
                  maxWidth: '640px'
                }
              },
              'Discover Our Flexible Plans, Compare Features, and Choose the Ideal Option for Your Needs.'
            ),
            createElement(
              'div',
              {
                key: 'toggle',
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }
              },
              [
                createElement('span', { key: 'm' }, 'Monthly'),
                createElement('input', {
                  key: 'switch',
                  type: 'checkbox',
                  checked: isAnnual,
                  onChange: () => setIsAnnual(v => !v),
                  style: { cursor: 'pointer' }
                }),
                createElement('span', { key: 'a' }, 'Annually')
              ]
            )
          ]
        ),

        // ---- Cards ----
        createElement(
          'div',
          {
            key: 'cards',
            style: {
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }
          },
          pricingData.map(plan => {
            const price = isAnnual ? plan.annual : plan.monthly;
            const period = isAnnual ? 'year' : 'month';
            const savings = isAnnual ? plan.monthly * 12 - plan.annual : null;

            return createElement(
              'div',
              {
                key: plan.id,
                style: {
                  background: 'white',
                  borderRadius: '8px',
                  padding: '2rem',
                  minWidth: '300px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  border: '1px solid #e5e7eb'
                }
              },
              [
                // ---- Left ----
                createElement(
                  'div',
                  {
                    key: 'left',
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem'
                    }
                  },
                  [
                    createElement(
                      'h3',
                      {
                        key: 'plan-title',
                        style: { fontSize: '1.875rem', fontWeight: 600 }
                      },
                      plan.title
                    ),
                    createElement(
                      'p',
                      {
                        key: 'plan-desc',
                        style: { color: '#6b7280' }
                      },
                      plan.description
                    ),
                    createElement(
                      'button',
                      {
                        key: 'cta',
                        style: {
                          width: 'fit-content',
                          padding: '0.5rem 1.25rem',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#111827',
                          color: 'white',
                          cursor: 'pointer'
                        }
                      },
                      'Enterprise'
                    )
                  ]
                ),

                // ---- Right ----
                createElement(
                  'div',
                  {
                    key: 'right',
                    style: {
                      textAlign: 'right',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }
                  },
                  [
                    createElement(
                      'div',
                      {
                        key: 'price',
                        style: { display: 'flex', alignItems: 'flex-end', gap: '0.25rem' }
                      },
                      [
                        createElement(
                          'span',
                          {
                            key: 'amount',
                            style: {
                              fontSize: '3rem',
                              fontWeight: 700,
                              color: '#2563eb'
                            }
                          },
                          `$${price}`
                        ),
                        createElement(
                          'span',
                          {
                            key: 'period',
                            style: { color: '#6b7280' }
                          },
                          `/${period}`
                        )
                      ]
                    ),
                    savings
                      ? createElement(
                          'span',
                          {
                            key: 'savings',
                            style: {
                              marginTop: '0.25rem',
                              fontSize: '0.875rem',
                              color: '#16a34a',
                              fontWeight: 500
                            }
                          },
                          `Save $${savings.toLocaleString()}/year`
                        )
                      : null
                  ]
                )
              ]
            );
          })
        )
      ]
    )
  );
}
