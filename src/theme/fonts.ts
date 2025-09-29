export const fonts = {
  // Font sizes
  sizes: {
    xs: 11,
    sm: 13,
    base: 14,
    md: 15,
    lg: 16,
    xl: 18,
    xxl: 20,
  },
  
  // Font weights
  weights: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  
  // Typography styles
  styles: {
    // Headers
    h1: {
      fontSize: 20,
      fontWeight: "600" as const,
    },
    h2: {
      fontSize: 18,
      fontWeight: "700" as const,
    },
    h3: {
      fontSize: 18,
      fontWeight: "600" as const,
    },
    
    // Body text
    body: {
      fontSize: 16,
      fontWeight: "400" as const,
    },
    bodyMedium: {
      fontSize: 15,
      fontWeight: "600" as const,
    },
    bodySmall: {
      fontSize: 14,
      fontWeight: "400" as const,
    },
    
    // Labels and captions
    label: {
      fontSize: 14,
      fontWeight: "500" as const,
    },
    caption: {
      fontSize: 13,
      fontWeight: "400" as const,
    },
    captionSmall: {
      fontSize: 11,
      fontWeight: "600" as const,
    },
    
    // Section headers
    sectionHeader: {
      fontSize: 14,
      fontWeight: "500" as const,
      textTransform: "uppercase" as const,
      letterSpacing: 0.5,
    },
    
    // Button text
    button: {
      fontSize: 16,
      fontWeight: "600" as const,
    },
    
    // Input text
    input: {
      fontSize: 16,
      fontWeight: "400" as const,
    },
  },
} as const;

export type FontSizes = typeof fonts.sizes;
export type FontWeights = typeof fonts.weights;
export type FontStyles = typeof fonts.styles;
