export const activatePortfolioCta = (portfolio, onInquiry) => {
  const target = portfolio?.themeSettings?.ctaUrl?.trim();
  if (!target) {
    onInquiry();
    return;
  }

  try {
    const parsed = new URL(target, window.location.href);
    if (!["https:", "http:", "mailto:", "tel:"].includes(parsed.protocol)) {
      onInquiry();
      return;
    }
    window.open(parsed.href, "_blank", "noopener,noreferrer");
  } catch {
    onInquiry();
  }
};
