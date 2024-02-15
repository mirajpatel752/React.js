const commonRegex = {
    emailRegex: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
    gst_no: new RegExp(`([A-Z]){3}(A|B|C|F|G|H|L|J|P|T){1}([A-Z]){1}([0-9]){4}([0-9A-Z]){1}([1-9A-Z]){1}[Z]{1}([0-9A-Z]){1}`),
    websiteRegex: new RegExp(/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})?$/),
    pan_no: new RegExp(/^([A-Za-z]){3}(A|B|C|F|G|H|L|J|P|T){1}([A-Za-z]){1}([0-9]){4}([A-Za-z]){1}?$/),
    mobile_no: new RegExp(/^[6-9]\d{9}$/gi),
    phone: new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/)


}
export default commonRegex