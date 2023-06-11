(function(C,t,N,d,O,M,T,y,R){"use strict";const{FormRow:S,FormSwitch:P,FormSwitchRow:V,FormSection:J,FormDivider:b,FormInput:B}=M.Forms,{ScrollView:L,View:p,Text:h}=M.General,c=t.stylesheet.createThemedStyleSheet({text:{color:T.semanticColors.HEADER_SECONDARY,paddingLeft:"5.5%",paddingRight:10,marginBottom:10,letterSpacing:.25,fontFamily:t.constants.Fonts.PRIMARY_BOLD,fontSize:16},subText:{color:T.semanticColors.TEXT_POSITIVE,paddingLeft:"6%",paddingRight:10,marginBottom:10,letterSpacing:.25,fontFamily:t.constants.Fonts.DISPLAY_NORMAL,fontSize:12}});let v=function(e){return e.toUpperCase()},F=[{id:"deletedMessageColor",title:"Customize Deleted Message Color ( DO NOT INCLUDE # )",type:"default",placeholder:"E40303"},{id:"deletedMessage",title:"Customize Deleted Message",type:"default",placeholder:"This message is deleted"},{id:"editedMessage",title:"Customize Edited Separator",type:"default",placeholder:"`[ EDITED ]`"},{id:"deletedMessageColorBackground",title:"Customize Deleted Background Message Color ( DO NOT INCLUDE # )",type:"default",placeholder:"FF2C2F"}];const _=[{id:"useBackgroundColor",default:!1,label:"Enable Background Color",subLabel:"Background Color for Deleted Message, similiar to Mention but Customizeable"}];let z=[{version:"v0.0.8",patch:["Added Customizeable Text Color for Deleted Messages.","Added Customizeable Background Color for Deleted Messages. Like Mentions","Changed Deleted Message Patch.","Fixed needing to click multiple times to dismiss a message.","Removed Option to use DELETED, NormalEphemeral, DefaultAutomodEphemeral","Removed Ephemeral Custom Settings."]}];function $(){return N.useProxy(d.storage),t.React.createElement(L,null,t.React.createElement(p,{style:{marginTop:20}},t.React.createElement(p,{style:{marginTop:10}},t.React.createElement(h,{style:[c.text,c.optionText]},v("Customize")),t.React.createElement(p,{style:[c.subText]},F.map(function(e,a){return t.React.createElement(t.React.Fragment,null,t.React.createElement(B,{title:e.title,keyboardType:e.type,placeholder:e.placeholder,value:d.storage[e.id]??e.placeholder,onChange:function(l){return d.storage[e.id]=l.toString()}}),a!==F.length-1&&t.React.createElement(b,null))})),t.React.createElement(p,{style:[c.subText]},_.map(function(e,a){return t.React.createElement(t.React.Fragment,null,t.React.createElement(S,{label:e.label,subLabel:e.subLabel,leading:e.icon&&t.React.createElement(S.Icon,{source:O.getAssetIDByName(e.icon)}),trailing:"id"in e?t.React.createElement(P,{value:d.storage[e.id]??e.default,onValueChange:function(l){return d.storage[e.id]=l}}):void 0}),a!==_.length-1&&t.React.createElement(b,null))})),t.React.createElement(h,{style:[c.subText,c.optionText]},v("Reload the Plugin to Apply Color Change")),t.React.createElement(h,{style:[c.text,c.optionText]},"Changes"),z.map(function(e,a){return t.React.createElement(t.React.Fragment,null,t.React.createElement(h,{style:[c.text]},e.version||"Dev Version"),e.patch?.map(function(l){return t.React.createElement(t.React.Fragment,null,t.React.createElement(h,{style:[c.subText]},`- ${l}`))}))}))))}const w=R.findByProps("startEditMessage"),A=R.findByProps("getMessage","getMessages"),x=R.findByProps("getChannel","getDMFromUserId"),{DCDChatManager:U}=t.ReactNative.NativeModules;let g=[];const G={onLoad(){this.self=y.before("startEditMessage",w,function(e){let a=d.storage.editedMessage||"`[ EDITED ]`";a=a+`

`;const[l,i,o]=e,n=o.split(a);return e[2]=n[n.length-1],e}),this.messageLogger=y.before("dispatch",t.FluxDispatcher,function(e){const[a]=e;let l=a.type;if(l==="MESSAGE_DELETE"){let i=function(){let r=arguments.length>0&&arguments[0]!==void 0?arguments[0]:!1,s=arguments.length>1?arguments[1]:void 0;return r?{type:"MESSAGE_UPDATE",channelId:s?.channel_id,message:s,optimistic:!1,sendMessageOptions:{},isPushNotification:!1}:{type:"MESSAGE_UPDATE",channelId:s?.channel_id,message:{...s,flags:64,content:`${s?.content} `,channel_id:s?.channel_id,guild_id:o?.guild_id,timestamp:`${new Date().toJSON()}`,state:"SENT"},optimistic:!0,sendMessageOptions:{},isPushNotification:!1}};const o=x.getChannel(a?.channelId),n=A.getMessage(a?.channelId,a?.id);if(o?.type==1)return g.find(function(r){return r.id==a.id}).id==a.id||(e[0]=i(!1,n),g.push({id:a?.id,flag:1})),e;{let r=g?.find(function(s){return s?.id==a?.id});if(r?.flag==2)return e;if(a.hasOwnProperty("guildId"))return r?.flag==1?(e[0]=i(!0,n),g?.map(function(s){s?.id==a?.id&&(s.flag=2)}),e):(r?.flag==2||(e[0]=i(!1,n),g.push({id:a?.id,flag:1})),e);if(r?.flag==1)return e[0]=i(!0,n),g?.map(function(s){s?.id==a?.id&&(s.flag=2)}),e;if(r?.flag==2&&r.id==a.id)return e;if(r.id!=a.id)return e[0]=i(!1,n),g.push({id:a?.id,flag:1}),e}}if(l==="MESSAGE_UPDATE"){const i=A.getMessage(a?.message?.channel_id,a?.message?.id);let o=d.storage.editedMessage||"`[ EDITED ]`";if(o=o+`

`,e[0].message?.author?.bot||i?.author?.bot||!i?.author?.id||!i?.author?.username||!i?.content&&i?.attachments?.length==0&&i?.embeds?.length==0||a?.message?.content==i.content)return e;let n=a?.message??i;return e[0]={type:"MESSAGE_UPDATE",message:{...n,content:`${i?.content}  ${o}${a?.message?.content??""}`,guild_id:x.getChannel(i?.channel_id)?.guild_id,edited_timestamp:"invalid_timestamp"}},e}}),this.colorText=y.before("updateRows",U,function(e){let a=JSON.parse(e[1]),l=d.storage.deletedMessageColor||"E40303",i=/[0-9A-Fa-f]{6}/;l.match(i)||(l="E40303");function o(n){const r=["text","heading","s","u","em","strong","list","blockQuote"];if(Array.isArray(n))return n.map(o);if(typeof n=="object"&&n!==null){const{content:s,type:u,target:E,context:I,items:m}=n;if(!r.includes(u))return n;if(u==="text"&&s&&s.length>=1)return{content:[{content:s,type:"text"}],target:"usernameOnClick",type:"link",context:{username:1,medium:!0,usernameOnClick:{action:"0",userId:"0",linkColor:t.ReactNative.processColor(`#${l.toString()}`),messageChannelId:"0"}}};const D=o(s),k=m?m.map(o):void 0;if(D!==s||k!==m||!r.includes(u)){const f={...n,content:D};return u==="blockQuote"&&E&&(f.content=D,f.target=E),u==="list"&&f.hasOwnProperty("content")&&delete f.content,m&&(f.items=k),f}}return n}a.forEach(function(n){if(n.type!=1)return;if(!g.find(function(I){return I.id==n?.message?.id}))return n;let r=o(n?.message?.content);n.message.content=r,n.message.edited=d.storage.deletedMessage||"This message is deleted";let s=d.storage.deletedMessageColorBackground||"FF2C2F";s.match(i)||(s="FF2C2F");let u=`#${s.toString()}33`,E=`#${s.toString()}CC`;return Boolean(d.storage.useBackgroundColor)&&(n.backgroundHighlight={backgroundColor:t.ReactNative.processColor(u),gutterColor:t.ReactNative.processColor(E)}),n}),e[1]=JSON.stringify(a)})},onUnload(){this.self?.(),this.colorText?.(),this.messageLogger?.()},settings:$};return C.default=G,Object.defineProperty(C,"__esModule",{value:!0}),C})({},vendetta.metro.common,vendetta.storage,vendetta.plugin,vendetta.ui.assets,vendetta.ui.components,vendetta.ui,vendetta.patcher,vendetta.metro);