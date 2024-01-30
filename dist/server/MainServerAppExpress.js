import {expressApp} from './serverRuntime.cjs'
import baseAppFactory from './MainServerApp.mjs'

const app = expressApp(baseAppFactory)

export default app