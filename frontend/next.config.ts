import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // o indicador do modo dev fica à direita para não cobrir a barra de acessibilidade
  devIndicators: { position: "bottom-right" },
  images: {
    remotePatterns: [
      // fotos temporárias de demonstração (Unsplash); sai quando as fotos vierem do S3/CDN
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
