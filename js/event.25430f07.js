(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["event"],{"839c":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticStyle:{"background-color":"black"}},[a("v-card",{staticStyle:{color:"white","background-color":"#1a1a1a"},attrs:{shaped:"",dark:""}},[a("v-img",{attrs:{height:"100%",src:""+t.event.eimage,"aspect-ratio":.78}})],1),a("v-card",{staticStyle:{color:"white","background-color":"#1a1a1a"},attrs:{shaped:"",dark:""}},[a("v-card-title",[t._v(t._s(t.event.ename))]),a("v-card-text",[a("v-row",[a("v-col",{attrs:{cols:"12"}},[t._v(" 기간 : "+t._s(new Date(t.event.estartdate).toLocaleDateString())+" - "+t._s(new Date(t.event.eenddate).toLocaleDateString())+" ")]),a("v-col",{staticClass:"py-0",attrs:{cols:"12"}},[t._v(" "+t._s(t.event.edetail)+" ")]),a("v-col",{staticClass:"mt-2 text-center",attrs:{cols:"12"}},[a("v-btn",{staticStyle:{color:"black"},attrs:{color:"white",width:"100%"},on:{click:t.createCoupon}},[t._v("쿠폰 발급")])],1)],1)],1)],1),a("v-card",{staticClass:"pa-4",attrs:{outlined:"",dark:"",color:"black"}},[t._v(" NOTICE "),a("v-card-text",[t._v(" ✔ 쿠폰은 ID당 1회 발급되며, 유효기간이 만료되면"),a("br"),t._v("   재발급 되지 않습니다."),a("br"),t._v(" ✔ 본 이벤트는 더한섬닷컴 회원을 대상으로 진행됩니다."),a("br"),t._v(" ✔ 구매 취소 시 잔여 결제금액이 조건 금액 미만인 경우   혜택이 취소됩니다."),a("br")])],1),a("v-snackbar",{scopedSlots:t._u([{key:"action",fn:function(e){var n=e.attrs;return[a("v-btn",t._b({attrs:{color:"pink",text:""},on:{click:function(e){t.snackbar=!1}}},"v-btn",n,!1),[t._v(" Close ")])]}}]),model:{value:t.snackbar,callback:function(e){t.snackbar=e},expression:"snackbar"}},[t._v(" "+t._s(t.snackbarText)+" ")]),a("v-snackbar",{scopedSlots:t._u([{key:"action",fn:function(e){var n=e.attrs;return[a("v-btn",t._b({attrs:{color:"pink",text:""},on:{click:t.toLogin}},"v-btn",n,!1),[t._v(" Close ")])]}}]),model:{value:t.snackbarLogin,callback:function(e){t.snackbarLogin=e},expression:"snackbarLogin"}},[t._v(" "+t._s(t.snackbarText)+" ")])],1)},r=[],c=a("1da1"),o=(a("96cf"),a("bc3a")),s=a.n(o);function i(t){var e=s.a.get("http://kosa1.iptime.org:50207/event/".concat(t));return e}function l(t){var e=s.a.post("http://kosa1.iptime.org:50207/event",t);return e}var u={getEvent:i,updateEvent:l},v=a("7f01"),d={name:"",components:{},data:function(){return{event:[],snackbar:!1,snackbarText:"",snackbarLogin:!1}},methods:{getEventDetail:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=t.$route.query.eid,e.next=3,u.getEvent(a).then((function(e){t.event=e.data})).catch((function(t){console.log(t)}));case 3:case"end":return e.stop()}}),e)})))()},createCoupon:function(){var t=this;return Object(c["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(""!==t.$store.getters["login/getUserId"]){e.next=4;break}return t.snackbarText="로그인이 필요합니다.",t.snackbarLogin=!0,e.abrupt("return");case 4:return e.next=6,v["a"].createCoupon(t.event.eid,t.event.ename,"할인 쿠폰").then((function(e){1===e.data?(t.snackbarText="쿠폰 발급 성공",t.snackbar=!0):2===e.data?(t.snackbarText="이미 쿠폰을 발급받으셨습니다.",t.snackbar=!0):0===e.data&&(t.snackbarText="제한 인원을 초과하였습니다.",t.snackbar=!0)})).catch((function(t){console.log(t)}));case 6:case"end":return e.stop()}}),e)})))()},toLogin:function(){this.$router.push("/login")}},created:function(){this.getEventDetail(),this.$store.commit("gnb/setCurrentPage","eventdetail")},props:["eno"]},b=d,k=a("2877"),p=a("6544"),g=a.n(p),f=a("8336"),h=a("b0af"),_=a("99d9"),m=a("62ad"),x=a("adda"),w=a("0fd9"),C=a("2db4"),T=Object(k["a"])(b,n,r,!1,null,"45a94ad0",null);e["default"]=T.exports;g()(T,{VBtn:f["a"],VCard:h["a"],VCardText:_["c"],VCardTitle:_["d"],VCol:m["a"],VImg:x["a"],VRow:w["a"],VSnackbar:C["a"]})}}]);
//# sourceMappingURL=event.25430f07.js.map