export default function swDev() {

  function urlBase64ToUint8Array(base64String){
    const padding = '=' .replace((4 -base64String.length % 4)%4);
    const base64 = (base64String + padding)
    .replace(/\-/g,'+')
    .replace(/_/g,'/');

    const rowData = window.atob(base64);
    const outputArray = new Uint8ClampedArray(rowData.length);
    for (let i = 0; i < rowData.length; i++) {
        outputArray[i] = rowData.charCodeAt(i)
        
    }
    return outputArray
  }


  function determineAppServerKey(){
    var vapidPublicKey = "BLWOpyATWGI_vyQezobjQ-5PmvbxW-_egHesblUPT5QzAE49AVjtSUP7vhQZd7Q6ZzaL_el4_zSjSY1yRlrunrQ"
    // https://vapidkeys.com/
    return urlBase64ToUint8Array(vapidPublicKey)
  }
  

  let swUrl = `${process.env.PUBLIC_URL}/sw.js`;
  navigator.serviceWorker.register(swUrl).then((response) => {
    return response.pushManager.getSubscription()
    // .then(function(subscription){
    //     return response.pushManager.subscribe({
    //         userVisibleOnly:true,
    //         applicationServerKey:determineAppServerKey()
    //     })
    // })
  });
}



// {
//     "subject": "mailto: <mirajpatel752@gmail.com>",
//     "publicKey": "BAF_LVWs7aQ6Q_BE4VKXFpUwghkarjieQHwVrX3XTso8btBbGh6J7ENGIglxrXOJjWJLE_H1TDTx5JO9MQCVqLw",
//     "privateKey": "qOZ34KBFDDhWHhjA6pU0brNZ2sM__8qWO15vMbkPFrw"
//     }