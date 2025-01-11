import { useEffect, useState } from "react"
import {io} from "socket.io-client"

const useSocket = (serverUrl) => {
    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const socketConnection = io(serverUrl)

        socketConnection.on("connect", () => {
            console.log('Connected to the server');
        })

        setSocket(socketConnection)

        return () => {
            socketConnection.disconnect()
        }
    }, [serverUrl])
    return socket
}

export default useSocket