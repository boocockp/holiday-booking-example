import * as serverRuntime from './serverRuntime.cjs'
const {runtimeFunctions} = serverRuntime

const ServerApp1 = (user) => {

function CurrentUser() { return runtimeFunctions.asCurrentUser(user) }



return {

}
}

export default ServerApp1