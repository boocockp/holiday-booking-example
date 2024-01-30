import {onRequest} from 'firebase-functions/v2/https'
import MainServerAppExpress from './MainServerAppExpress.js'

export const mainserverapp = onRequest(MainServerAppExpress)