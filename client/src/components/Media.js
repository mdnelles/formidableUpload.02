
import React, { useState, useEffect } from "react";
import { sizeSideBar } from './_sharedFunctions'
import { Alert , Spinner , Button } from 'reactstrap';
import { getMedia, removeFile } from './MediaFunctions'
import localForage from 'localforage'

const Mediarow = (props) => {
 
    let fType = ''
    if(props.name !== undefined){
        let f = props.name.toString();
        if(f.includes('.mov') || f.includes('.avi') || f.includes('.mp4')){
            fType = "Movie"
        } else if(f.includes('.mp3') || f.includes('.wav') || f.includes('.mid') || f.includes('.snd') || f.includes('.ram')){
            fType = "Audio"
        } else {
            fType = 'Image';
        }
    }

    return (
        <div className={"donors__edit__table-row flex_container_row font-gray padding10 marginRight " + props.bgc} >
            <div className="donors__edit__table-item flex-4 leftpad15">
                <a href={"./" + props.path_display } 
                    target="_blank" 
                    rel="noopener noreferrer"
                    >{props.name}</a>
            </div>
            <div className="donors__edit__table-item flex-4">
                {fType}
            </div>
            <div className="donors__edit__table-item flex-2">
                <Button color="primary" onClick={()=>props.deleteFile(props.name)}>Delete</Button>
            </div>
        </div>
    )
}

const AllMediaRows = props => {

    var tog = false, bgc

    if(props.mediaObj === undefined || ! Array.isArray(props.mediaObj)){
        return (<div></div>)
    } else {
        props.mediaObj.forEach( (e,i) => {
            tog === false ? bgc = 'whitebg' : bgc = 'graybg'
            tog =! tog; 
            props.mediaObj[i].bgc = bgc;
          })
          var date = 'Feb 6';
          return(
            props.mediaObj.map(media => <Mediarow 
                    name={media.name}
                    path_display={"/upload/"+media.name}
                    key={media.name}
                    date={date}
                    bgc={media.bgc}
                    deleteFile={props.deleteFile}
                />)
          )
    }
}

const Msgbar = props => {
    return (
        <Alert color="primary" className="marginRight vAlignMiddle">
            <Spinner type="grow" color="primary" className={props.spin}/> {props.msg}
        </Alert>
    )

}


export const Media = () => {

    const [mediaObj, setMediaObj] = useState({}),
          [upVis, SetUpVis] = useState('hid'),
          [upFile, setUpFile] = useState(''),
          [msg, setMsg] = useState('Loading Media ...'),
          [spin, setSpin] = useState('visible'),
          [thetoken, setThetoken] = useState('Token not Set');

    const deleteFile = fileName => {
        setSpin('visible')
        setMsg(`Deleting Media ...`)
        removeFile(thetoken,fileName).then( data => {
            setSpin('hid')
            console.log(data);
            if(data === 'ok'){
                setMsg(`Deleting file ${fileName}`)
                setMediaObj(mediaObj.filter(obj => obj.name !== fileName))
                //console.log(mediaObj.filter(obj => obj.name !== fileName))
            } else {
                setMsg(`Could not delete ${fileName}`)
            }
        })
    }

    const startUploadFile = e => {
        setSpin('visible')
        setMsg(`Uploading Media ...`)
        e.preventDefault()

        const data = new FormData()
        data.append('file', upFile)

        var formData = new FormData();
        var xhr = new XMLHttpRequest();
        
        var onProgress = function(e) {
            if (e.lengthComputable) {
              var percentComplete = (e.loaded/e.total)*100;
              console.log('% uploaded:' + percentComplete)
            }
          };
          
          var onReady = function(e) {
           console.log('ready')
          };
          
          var onError = function(err) {
            console.log('something went wrong with upload');
          };

        formData.append('files', upFile); // this is a state object set onChange
        xhr.open('post', '/media/uploadFile', true);
        xhr.setRequestHeader('token', thetoken);
        xhr.setRequestHeader('caller', 'Mediajs.startUploadFile');
        xhr.addEventListener('error', onError, false);
        xhr.addEventListener('progress', onProgress, false);
        xhr.send(formData);
        xhr.addEventListener('readystatechange', onReady, false);

    }

    const onChangeHandler = event => {
        setUpFile(event.target.files[0]);
        SetUpVis('visible')
    }

    useEffect(() => {
        document.body.style.background = "#ffffff";
        window.addEventListener('resize', sizeSideBar);
        sizeSideBar()
        localForage.getItem('token', function(err, startToken) { 
            setThetoken(startToken)
            //document.getElementById("file-upload").value = null;
            getMedia(startToken).then( res => {
                setMediaObj(res)
                setSpin('hid')
                setMsg('Media has loaded ')
            })
        })
    },[]);

    return (
        <div id="main">

            <Alert color="secondary">
                <div id="formWrapper" className="height60 ">
                    <form  encType="multipart/form-data" method="post">
                        <Button color="primary" className={upVis} onClick={(event)=>startUploadFile(event)} type="button">Upload</Button>
                        <input type="file" name="file"  id="file" multiple="multiple" onChange={onChangeHandler} />
                    </form>
                </div>
            </Alert>

            <Msgbar msg={msg} spin={spin}/>

            <div className="donors__edit__table-header flex_container_row no-shrink">
                <div className="donors__edit__table-item flex-4 leftpad15">
                    File 
                </div>

                <div className="donors__edit__table-item flex-4">
                    Type
                </div>
                <div className="donors__edit__table-item flex-2">
                    Delete
                </div>
            </div>

            <AllMediaRows mediaObj={mediaObj} deleteFile={deleteFile}/>

        </div>
    )

}

