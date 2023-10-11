(function(U,ce,R,o,x,C,g,e,y,$,de,_,ue){"use strict";const{openLazy:ge,hideActionSheet:Ze}=R.findByProps("openLazy","hideActionSheet");function H(n,s){if(n!=null&&s!=null)for(const t of Object.keys(s))typeof s[t]=="object"&&!Array.isArray(s[t])?(typeof n[t]!="object"&&(n[t]={}),H(n[t],s[t])):n[t]??=s[t]}function fe(n,s){try{ge(new Promise(function(t){return t({default:n})}),"ActionSheet",s)}catch(t){ce.logger.error(t.stack),showToast("Got error when opening ActionSheet! Please check debug logs")}}const G={toInt(n){return n=n.replace(/^#/,""),parseInt(n,16)},toHex(n){return"#"+n.toString(16).toUpperCase()}},{ScrollView:he,View:O,Text:pe,TouchableOpacity:j,TextInput:et,Image:Re,Animated:L}=C.General,{FormLabel:Ee,FormIcon:ye,FormArrow:tt,FormRow:k,FormSwitch:me,FormSwitchRow:at,FormSection:Ae,FormDivider:be,FormInput:J}=C.Forms,Ce=R.findByName("useIsFocused");R.findByProps("BottomSheetScrollView");const W=R.findByStoreName("UserStore"),X=R.findByProps("showUserProfile");g.getAssetIDByName("ic_add_24px"),g.getAssetIDByName("ic_arrow"),g.getAssetIDByName("ic_minus_circle_24px"),g.getAssetIDByName("Check"),g.getAssetIDByName("Small");function Q(n){return e.React.createElement(ye,{style:{opacity:1},source:g.getAssetIDByName(n)})}const S=e.stylesheet.createThemedStyleSheet({basicPad:{paddingRight:10,marginBottom:10,letterSpacing:.25},header:{color:y.semanticColors.HEADER_SECONDARY,fontFamily:e.constants.Fonts.PRIMARY_BOLD,paddingLeft:"3%",fontSize:24},sub:{color:y.semanticColors.TEXT_POSITIVE,fontFamily:e.constants.Fonts.DISPLAY_NORMAL,paddingLeft:"4%",fontSize:18},flagsText:{color:y.semanticColors.HEADER_SECONDARY,fontFamily:e.constants.Fonts.PRIMARY_BOLD,paddingLeft:"4%",fontSize:16},container:{marginTop:25,marginLeft:"5%",marginBottom:-15,flexDirection:"row"},textContainer:{paddingLeft:15,paddingTop:5,flexDirection:"column",flexWrap:"wrap",shadowColor:"#000",shadowOffset:{width:1,height:4},shadowOpacity:.2,shadowRadius:4.65,elevation:8},image:{width:75,height:75,borderRadius:10,shadowColor:"#000",shadowOffset:{width:1,height:4},shadowOpacity:.2,shadowRadius:4.65,elevation:8},mainText:{opacity:.975,letterSpacing:.25},header:{color:y.semanticColors.HEADER_PRIMARY,fontFamily:e.constants.Fonts.DISPLAY_BOLD,fontSize:25,letterSpacing:.25},subHeader:{color:y.semanticColors.HEADER_SECONDARY,fontSize:12.75}});function K(n){let{index:s}=n;x.useProxy(o.storage);let t=o.storage?.inputs?.ignoredUserList[s];const i=e.React.useRef(new L.Value(1)).current,a=function(){return L.spring(i,{toValue:1.1,duration:10,useNativeDriver:!0}).start()},f=function(){return L.spring(i,{toValue:1,duration:250,useNativeDriver:!0}).start()},l={transform:[{scale:i}]};let u=W.getUser(t?.id),h=Object.values(W.getUsers());u||(u=h.find(function(r){return r?.username==t?.username})),u||(u=h.find(function(r){return r?.username?.toLowerCase()==t?.username?.toLowerCase()}));const m=e.NavigationNative.useNavigation();return Ce(),e.React.createElement(e.React.Fragment,null,e.React.createElement(he,null,e.React.createElement(O,{style:[S.basicPad,S.sub]},e.React.createElement(Ae,{title:"User Setting",style:[S.header]},e.React.createElement(k,{label:"Find User Id or Username",leading:Q("ic_search"),onPress:function(){u&&!t.username?.length?t.username=u.username:u&&!t.id?.length?t.id=u.id:$.showToast("Cannot find User Id/Username.")}}),e.React.createElement(J,{title:"User Username | Case Sensitive",placeholder:"Missing No",value:t?.username,onChange:function(r){return t.username=r}}),e.React.createElement(J,{title:"User Id",placeholder:"Missing No",value:t?.id,onChange:function(r){return t.id=r}}),e.React.createElement(k,{label:"User is webhook?",subLabel:"User is webhook or system, and not BOT or Normal User.",leading:Q("ic_webhook_24px"),trailing:e.React.createElement(me,{value:t?.isWebhook||!1,onValueChange:function(r){return t.isWebhook=r}})})),u&&e.React.createElement(O,{style:[S.container,{paddingBottom:10}]},e.React.createElement(j,{onPress:function(){return X.showUserProfile?.({userId:u?.id})},onPressIn:a,onPressOut:f},e.React.createElement(L.View,{style:l},e.React.createElement(Re,{source:{uri:u?.getAvatarURL?.()?.replace?.("webp","png")||"https://cdn.discordapp.com/embed/avatars/2.png"},style:{width:128,height:128,borderRadius:10}}))),e.React.createElement(O,{style:S.textContainer},e.React.createElement(j,{onPress:function(){return X.showUserProfile({userId:u?.id})}},e.React.createElement(pe,{style:[S.mainText,S.header]},u?.username||t?.username||"No Name"))),e.React.createElement(be,null)),e.React.createElement(k,{label:e.React.createElement(Ee,{text:"Remove User from Ignore List",style:{color:y.rawColors.RED_400}}),onPress:function(){m.pop(),o.storage?.inputs?.ignoredUserList?.splice(s,1)}}))))}const{ScrollView:Se,View:Ie,Text:nt,TouchableOpacity:we,TextInput:De}=C.General,{FormLabel:rt,FormIcon:Fe,FormArrow:_e,FormRow:z,FormSwitch:st,FormSwitchRow:it,FormSection:Be,FormDivider:Pe,FormInput:ot}=C.Forms;function q(n,s){return React.createElement(Fe,{style:{opacity:1},source:s?n:g.getAssetIDByName(n)})}const Le=R.findByName("useIsFocused");R.findByProps("BottomSheetScrollView");const{getUser:Te}=R.findByProps("getUser"),ve=g.getAssetIDByName("ic_add_24px");g.getAssetIDByName("ic_arrow"),g.getAssetIDByName("ic_minus_circle_24px"),g.getAssetIDByName("Check"),g.getAssetIDByName("Small");const Me=g.getAssetIDByName("ic_trash_24px"),I=e.stylesheet.createThemedStyleSheet({basicPad:{paddingRight:10,marginBottom:10,letterSpacing:.25},header:{color:y.semanticColors.HEADER_SECONDARY,fontFamily:e.constants.Fonts.PRIMARY_BOLD,paddingLeft:"3.5%",fontSize:24},sub:{color:y.semanticColors.TEXT_POSITIVE,fontFamily:e.constants.Fonts.DISPLAY_NORMAL,paddingLeft:"4%",fontSize:18},flagsText:{color:y.semanticColors.HEADER_SECONDARY,fontFamily:e.constants.Fonts.PRIMARY_BOLD,paddingLeft:"4%",fontSize:16},input:{fontSize:16,fontFamily:e.constants.Fonts.PRIMARY_MEDIUM,color:y.semanticColors.TEXT_NORMAL},placeholder:{color:y.semanticColors.INPUT_PLACEHOLDER_TEXT}});function Ne(){x.useProxy(o.storage);let[n,s]=React.useState("");const t=e.NavigationNative.useNavigation();Le();let i=o.storage?.inputs?.ignoredUserList??[];const a=function(){if(n){if(isNaN(parseInt(n)))i.push({id:void 0,username:n});else{let f=Te(n);if(f)i.push({id:f?.id,username:"",showUser:!1,isWebhook:!1});else return $.showToast("Invalid User Id")}s(""),t.push("VendettaCustomPage",{title:"Adding User to Ignore List",render:function(){return React.createElement(K,{index:i?.length-1})}})}};return React.createElement(React.Fragment,null,React.createElement(Se,{style:{flex:1}},React.createElement(Be,{style:[I.header,I.basicPad]},React.createElement(Ie,{style:[I.header,I.sub]},i.length>0&&React.createElement(z,{label:"Clear List",trailing:q(Me,!0),onPress:function(){i.length!==0&&de.showConfirmationAlert({title:"Hol up, wait a minute!",content:`This will removes in total ${i.length} users from ignore list.`,confirmText:"Ye",cancelText:"Nah",confirmColor:"brand",onConfirm:function(){o.storage.inputs.ignoredUserList=[]}})}}),i?.map(function(f,l){return React.createElement(React.Fragment,null,React.createElement(z,{label:f?.username||f?.id||"No Data",trailing:React.createElement(_e,null),onPress:function(){return t.push("VendettaCustomPage",{title:"Editing User",render:function(){return React.createElement(K,{index:l})}})}}),l!==i?.length-1&&React.createElement(Pe,null))}),React.createElement(z,{label:React.createElement(De,{value:n,onChangeText:s,placeholder:"User ID or Username",placeholderTextColor:I.placeholder.color,selectionColor:e.constants.Colors.PRIMARY_DARK_100,onSubmitEditing:a,returnKeyType:"done",style:I.input}),trailing:React.createElement(we,{onPress:a},q(ve,!0))})))))}const Ue=R.findByName("CustomColorPickerActionSheet"),{ScrollView:xe,View:T,Text:lt,TouchableOpacity:Z,TextInput:ct,Pressable:dt,Image:$e}=C.General,{FormLabel:ut,FormIcon:v,FormArrow:gt,FormRow:M,FormSwitch:ee,FormSwitchRow:ft,FormSection:B,FormDivider:w,FormInput:Oe}=C.Forms,P=e.stylesheet.createThemedStyleSheet({text:{color:y.semanticColors.HEADER_SECONDARY,paddingLeft:"5.5%",paddingRight:10,marginBottom:10,letterSpacing:.25,fontFamily:e.constants.Fonts.PRIMARY_BOLD,fontSize:16},subText:{color:y.semanticColors.TEXT_POSITIVE,paddingLeft:"6%",paddingRight:10,marginBottom:10,letterSpacing:.25,fontFamily:e.constants.Fonts.DISPLAY_NORMAL,fontSize:12},input:{fontSize:16,fontFamily:e.constants.Fonts.PRIMARY_MEDIUM,color:y.semanticColors.TEXT_NORMAL},placeholder:{color:y.semanticColors.INPUT_PLACEHOLDER_TEXT}}),ke=g.getAssetIDByName("ic_add_24px");R.findByProps("getUser");const ze=R.findByName("useIsFocused"),te=[{id:"minimalistic",default:!0,label:"Minimalistic Settings",subLabel:"Removes all Styling (Enabled by Default)"},{id:"useBackgroundColor",default:!1,label:"Enable Background Color",subLabel:"Background Color for Deleted Message, similiar to Mention but Customizeable"},{id:"ignoreBots",default:!1,label:"Ignore Bots",subLabel:"Ignore bot deleted messages."}],ae=[{id:"deletedMessageColor",title:"Customize Deleted Message Color",type:"default",defaultColor:"#E40303"},{id:"deletedMessageBackgroundColor",title:"Customize Deleted Background Message Color",type:"default",defaultColor:"#FF2C2F"}],ne=[{id:"deletedMessageBuffer",title:"Customize Deleted Message",type:"default",placeholder:"This message is deleted"},{id:"editedMessageBuffer",title:"Customize Edited Separator",type:"default",placeholder:"`[ EDITED ]`"}];function Ve(){x.useProxy(o.storage);const n=e.NavigationNative.useNavigation();ze(),o.storage?.inputs?.ignoredUserList;const s=function(){n.push("VendettaCustomPage",{title:"List of Ignored Users",render:function(){return e.React.createElement(Ne,null)}})};return e.React.createElement(xe,null,e.React.createElement(T,{style:{marginTop:20,marginBottom:20}},e.React.createElement(B,{title:"Plugin Setting",style:[P.header]},e.React.createElement(M,{label:"Customization",subLabel:"Show customization for the plugin",leading:e.React.createElement(v,{style:{opacity:1},source:g.getAssetIDByName("ic_category_16px")}),trailing:e.React.createElement(ee,{value:o.storage?.switches?.customizeable??!1,onValueChange:function(t){return o.storage.switches.customizeable=t}})}),o.storage?.switches?.customizeable&&e.React.createElement(e.React.Fragment,null,e.React.createElement(B,{title:"Switches"}),e.React.createElement(w,null)),o.storage?.switches?.customizeable&&e.React.createElement(e.React.Fragment,null,e.React.createElement(T,{style:[P.subText]},te?.map(function(t,i){return e.React.createElement(e.React.Fragment,null,e.React.createElement(M,{label:t?.label,subLabel:t?.subLabel,leading:t?.icon&&e.React.createElement(v,{style:{opacity:1},source:g.getAssetIDByName(t?.icon)}),trailing:"id"in t?e.React.createElement(ee,{value:o.storage?.switches[t?.id]??t?.default,onValueChange:function(a){return o.storage.switches[t?.id]=a}}):void 0}),i!==te?.length-1&&e.React.createElement(w,null))}))),o.storage?.switches?.customizeable&&e.React.createElement(e.React.Fragment,null,e.React.createElement(B,{title:"Colors Pickers"}),e.React.createElement(w,null)),o.storage?.switches?.customizeable&&e.React.createElement(e.React.Fragment,null,e.React.createElement(T,{style:[P.subText]},ae?.map(function(t){const i=function(){return fe(Ue,{color:G?.toInt(t?.defaultColor),onSelect:function(a){const f=G?.toHex(a);o.storage.inputs[t.id]=f}})};return e.React.createElement(e.React.Fragment,null,e.React.createElement(M,{label:t?.title,subLabel:"Click to Update",onPress:i,trailing:e.React.createElement(Z,{onPress:i},e.React.createElement($e,{source:{uri:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mJsrQAAAgwBAJ9P6qYAAAAASUVORK5CYII="},style:{width:32,height:32,borderRadius:10,backgroundColor:o.storage?.inputs[t.id]||ae.find(function(a){return a?.id==t?.id})?.defaultColor||"#000"}}))}))}))),o.storage?.switches?.customizeable&&e.React.createElement(e.React.Fragment,null,e.React.createElement(B,{title:"Texts Variables"}),e.React.createElement(w,null)),o.storage?.switches?.customizeable&&e.React.createElement(e.React.Fragment,null,e.React.createElement(T,{style:[P.subText]},ne?.map(function(t,i){return e.React.createElement(e.React.Fragment,null,e.React.createElement(Oe,{title:t?.title,keyboardType:t?.type,placeholder:t?.placeholder,value:o.storage?.inputs[t.id]??t?.placeholder,onChange:function(a){return o.storage.inputs[t.id]=a.toString()}}),i!==ne.length-1&&e.React.createElement(w,null))})))),e.React.createElement(B,{title:"Ignore List Setting",style:[P.header]},e.React.createElement(M,{label:"Add User to List",subLabel:"List of ignored users for the plugin",leading:e.React.createElement(v,{style:{opacity:1},source:g.getAssetIDByName("ic_members")}),onPress:s,trailing:e.React.createElement(Z,{onPress:s},e.React.createElement(v,{style:{opacity:1},source:ke}))}),e.React.createElement(w,null))))}var b=void 0;R.findByProps("openLazy","hideActionSheet");const re=R.findByProps("getMessage","getMessages"),V=R.findByProps("getChannel","getDMFromUserId");function Ye(n,s){return _.instead("dispatch",e.FluxDispatcher,function(t,i){const[a]=t,f=a?.type;if(f=="MESSAGE_DELETE"){let l=function(h,m,r,d){if(d?.includes(a?.id))return d=d?.filter(function(E){return E!=a?.id}),h.apply(m,r);const c=re.getMessage(a?.channelId,a?.id),p=c?.author?.id,A=c?.author?.username,D=!c?.content&&c?.attachments?.length==0&&c?.embeds?.length==0;return!p||!A||D||o.storage?.switches?.ignoreBots&&c?.author?.bot||o.storage?.inputs?.ignoredUserList?.length>0&&o.storage.inputs.ignoredUserList?.some(function(E){return E?.id==c?.author?.id||E.username==c.author.username})||(r[0]={type:"MESSAGE_UPDATE",channelId:c?.channel_id||a?.channelId,message:{...c,content:c?.content,type:0,flags:64,channel_id:c?.channel_id||a?.channelId,guild_id:V?.getChannel(c?.channel_id)?.guild_id,timestamp:`${new Date().toJSON()}`,state:"SENT",dumass:99},optimistic:!1,sendMessageOptions:{},isPushNotification:!1},d.push(a?.id||c?.id)),h.apply(m,r)};const u=V.getChannel(a?.channelId?.toString?.());return[1,3].some(function(h){return h==u.type})?a.hasOwnProperty("guildId")?l(i,b,t,s):s?.includes(a?.id)?(s=s?.filter(function(h){return h!=a?.id}),i.apply(b,t)):(t[0]={type:"MESSAGE_CAT"},i.apply(b,t)):!a.guildId||!a.hasOwnProperty("guildId")?s?.includes(a?.id)?(s=s?.filter(function(h){return h!=a?.id}),i.apply(b,t)):(t[0]={type:"MESSAGE_CAT"},i.apply(b,t)):l(i,b,t,s)}if(f=="MESSAGE_UPDATE"){if(a?.removeHistory||a?.message?.author?.bot)return i.apply(b,t);const l=re.getMessage(a?.message?.channel_id,a?.message?.id),u=l?.author?.id,h=l?.author?.username,m=!l?.content&&l?.attachments?.length==0&&l?.embeds?.length==0;if(!u||!h||m)return i.apply(b,t);const r=a?.message?.content==l?.content,d=a?.message?.embeds.some(function(E){return E?.url==l?.content||E?.thumbnail?.url==l?.content||l?.content.includes(E?.url)||l?.content.includes(E?.thumbnail?.url)}),c=a?.message?.embeds?.size||a?.message?.embeds?.length,p=l?.embeds?.size||l?.embeds?.length;if(r||d||!a?.message?.content&&c!=p||o.storage?.inputs?.ignoredUserList?.length>0&&o.storage.inputs.ignoredUserList?.some(function(E){return E?.id==l?.author?.id||E.username==l.author.username}))return i.apply(b,t);let A=o.storage?.inputs?.editedMessageBuffer||"`[ EDITED ]`";A=A+`

`;const D=a?.message||l;return t[0]={type:"MESSAGE_UPDATE",message:{...D,content:`${l?.content}  ${A}${a?.message?.content??""}`,guild_id:V.getChannel(l?.channel_id)?.guild_id,edited_timestamp:"invalid_timestamp"}},n.push(l?.id||a?.message?.id),i.apply(b,t)}return i.apply(b,t)})}const He=R.findByProps("startEditMessage");function Ge(){return _.before("startEditMessage",He,function(n){let s=o.storage?.inputs?.editedMessageBuffer||"`[ EDITED ]`";s=s+`

`;const[t,i,a]=n,f=a.split(s);return n[2]=f[f.length-1],n})}const{DCDChatManager:je}=e.ReactNative.NativeModules;function Je(n){return _.before("updateRows",je,function(s){let t=JSON.parse(s[1]);const{deletedMessageColor:i,deletedMessageBackgroundColor:a,deletedMessageBuffer:f}=o.storage.inputs,{useBackgroundColor:l,minimalistic:u}=o.storage.switches;function h(r,d){r||(r=d);const c=r?.trim();if(c.startsWith("#")){const p=c.slice(1);if(/^[0-9A-Fa-f]{6}$/.test(p))return"#"+p.toUpperCase()}else{const p=c;if(/^[0-9A-Fa-f]{6}$/.test(p))return"#"+p.toUpperCase()}return d||"#000"}function m(r,d){const c=["text","heading","s","u","em","strong","list","blockQuote"];if(Array.isArray(r))return r.map(m);if(typeof r=="object"&&r!==null){const{content:p,type:A,target:D,items:E}=r;if(!c.includes(A))return r;if(A==="text"&&p&&p.length>=1)return{content:[{content:p,type:"text"}],target:"usernameOnClick",type:"link",context:{username:1,medium:!0,usernameOnClick:{action:"0",userId:"0",linkColor:e.ReactNative.processColor(`${d?.toString()}`),messageChannelId:"0"}}};const Y=m(p),le=E?E.map(m):void 0;if(Y!==p||le!==E||!c.includes(A)){const F={...r,content:Y};return A==="blockQuote"&&D&&(F.content=Y,F.target=D),A==="list"&&F?.content&&delete F.content,E&&(F.items=le),F}}return r}t.forEach(function(r){if(r?.type==1&&n?.includes(r?.message?.id)){if(!u){const d=h(i,"E40303"),c=m(r?.message?.content,d);r.message.content=c}if(r.message.edited=f||"This message is deleted",l&&!u){const d=h(a,"FF2C2F"),c=`${d.toString()}33`,p=`${d.toString()}CC`;r.backgroundHighlight={backgroundColor:e.ReactNative.processColor(c),gutterColor:e.ReactNative.processColor(p)}}}}),s[1]=JSON.stringify(t)})}const se=R.findByProps("openLazy","hideActionSheet"),We=R.findByProps("getMessage","getMessages"),Xe=R.findByProps("getChannel","getDMFromUserId"),{FormRow:Qe,FormIcon:Ke}=C.Forms;H(o.storage,{switches:{customizeable:!1,useBackgroundColor:!1,ignoreBots:!1,minimalistic:!0},inputs:{deletedMessageColor:void 0,deletedMessageBackgroundColor:void 0,deletedMessageBuffer:void 0,editedMessageBuffer:void 0,ignoredUserList:[]}});let ie=[],N=[],oe=[];var qe={onLoad:function(){ie.push(Ye(N,oe),Ge(),Je(oe),_.before("openLazy",se,function(n){let[s,t,i]=n;const a=i?.message;t!=="MessageLongPressActionSheet"||!a||s.then(function(f){const l=_.after("default",f,function(u,h){e.React.useEffect(function(){return function(){l()}},[]);const m=ue.findInReactTree(h,function(d){return d?.[0]?.type?.name==="ButtonRow"});if(!m)return h;const r=We.getMessage(a.channel_id,a?.id);N.includes(a?.id||r?.id)&&m.unshift(e.React.createElement(Qe,{label:"Remove EDITED Log History",leading:e.React.createElement(Ke,{style:{opacity:1},source:g.getAssetIDByName("ic_edit_24px")}),onPress:function(){let d=o.storage?.inputs?.editedMessageBuffer||"`[ EDITED ]`";d=d+`

`;const c=a?.content?.split(d),p=c[c.length-1];e.FluxDispatcher.dispatch({type:"MESSAGE_UPDATE",message:{...r,content:`${p}`,guild_id:Xe.getChannel(r.channel_id).guild_id},removeHistory:!0}),N=N.filter(function(A){return A.id!=a?.id}),se.hideActionSheet(),$.showToast("[Message Logger] Logs Removed",g.getAssetIDByName("ic_edit_24px"))}}))})})}))},onUnload:function(){for(const n of ie)n()},settings:Ve};return U.default=qe,Object.defineProperty(U,"__esModule",{value:!0}),U})({},vendetta,vendetta.metro,vendetta.plugin,vendetta.storage,vendetta.ui.components,vendetta.ui.assets,vendetta.metro.common,vendetta.ui,vendetta.ui.toasts,vendetta.ui.alerts,vendetta.patcher,vendetta.utils);
