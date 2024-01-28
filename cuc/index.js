(function(h,G,l,u,y,L,n,O,de,A,_){"use strict";const{openLazy:V,hideActionSheet:ue}=l.findByProps("openLazy","hideActionSheet");function I(e,t){if(e!=null&&t!=null)for(const o of Object.keys(t))typeof t[o]=="object"&&!Array.isArray(t[o])?(typeof e[o]!="object"&&(e[o]={}),I(e[o],t[o])):e[o]??=t[o]}function $(e,t){try{V(new Promise(function(o){return o({default:e})}),"ActionSheet",t)}catch(o){G.logger.error(o.stack),showToast("Got error when opening ActionSheet! Please check debug logs")}}l.findByProps("openLazy","hideActionSheet");const{ScrollView:J,View:ve,Text:fe,TouchableOpacity:j,TextInput:ge,Pressable:he,Image:z}=y.General,{FormIcon:H,FormSwitchRow:ye,FormSwitch:Q,FormRow:D,FormInput:Ae,FormDivider:Y}=y.Forms,K=l.findByName("CustomColorPickerActionSheet");function q(e){const t=e>>16&255,o=e>>8&255,r=e&255;return`#${(1<<24|t<<16|o<<8|r).toString(16).slice(1)}`}function m(e,t,o,r,a){return{id:e,label:t,sub:o,def:r,icon:a}}const x=[m("enableUsername","Toggle for username",null,!0,null),m("enableReply","Toggle for replied messages",null,!1,null),m("enableType","Toggle for typing indicator",null,!1,null)];function W(){var e;O.useProxy(n.storage);const t=function(r){return u.ReactNative.processColor(r)},o=function(){var r;return $(K,{color:t(n.storage===null||n.storage===void 0||(r=n.storage.colors)===null||r===void 0?void 0:r.hex)||0,onSelect:function(a){const i=q(a);n.storage.colors.hex=i}})};return React.createElement(J,null,React.createElement(D,{label:"Color",subLabel:"Click to Update",onPress:o,trailing:React.createElement(j,{onPress:o},React.createElement(z,{source:{uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII="},style:{width:96,height:96,borderRadius:10,backgroundColor:(n.storage===null||n.storage===void 0||(e=n.storage.colors)===null||e===void 0?void 0:e.hex)||"#000"}}))}),x?.map(function(r,a){return React.createElement(React.Fragment,null,React.createElement(D,{label:r?.label,subLabel:r?.sub,leading:r?.icon&&React.createElement(H,{style:{opacity:1},source:L.getAssetIDByName(r?.icon)}),trailing:"id"in r?React.createElement(Q,{value:(n.storage===null||n.storage===void 0?void 0:n.storage.switches[r?.id])??r?.def,onValueChange:function(i){return n.storage.switches[r?.id]=i}}):void 0}),a!==x?.length-1&&React.createElement(Y,null))}))}var b,S;const{Text:X}=y.General,Z=l.findByStoreName("ThemeStore"),ee=((b=l.find(function(e){var t,o;return(o=e.default)===null||o===void 0||(t=o.internal)===null||t===void 0?void 0:t.resolveSemanticColor}))===null||b===void 0?void 0:b.default.internal.resolveSemanticColor)??((S=l.find(function(e){var t;return(t=e.meta)===null||t===void 0?void 0:t.resolveSemanticColor}))===null||S===void 0?void 0:S.meta.resolveSemanticColor)??function(){},te=l.findByStoreName("UserStore"),oe=l.findByStoreName("RelationshipStore"),ne=l.findByStoreName("GuildMemberStore"),U=l.findByProps("TYPING_WRAPPER_HEIGHT"),{DCDChatManager:re}=u.ReactNative.NativeModules;I(n.storage,{colors:{hex:"#DAFAF0"},switches:{enableUsername:!0,enableReply:!1,enableType:!1}});function ae(e){var t;return!(e==null||(t=e.colors)===null||t===void 0)&&t.hex?u.ReactNative.processColor(e.colors.hex):0}const M=[];var le={onLoad:function(){M.push(A.before("updateRows",re,function(e){let t=JSON.parse(e[1]);for(const R of t){var o,r,a;const{message:c}=R;if(!c)continue;const C=function(f){return f.usernameColor=ae(n.storage)};if(!(n.storage===null||n.storage===void 0||(o=n.storage.switches)===null||o===void 0)&&o.enableUsername&&C(c),!(c==null||(r=c.referencedMessage)===null||r===void 0)&&r.message&&!(n.storage===null||n.storage===void 0||(a=n.storage.switches)===null||a===void 0)&&a.enableReply){var i;C(c==null||(i=c.referencedMessage)===null||i===void 0?void 0:i.message)}}e[1]=JSON.stringify(t)}),A.after("default",U,function(e,t){let[{channel:o}]=e;var r,a;if(!(!(n.storage===null||n.storage===void 0||(r=n.storage.switches)===null||r===void 0)&&r.enableType)||!t)return;const i=(a=t.props)===null||a===void 0?void 0:a.children,R=ee(Z.theme,_.semanticColors.HEADER_SECONDARY),c=A.after("type",i,function(C,f){var p,w,E,N,P,T,B;u.React.useEffect(function(){return function(){c()}},[]);const g=f==null||(T=f.props)===null||T===void 0||(P=T.children)===null||P===void 0||(N=P[0])===null||N===void 0||(E=N.props)===null||E===void 0||(w=E.children)===null||w===void 0||(p=w[1])===null||p===void 0?void 0:p.props;if(!g||!g.children||((B=g.children)===null||B===void 0?void 0:B.toLowerCase())==="several people are typing...")return;const s=U.useTypingUserIds(o.id).map(function(d){var v;const ie=ne.getMember(o.guild_id,d),k=te.getUser(d),se=ie?.nick||oe.getNickname(d)||k.globalName||k.username,ce=(n.storage===null||n.storage===void 0||(v=n.storage.colors)===null||v===void 0?void 0:v.hex)||R;return{displayName:se,displayColor:ce}});function F(d){return u.React.createElement(X,{style:{color:d.displayColor,fontFamily:u.constants.Fonts.DISPLAY_SEMIBOLD}},d.displayName)}!s||s.length<1||(g.children=s.length===1?[F(s[0])," is typing..."]:[...s.slice(0,s.length-1).flatMap(function(d,v){return[F(d),v<s.length-2?", ":" and "]}),F(s[s.length-1])," are typing..."])})}))},onUnload:function(){M.forEach(function(e){return e()})},settings:W};return h.default=le,Object.defineProperty(h,"__esModule",{value:!0}),h})({},vendetta,vendetta.metro,vendetta.metro.common,vendetta.ui.components,vendetta.ui.assets,vendetta.plugin,vendetta.storage,vendetta.ui.toasts,vendetta.patcher,vendetta.ui);
