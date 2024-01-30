import {expressApp} from './serverRuntime.cjs'
import baseAppFactory from './ServerApp1.mjs'

const app = expressApp(baseAppFactory)

export default app