import styled from "@emotion/styled"
import { Alert, AlertTitle } from "@mui/material"
import { useEffect, useState } from "react"
import ReactDom from "react-dom/client"
import { createPortal } from "react-dom"

/**
 * 
 * @param {string} title 可选值 alert的标题
 * @param {string} message 必要值 alert的信息
 * @param {string} severity Alert组件的类型
 */
export default function myAlert(title, message, severity, time) {
    function AlertComponent(props) {
        const [isShow, setIsShow] = useState(true)
        const StickyAlert = styled(Alert)({
            position: 'fixed',
            top: 50,
            width: 400,
            left: window.innerWidth / 2 - 200,

        })
        useEffect(() => {
            setTimeout(() => {
                setIsShow(false)
            }, time)
            return () => {
                document.body.removeChild(container)
            }
        })
        return isShow ? createPortal(<StickyAlert severity={props.severity}>
            {props.title && <AlertTitle>{props.title}</AlertTitle>}
            {props.message}
        </StickyAlert>, container) : null
    }
    const container = document.createElement('div')
    document.body.appendChild(container)
    const root = ReactDom.createRoot(container)
    root.render(
        <AlertComponent title={title} message={message} severity={severity}></AlertComponent>
    )
}