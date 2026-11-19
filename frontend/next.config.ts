import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // o indicador do modo dev fica à direita para não cobrir a barra de acessibilidade
  devIndicators: { position: "bottom-right" },
  // contas (login e cadastro) passam por /api na mesma origem: assim o refresh token do backend
  // fica num cookie httpOnly "first-party" e o navegador não bloqueia a chamada por CORS
  async rewrites() {
    const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    return [{ source: "/api/:caminho*", destination: `${api}/:caminho*` }];
  },
  images: {
    remotePatterns: [
      // fotos temporárias de demonstração (Unsplash); sai quando as fotos vierem do S3/CDN
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
