import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { observer } from 'mobx-react-lite'
import { Icon, Header } from 'semantic-ui-react'

interface IProps{
    setFiles: (files: object[]) => void;
}

const dropZoneStyles = {
    border: "dashed 3px",
    borderColor: "#eee",
    borderRadius: "5px",
    paddingTop: "30px",
    textAlign: "center" as "center",
    height: "200px"
}

const dropZoneActive = {
    borderColor: "green"
}

const PhotoWidgetDropZone: React.FC<IProps> = ({setFiles}) => {
    const onDrop = useCallback(acceptedFiles => {
        // allowing preview mode on the file
        setFiles(acceptedFiles.map((file: object) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }) ))
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()} style={isDragActive ? {...dropZoneStyles, ...dropZoneStyles} : dropZoneStyles}>
            <input {...getInputProps()} />
            <Icon name={"upload"} size={"huge"} />
            <Header content={"Drop image here"} />
        </div>
    )
}

export default observer(PhotoWidgetDropZone);