const commonRegex = {
  emailRegex: new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
  pan_no: new RegExp(
    /^([A-Za-z]){3}(A|B|C|F|G|H|L|J|P|T){1}([A-Za-z]){1}([0-9]){4}([A-Za-z]){1}?$/
  ),
  phone: new RegExp(
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  ),
};
export default commonRegex;
