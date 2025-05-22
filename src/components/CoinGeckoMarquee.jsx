import React, { useEffect } from 'react';

const CoinGeckoMarquee = ({ coinIds = '', currency = 'usd' }) => {
  useEffect(() => {
    // Ensure the custom element is defined after the script loads
    const widget = document.querySelector('gecko-coin-price-marquee-widget');
    if (widget) {
      widget.setAttribute('locale', 'en');
      widget.setAttribute('outlined', 'true');
      widget.setAttribute('coin-ids', coinIds);
      widget.setAttribute('initial-currency', currency);
      widget.setAttribute('dark-mode', true);
      widget.setAttribute('transparent-background', 'true');
    }
  }, [coinIds, currency]);

  return <gecko-coin-price-marquee-widget></gecko-coin-price-marquee-widget>;
};

export default CoinGeckoMarquee;