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
    serverComponents: true,
  },
  webpack(config) {
    if (config?.module?.rules?.[2]?.oneOf?.[7]?.include?.or) {
      config.module.rules[2].oneOf[7].include.or =
        config.module.rules[2].oneOf[7].include.or.filter(Boolean)
    }
    if (config?.module?.rules?.[2]?.oneOf?.[7]?.issuer?.or) {
      config.module.rules[2].oneOf[7].issuer.or =
        config.module.rules[2].oneOf[7].issuer.or.filter(Boolean)
    }
    return config
  },
}
export default withTM(withVanillaExtract(config))
