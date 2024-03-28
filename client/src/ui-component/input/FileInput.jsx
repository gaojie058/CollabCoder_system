import styled from "@emotion/styled";
import { useState, useRef, useEffect } from "react";
import myAlert from "../Alert";
import { Button } from "@mui/material";

// accept 允许上传的文件类型
export default function FileInput({ accept, onChange }) {
    // 上传的文件列表
    const [list, setList] = useState([]);

    // 获取允许上传的文件类型
    const getAllowFileTypes = (accept) => {
        let allowFileTypes = [];
        if (accept) {
            const types = accept.split(" ");
            types.forEach((type) => {
                // 此处未判断完所有类型 仅判断文本类型
                if (type.includes(".txt")) {
                    allowFileTypes.push("text/plain");
                } else if (type.includes(".csv")) {
                    allowFileTypes.push("text/csv");
                } else if (type.includes(".htm")) {
                    allowFileTypes.push("text/html");
                } else if (type.includes(".css")) {
                    allowFileTypes.push("text/css");
                } else if (type.includes(".js")) {
                    allowFileTypes.push("text/javascript");
                }
            });
        }
        return allowFileTypes;
    };

    // 格式化文件大小 将单位为bytes的大小的size转换为kb,mb,gb
    const formatSize = (bytes, decimals = 2) => {
        if (bytes === 0) return "0 b";
        const dm = decimals < 0 ? decimals : Math.abs(decimals);

        const kb = 1024;
        const mb = kb * 1024;
        const gb = mb * 1024;

        if (bytes > gb) {
            return `${(bytes / gb).toFixed(dm)} gb`;
        } else if (bytes > mb) {
            return `${(bytes / mb).toFixed(dm)} mb`;
        } else if (bytes > kb) {
            return `${(bytes / kb).toFixed(dm)} kb`;
        } else {
            return `${bytes} b`;
        }
    };

    // 获取文件的基本信息
    const getFilesInfo = (files) => {
        const filesInfo = [];
        files.forEach((file) => {
            const fileInfo = {
                id: file.lastModified,
                name: file.name,
                size: formatSize(file.size),
                type: file.type,
            };
            filesInfo.push(fileInfo);
        });

        return filesInfo;
    };

    // 处理文件函数
    const handleFile = (file) => {
        // 获取允许上传文件的类型
        const allowFileTypes = getAllowFileTypes(accept);

        // 获取上传的文件
        const uploadFiles = file;

        // 过滤出允许上传的文件
        const filterFiles = Array.from(uploadFiles).filter((file) =>
            allowFileTypes.includes(file.type)
        );

        onChange(filterFiles);

        // 如果上传的文件中有不允许的类型 告诉用户
        if (filterFiles.length !== uploadFiles.length) {
            myAlert(
                "error",
                "only csv and txt files are allowed.",
                "error",
                3000
            );
        }

        const files = getFilesInfo(filterFiles);

        // console.log();
        // 设置文件列表
        setList([...list, ...files]);
    };

    const delelteFile = (id) => {
        const newList = list.filter((file) => file.id !== id);
        setList(newList);
    };

    // input标签的dom元素
    const inputRef = useRef(null);

    const Container = styled.div`
        width: 100%;
        height: 150px;
        border: 2px dotted #ddd;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        div {
            font-size: 50px;
            color: #ccc;
        }
    `;
    const FileList = styled.div`
        width: 100%;
        height: 30px;
        line-height: 26px;
        display: flex;
        box-sizing: border-box;
        padding: 2px;
        border-radius: 5px;
        &:hover {
            outline: 2px solid rgb(114, 134, 211);
        }
    `;
    const handleDragover = (e) => {
        // 阻止默认行为 让被拖拽元素可以放置在此
        e.preventDefault();
    };

    // 点击上传文件
    const handleClick = () => {
        const input = inputRef.current;
        input.click();
    };

    const handleDropFile = (e) => {
        // 阻止默认行为
        e.preventDefault();
        // 处理文件
        handleFile(e.dataTransfer.files);
    };

    const handleFileChange = (e) => {
        handleFile(e.target.files);
    };

    return (
        <>
            <Container
                onDragOver={handleDragover}
                // 区域被点击时触发
                onClick={handleClick}
                // 文件被拖拽到容器内触发
                onDrop={handleDropFile}
            >
                <div>+</div>
                <input
                    type="file"
                    style={{ display: "none" }}
                    multiple
                    ref={inputRef}
                    onChange={handleFileChange}
                />
            </Container>
            {list.length > 0
                ? list.map((file) => (
                      <FileList key={file.id}>
                          <div style={{ marginRight: "auto" }}>
                              <strong>{file.name}</strong>
                          </div>
                          <div style={{ marginLeft: "auto", display: "flex" }}>
                              <div
                                  style={{
                                      borderRight: "2px solid #ddd",
                                      paddingRight: "10px",
                                  }}
                              >
                                  {file.size}
                              </div>
                              <Button onClick={() => delelteFile(file.id)}>
                                  delete
                              </Button>
                          </div>
                      </FileList>
                  ))
                : null}
        </>
    );
}
