import Aue from "./aue";

const template =
  '<div :attr="aa" class="wrap" id="root" style="color: red" onClick="alert(2)">' +
  '<p><dl><dd></dd><dt><img/><i>43536</i></dt></dl></p>' +
  '<b><input/></b>' +
  '<span>43536{{aaa}}ee<{{bbb}}e</span>' +
  '</div>';

const template1 = '<div><i>234</i></div>'

window.app = new Aue({
  // el: "root"
  template,
  data: {
    aa: {
      c: 'fsgag',
      d: {
        e: '342'
      }
    },
    aaa: 'basgag',
    bbb: 'sftwwt'
  }
});
