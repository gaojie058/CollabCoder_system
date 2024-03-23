import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createEditUrl, createProjectsUrl } from './frontendRoutes'
import axios from 'axios';
import backendRoutes from './backendRoutes.js';
import Loading from './ui-component/Loading.js';
import sha256 from 'crypto-js/sha256';
// import useToken from './hooks/useToekn.js'
function hash(pw) {
    const nonce = ""
    return sha256(nonce + pw).toString()
}
export default function Navigation() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        axios({
            method: 'post',
            url: backendRoutes.LOGIN_URL,
            data: {
                email: 'user@demo.com',
                password: hash('123456789')
            }
        })
            .then(res => {
                if (res.data.message == "Success") {
                    let userName = res.data.user
                }
            }).catch(err => console.log(err))

        // 删除demo
        axios.delete(backendRoutes.PROJECT_URL + 'Demouser' + "/" + 'demo' + "/").catch(err => console.log(err))

        // 创建demo
        axios({
            method: 'post',
            url: backendRoutes.ADD_PROJECT_URL + "example",
            data: {
                userName: 'Demouser',
                projectName: 'demo'
            }
        })
            .then(result => {
                setIsLoading(false)
                navigate(createEditUrl('Demouser', 'demo', 'Demouser'))
            })
            .catch(err => {
                console.log(err);
            })
    })
    return (
        <>
            {isLoading ? <Loading></Loading> : <></>}
        </>
    )
}
