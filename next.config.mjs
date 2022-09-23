import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin'
import createTM from 'next-transpile-modules'
let withVanillaExtract = createVanillaExtractPlugin()
let withTM = createTM(['@ds-pack/components'])

/** @type {import('next').NextConfig} */
let config = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    runtime: 'nodejs',
    // serverComponents: true,
  },
  webpack(config) {
    // configuration[0].module.rules[2].oneOf[8].include.or[1]
    if (config?.module?.rules?.[2]?.oneOf?.[8]?.include?.or) {
      config.module.rules[2].oneOf[8].include.or =
        config.module.rules[2].oneOf[8].include.or.filter(Boolean)
    }
    if (config?.module?.rules?.[2]?.oneOf?.[8]?.issuer?.or) {
      config.module.rules[2].oneOf[8].issuer.or =
        config.module.rules[2].oneOf[8].issuer.or.filter(Boolean)
    }
    return config
  },
}

// export default config;

export default withTM(withVanillaExtract(config))
