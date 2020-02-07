import axios from 'axios'


export const getMedia = token => {
  return axios
    .post('/media/getmedia', {
        "token": token,
        "caller":'MediaFunctions.getMedia'
    })
    .then(res => {
        // this needs to be an array of all the filenames
        console.log('res.data');
        console.log(res.data);
      return res.data
    })
    .catch(err => {
      console.log("ClientSide Error @ UserFunctions > getMedia " + err)
      return '-- Err: MediaFunctions.getMedia ' + err
    })
}

export const removeFile = (token,fileName) => {
    return axios
      .post('/media/removeFile', {
          token,
          fileName,
          "caller":'MediaFunctions.getMedia'
      })
      .then(res => {
        return res.data
      })
      .catch(err => {
        console.log("Err UserFunctions > removeFile => " + err)
        return '-- Err: MediaFunctions.removeFile => ' + err
      })
  }
