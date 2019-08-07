import Aue from "./aue";

const template =
  '<div attr="aa" class="wrap" id="root" style="color: red" onClick="alert(2)"><p><em><img/><video><img/><i>43536</i></video></em></p><b><input/></b><span>43536{{aaa}}ee<{{bbb}}e</span></div>';

const template1 = '<div><i>234</i></div>'
new Aue({
  // el: "root"
  template
});
