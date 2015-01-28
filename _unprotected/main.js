function receivedFromPTT(t){var e="",r=!0;byteBuffer=byteBuffer.concat(t);for(var i=0;i<byteBuffer.length;i++)if(byteBuffer[i]<128)e+=String.fromCharCode(byteBuffer[i]);else if(i===byteBuffer.length-1)r=!1;else{r=!1;for(var n=!1,s=i+1;s<byteBuffer.length;s++){var a=256*byteBuffer[i]+byteBuffer[s];a>=65520&&(a=41404);var o=Big5ToUnicode[a-32768];if(o&&n===!1){e+=String.fromCharCode(o),i=s,r=!0;break}27===byteBuffer[s]&&(n=!0),n===!0&&(e+=String.fromCharCode(byteBuffer[s])),109===byteBuffer[s]&&(n=!1)}}r===!0&&(byteBuffer=[],Logger.info("\n==================================================\n"),term.write(e),null!==handler&&(Logger.info("position:  "+JSON.stringify(term.position,null,4)),Logger.info(term.getAllTexts().join("\n")),handler.onData(term)))}function writeMessage(t){term.isLogging&&Logger.info("Write to PTT: "+t);for(var e=[],r=0;r<t.length;r++){var i=t.charCodeAt(r);if(128>i)e.push(i);else{var n=UnicodeToBig5[i],s=n/256,a=n%256;e.push(s,a)}}this.writeByteArray(e)}function registerNextHandler(t){nextHandler=t;var e=t.callback;t.callback=function(){var r=arguments[0];r&&(term.position={type:"unknown"},Logger.info("Screen Dumped:"),Logger.info(term.getReadableScreen())),e.apply(t,arguments)};var r=t.getTimeout?t.getTimeout():15e3;client.setTimeout(r,t)}IS_ON_IOS=!0,require=function(){return{}},module={},String.prototype.removeSpace=function(){return this.replace(/\s/g,"")},String.prototype.removeTailingSpace=function(){return this.replace(/\s+$/g,"")},String.prototype.removeHeadingSpace=function(){return this.replace(/\s([^\s])/g,function(t,e){return e})},String.prototype.stripSpace=function(){return this.replace(/(^\s+)|(\s+$)/g,"")},String.prototype.fixFullWidthCharacters=function(){return this.replace(/ ([\u0080-\uffff])/g,"$1")},function(){if(IS_ON_IOS)Logger={info:function(){_log("INFO ("+Array.prototype.join.call(arguments," ")+")")},debug:function(){_log("DEBUG ("+Array.prototype.join.call(arguments," ")+")")},error:function(){_log("ERR ("+Array.prototype.join.call(arguments," ")+")")}};else if(IS_ON_WEB)_log=console.log,Logger={info:function(){_log("INFO ("+Array.prototype.join.call(arguments," ")+")")},debug:function(){_log("DEBUG ("+Array.prototype.join.call(arguments," ")+")")},error:function(){_log("ERR ("+Array.prototype.join.call(arguments," ")+")")}};else{var t=require("winston"),e=require("fs");e.truncate("./log/debug.log",0),e.truncate("./log/raw.log",0),e.truncate("./log/data.log",0),Logger=new t.Logger({transports:[new t.transports.Console({json:!1,timestamp:!0}),new t.transports.File({filename:__dirname+"/log/debug.log",json:!1})],exitOnError:!1})}module.exports=Logger}(),function(){var t={STARTED:"started",USERNAME_INPUTTED:"username_inputted",BOTH_INPUTTED:"both_inputted",LOGGED_IN:"logged_in"};LoginHandler=function(t,e,r,i){this.client=t,this.callback=i,this.username=e,this.password=r,this.checkedKicking=!1,this.checkedAttempts=!1,this.enterCounter=10},LoginHandler.prototype.start=function(){this.client.write("  "),this.changeStatus(t.STARTED)},LoginHandler.prototype.changeStatus=function(t){Logger.info("LoginHandler: "+this.status+" -> "+t),this.status=t},LoginHandler.prototype.inputUsername=function(){this.client.write(this.username+"\r\n"),this.changeStatus(t.USERNAME_INPUTTED)},LoginHandler.prototype.inputPassword=function(){this.client.write(this.password+"\r\n"),Logger.info("--[Password is censored]--"),this.changeStatus(t.BOTH_INPUTTED),term.isLogging=!0},LoginHandler.prototype.getTimeout=function(){return 3e4},LoginHandler.prototype.isEnded=function(){return this.status===t.LOGGED_IN},LoginHandler.prototype.end=function(){this.status=t.LOGGED_IN},LoginHandler.prototype.onData=function(e){switch(Logger.info("LoginHandler",this.status),this.status){case t.STARTED:-1!==e.getText(20,0,80).removeSpace().indexOf("\u8acb\u8f38\u5165\u4ee3\u865f")&&this.inputUsername();break;case t.USERNAME_INPUTTED:-1!==e.getText(21,0,80).removeSpace().indexOf("\u8acb\u8f38\u5165\u60a8\u7684\u5bc6\u78bc")&&this.inputPassword();break;case t.BOTH_INPUTTED:-1!==e.getText(21,0,80).removeSpace().indexOf("\u5bc6\u78bc\u4e0d\u5c0d\u6216\u7121\u6b64\u5e33\u865f")?(this.changeStatus(t.LOGGED_IN),this.callback({message:"wrong_username_or_password"})):-1!==e.getText(12,0,80).removeSpace().indexOf("\u7cfb\u7d71\u904e\u8f09")?(this.changeStatus(t.LOGGED_IN),this.callback({message:"system_overloaded"})):-1!==e.getText(23,0,80).removeSpace().indexOf("\u767b\u5165\u592a\u983b\u7e41")?(this.changeStatus(t.LOGGED_IN),this.callback({message:"frequently_sign_in"})):-1!==e.getText(22,0,80).removeSpace().indexOf("\u60a8\u60f3\u522a\u9664\u5176\u4ed6\u91cd\u8907\u767b\u5165\u7684\u9023\u7dda\u55ce")&&this.checkedKicking===!1?(this.client.write("n\r\n"),this.checkedKicking=!0):-1!==e.getText(23,0,80).removeSpace().indexOf("\u60a8\u8981\u522a\u9664\u4ee5\u4e0a\u932f\u8aa4\u5617\u8a66\u7684\u8a18\u9304\u55ce")&&this.checkedAttempts===!1?(this.client.write("n\r\n"),this.checkedAttempts=!0):-1!==e.getText(23,0,80).removeSpace().indexOf("\u6309\u4efb\u610f\u9375\u7e7c\u7e8c")?this.client.write("q"):-1!==e.getText(0,0,80).removeSpace().indexOf("\u672c\u65e5\u5341\u5927\u71b1\u9580\u8a71\u984c")?this.client.write("q"):-1!==e.getText(0,0,80).removeSpace().indexOf("\u7de8\u8f2f\u5668\u81ea\u52d5\u5fa9\u539f")?this.client.write("q\r\n"):-1!==e.getAllTexts().join("").indexOf("(G)oodbye")?(this.changeStatus(t.LOGGED_IN),this.callback(null)):this.client.write("")}},module.exports=LoginHandler}(),function(){var t={BEGINNING:"beginning",ENDING:"ending"};LogoutHandler=function(t,e){this.client=t,this.callback=e},LogoutHandler.prototype.start=function(){this.client.write("[Aqqq"),this.changeStatus(t.BEGINNING)},LogoutHandler.prototype.changeStatus=function(t){Logger.info("LogoutHandler: "+this.status+" -> "+t),this.status=t},LogoutHandler.prototype.isEnded=function(){return this.status===t.ENDING},LogoutHandler.prototype.end=function(){this.status=t.ENDING},LogoutHandler.prototype.onData=function(e){Logger.info("LogoutHandler",this.status),this.status===t.BEGINNING&&-1!==e.getAllTexts().join("").indexOf("(G)oodbye")&&this.client.write("g\r\ny\r\n"),-1!==e.getText(23,0,80).indexOf("\u6b64 \u6b21 \u505c \u7559 \u6642 \u9593")&&(this.callback(null),this.changeStatus(t.ENDING),this.client.write("\r\n"))},module.exports=LogoutHandler}(),function(){function t(t,e,r){var i=t.substr(0,7).match(/\d+$/);if(null!==i)var n=parseInt(i[0]);else var n=0/0;var s=t.substr(10,13).removeSpace(),a=t.substr(30,33).removeHeadingSpace().fixFullWidthCharacters(),o=t.substr(67,12),l=t.substr(23,6).removeSpace(),u="\u02c7"===t[9],c=t.substr(64,3).removeSpace(),h="",d=0;if("HOT"===c)h="hot";else if("\u7206!"===c)switch(e){case 1:h="red";break;case 2:h="green";break;case 3:h="yellow";break;case 4:h="blue";break;case 5:h="purple";break;case 6:h="cyan";break;case 7:h="white"}else h="count",d=""===c?0:parseInt(c);var g=6===r;return isNaN(n)||0>=n||""===s||isNaN(d)||0>d||d>=100?null:{number:n,name:s,title:a,boardMasters:o,tag:l,viewerSign:h,viewerCount:d,hasUnread:u,favorited:g,isAccessible:"[\u7981\u5165]"===l?!1:!0}}var e={BEGINNING:"beginning",HOT_LIST:"hot_list",WAIT_MORE:"wait_more",GOT_PAGE:"got_page",ENDING:"ending"};HotHandler=function(t,e){this.client=t,this.callback=e,this.boardList={type:"hot",items:[]},this.gotNumbers=[],term.position={type:"hot"}},HotHandler.prototype.start=function(){this.enterHotList(),this.status=e.BEGINNING},HotHandler.prototype.enterHotList=function(){this.client.write("[Aqqq")},HotHandler.prototype.enterNewPage=function(){this.client.write(""),this.changeStatus(e.HOT_LIST)},HotHandler.prototype.changeStatus=function(t){Logger.info("HotHandler: "+this.status+" -> "+t),this.status=t},HotHandler.prototype.parseList=function(e,r){for(var i=this.boardList.items.length%20+3,n=[],s=i;23>s;s++)if(""!==e[s].removeSpace()){var a=t(e[s],r.getColor(s,65).frontground,r.getColor(s,10).frontground);n.push(a),null===a&&Logger.info(e[s])}return n},HotHandler.prototype.checkItems=function(t){for(var e=(this.boardList.items,0),r=0;r<t.length;r++){var i=t[r];null===i||this.gotNumbers[i.number]||e++}return e},HotHandler.prototype.addItems=function(t){for(var e=this.boardList.items,r=0;r<t.length;r++){var i=t[r];null===i||this.gotNumbers[i.number]||(e.push(i),this.gotNumbers[i.number]=!0)}},HotHandler.prototype.isEnded=function(){return this.status===e.ENDING},HotHandler.prototype.end=function(){this.status=e.ENDING},HotHandler.prototype.onData=function(t){if(Logger.info("HotHandler",this.status),this.status!==e.ENDING){if(this.status===e.BEGINNING){if(-1!==t.getAllTexts().join("").indexOf("(G)oodbye"))return this.client.write("c\r\n/\u71b1\u9580\r\n\r\n"),void this.changeStatus(e.HOT_LIST);this.client.write("q")}if(this.status===e.HOT_LIST||this.status===e.WAIT_MORE){for(var r=this.parseList(t.getAllTexts(),t),i=0;i<r.length;i++)if(null===r[i])return;var n=this.checkItems(r);0===n?(this.callback(null,this.boardList),this.changeStatus(e.ENDING)):n===r.length&&(this.addItems(r),this.enterNewPage())}}},module.exports=HotHandler}(),function(){function t(t){for(var e=0,r=0;r<t.length;r++){var i=parseInt(t[r][1]);i&&(e=i)}return e}function e(t,e){var r=t.substring(33,80).fixFullWidthCharacters(),i=/^.*\[(.*)\]/,n=i.exec(r),s=n?n[1]:"",a=r.replace(i,"").stripSpace(),o=t.substring(17,30).removeSpace(),l=t.substring(1,7).removeSpace();l.length>=1&&!l[0].match(/\d|\u2605/)&&(l=l.substring(1));var u=0,c=!1;"\u2605"===l?c=!0:(u=parseInt(l),1e5>u&&(u+=1e5*e));var h=t.substring(9,11).removeSpace(),d=0;d="\u7206"===h?100:"X"===h[0]?"X"===h[1]?-100:-10*parseInt(h[1]):""===h?0:parseInt(h);var g="normal";":"===t[31]?g="reply":"\u8f49"===t[31]?g="xpost":"-"===o&&(g="deleted");var f=t.substring(11,16).removeSpace(),p="other";switch(t[8]){case"+":p="unread";break;case"~":p="unreadComment";break;case" ":p="normal";break;case"!":p="locked"}return!c&&(0>=u||isNaN(u))||""===o||""===a?null:{title:a,tag:s,author:o,score:d,number:u,type:g,pinned:c,date_without_year:f,status:p}}function r(t){for(var e=0,r=t.length-1;r>=0&&t[r].pinned!==!1;r--)t[r].number=e,e--}function i(t,e){function r(t){if(e.score){var r=e.score;if(r>=0){if(t.score<r)return!1}else if(r-t.score<-10)return!1}if(e.title){var i=e.title.toLowerCase(),n=("["+t.tag+"] "+t.title).toLowerCase();if(-1===n.indexOf(i))return!1}if(e.author){var s=e.author.toLowerCase();if(-1===t.author.toLowerCase().indexOf(s))return!1}return!0}for(var i=0;i<t.length;i++)if(r(t[i])===!1)return!1;return!0}function n(t,e){var r=t.length;if(r>e)return t.substring(r-e,r);for(var i="",n=0;e-r>n;n++)i+=" ";return i+t}var s={BEGINNING:"beginning",ENTERING:"entering",GETTING_INFO:"getting_info",SEARCHING:"searching",JUMPING:"jumping",PHASE_A:"phase_a",GETTING_ARTICLES:"getting_articles",ENDING:"ending"};BoardHandler=function(t,e,r,i,n){4===arguments.length&&(n=i,i=r,r={}),this.client=t,this.name=e,this.criteria=r,this.pivot=i,this.callback=n,this.board={name:e,articles:[]}},BoardHandler.prototype.start=function(){"article"===term.position.type&&term.position.boardName===this.name&&(this.client.write("q"),term.position.type="board",delete term.position.articleNum),"board"===term.position.type&&term.position.boardName===this.name?JSON.stringify(term.position.criteria)===JSON.stringify(this.criteria)?(this.client.write("[A"),this.changeStatus(s.JUMPING)):Object.keys(term.position.criteria).length>0?(this.enterBoard(this.name),this.changeStatus(s.BEGINNING)):(this.client.write("[A"),this.changeStatus(s.SEARCHING)):(this.enterBoard(this.name),this.changeStatus(s.BEGINNING))},BoardHandler.prototype.enterBoard=function(){this.client.write("qqqs")},BoardHandler.prototype.changeStatus=function(t){Logger.info("BoardHandler: "+this.status+" -> "+t),this.status=t},BoardHandler.prototype.parseAndMergeInfo=function(t){this.board.title=t[5].substr(21).fixFullWidthCharacters().removeTailingSpace(),this.board.boardMasters=t[6].substr(15).fixFullWidthCharacters().removeTailingSpace(),this.board.dislikable="\u958b \u653e"===t[13].substr(6,3)},BoardHandler.prototype.parseArticles=function(r){var i=t(r),n=r.slice(3,23).map(function(t){return e(t,i)}).filter(function(t){return null!==t});return n},BoardHandler.checkSixthDigit=t,BoardHandler.parseArticle=e,BoardHandler.prototype.isInBoard=function(){return this.status===s.GETTING_ARTICLES||this.status===s.ENDING},BoardHandler.prototype.isEnded=function(){return this.status===s.ENDING},BoardHandler.prototype.end=function(){this.status=s.ENDING},BoardHandler.prototype.onData=function(t){if(Logger.info("BoardHandler",this.status),this.status!==s.ENDING){if(this.status===s.BEGINNING&&" \u3010  \u9078 \u64c7 \u770b \u677f  \u3011"===t.getText(0,0,14)&&(this.client.write(this.name+"\r\n"),this.changeStatus(s.ENTERING)),this.status===s.ENTERING)if("\u3010  \u9078 \u64c7 \u770b \u677f   \u3011"!==t.getText(0,0,14)&&"  \u6587 \u7ae0 \u9078 \u8b80  (y) \u56de \u61c9(X) \u63a8 \u6587(^X) \u8f49 \u9304 (=[]<>) \u76f8 \u95dc \u4e3b \u984c(/?a) \u627e \u6a19 \u984c/ \u4f5c \u8005 (b) \u9032 \u677f \u756b \u9762   "===t.getText(23,0,80)){var e=t.getText(0,0,80);(-1!==e.indexOf("\u3010 \u677f \u4e3b:")||-1!==e.indexOf("\u5fb5 \u6c42 \u4e2d"))&&(this.changeStatus(s.GETTING_INFO),this.client.write("i"))}else this.client.write("x");if(this.status===s.GETTING_INFO){for(var a=!1,o=0;24>o;o++)t.getText(o,0,40).removeSpace().toLowerCase()==="\u300a"+this.board.name.toLowerCase()+"\u300b\u770b\u677f\u8a2d\u5b9a"&&(a=!0);a&&"\u8acb \u6309 \u4efb \u610f \u9375 \u7e7c \u7e8c"===t.getText(23,33,46)&&(this.parseAndMergeInfo(t.getAllTexts()),this.changeStatus(s.SEARCHING),this.client.write("x"))}if(this.status===s.SEARCHING&&"  \u6587 \u7ae0 \u9078 \u8b80  (y) \u56de \u61c9(X) \u63a8 \u6587(^X) \u8f49 \u9304 (=[]<>) \u76f8 \u95dc \u4e3b \u984c(/?a) \u627e \u6a19 \u984c/ \u4f5c \u8005 (b) \u9032 \u677f \u756b \u9762   "===t.getText(23,0,80)&&(this.criteria.title&&this.client.write("/"+this.criteria.title+"\r\n"),this.criteria.score&&this.client.write("Z"+this.criteria.score+"\r\n"),this.criteria.author&&this.client.write("a"+this.criteria.author+"\r\n"),this.changeStatus(s.JUMPING)),this.status===s.JUMPING&&"[ \u2190] \u96e2 \u958b [ \u2192] \u95b1 \u8b80 [Ctrl-P] \u767c \u8868 \u6587 \u7ae0 [d] \u522a \u9664 [z] \u7cbe \u83ef \u5340 [i] \u770b \u677f \u8cc7 \u8a0a/ \u8a2d \u5b9a [h] \u8aaa \u660e   "===t.getText(1,0,80))return this.client.write(null!==this.pivot?this.pivot+"\r\n":"$kk"),t.position={type:"board",boardName:this.name,criteria:this.criteria},void this.changeStatus(s.GETTING_ARTICLES);if(this.status===s.GETTING_ARTICLES&&"[ \u2190] \u96e2 \u958b [ \u2192] \u95b1 \u8b80 [Ctrl-P] \u767c \u8868 \u6587 \u7ae0 [d] \u522a \u9664 [z] \u7cbe \u83ef \u5340 [i] \u770b \u677f \u8cc7 \u8a0a/ \u8a2d \u5b9a [h] \u8aaa \u660e   "===t.getText(1,0,80)){var l=!1;if(null===this.pivot)l=!0;else for(var o=0;o<t.rows;o++){var u=t.getText(o,0,80);u.substring(2,7).removeSpace()===n(this.pivot+"",5).removeSpace()&&(l=!0)}if(l===!0){var c=this.parseArticles(t.getAllTexts()),h=i(c,this.criteria);h?(this.board.articles=this.board.articles.concat(c),r(this.board.articles),this.callback(null,this.board),this.changeStatus(s.ENDING)):setTimeout(function(){0===this.board.articles.length&&this.status===s.GETTING_ARTICLES&&(this.callback(null,this.board),this.changeStatus(s.ENDING))}.bind(this),3e3)}}}},module.exports=BoardHandler}(),function(){function t(t){var e=/\d+%/.exec(t),r=0/0;null!==e&&(r=parseInt(e[0]));var i=/(\d{2,5})~(\d{2,5})/.exec(t),n=0/0,s=0/0;return null!==i&&(n=parseInt(i[1])-1,s=parseInt(i[2])),isNaN(r)||isNaN(n)||isNaN(s)?null:{progress:r,startLine:n,endLine:s}}function e(t){return t?t.substring(0,78).match(/ *$/)[0]:""}function r(t){return t?t.substring(0,78).match(/^ */)[0]:""}function i(t){if(0===t.length)return"";for(var i="",n=0;n<t.length;n++){var s=!0,a=t[n+1],o=t[n],l=t[n-1];if(void 0!==a&&0!==a.removeSpace().length){var u=e(l),c=e(o),h=(e(a),r(o)),d=r(a);u&&u.length+h.length<2&&(s=!1),u&&Math.abs(u.length-c.length)<=2&&h.length==d.length&&o.match(/.*[a-zA-Z]$/)&&(s=!1);var g=/(,|[^.]\.|!|\?|:|;|\(|\)|\uff0c|\u3002|\uff01|\uff1f|\uff1a|\uff1b|\u300e|\u300f|\u300c|\u300d|\uff08|\uff09|\u2014)\s*$/,f=o.substring(0,78).match(g);null!==f&&h.length<2&&(i=i.replace(g,"$1"),s=!1),o.match(/^\s*\w/)&&a.match(/\w\s*$/)&&(s=!0)}i+=t[n].stripSpace(),s===!0&&(i+="\n")}return i}var n={BEGINNING:"beginning",SELECTING_ITEM:"selecting_item",GETTING_URL:"getting_url",GETTING_ARTICLE:"getting_article",GETTING_MORE:"getting_more",ENDING:"ending"};ArticleHandler=function(t,e,r,i,n,s){5===arguments.length&&(s=n,n=i,i=r,r={}),this.client=t,this.callback=n,this.progressCallback=s,this.prevProgress=0,this.boardName=e,this.criteria=r,this.articleNum=i,this.article={comments:[]},this.cachedTexts=[],this.parsingLine=0,this.headerEnded=!1,this.contentEnded=!1},ArticleHandler.prototype.start=function(){"article"===term.position.type&&(this.client.write("q"),term.position.type="board",delete term.position.articleNum),this.boardHandler=new BoardHandler(this.client,this.boardName,this.criteria,null,function(){}),this.boardHandler.start(),this.changeStatus(n.BEGINNING)},ArticleHandler.prototype.changeStatus=function(t){Logger.info("ArticleHandler: "+this.status+" -> "+t),this.status=t},ArticleHandler.prototype.nextPage=function(){this.status!==n.ENDING&&this.client.write("jjjjj")},ArticleHandler.prototype.parseBlocks=function(t){var e=[];if(!this.headerEnded){var r=this.parseHeader(t);this.headerEnded=!0,this.article.author=r.author,e.push({blockType:"metadata",title:r.title,tag:r.tag,author:r.author,authorNickname:r.authorNickname,date:r.date,url:this.article.url,id:this.article.id})}return e.concat(this.parseArticle(t))},ArticleHandler.prototype.parseHeader=function(t){if(t.length<3)return{author:"",authorNickname:"",tag:"",title:""};var e=t[0].fixFullWidthCharacters(),r=t[1].fixFullWidthCharacters(),i=t[2].fixFullWidthCharacters(),n=/\u4f5c\u8005  (.*) \(/.exec(e),s=n?n[1]:"",a=/\u4f5c\u8005  .* \((.*)\)/.exec(e),o=a?a[1]:"",l=/\u6a19\u984c  (Re: |Fw: )?\[(.*)\]/.exec(r),u=l?l[2]:"",c=/\u6a19\u984c  (Re: |Fw: )?(\[.*\])? (.*)/.exec(r),h=c?c[3].removeTailingSpace():"",d=/\u6642\u9593  (.*)/.exec(i),g="";if(null!==d){var f=new Date(d[1]),p=new Date(f.getTime()+288e5);g=p.toISOString()}return{author:s,authorNickname:o,tag:u,title:h,date:g}},ArticleHandler.prototype.parseQuotesAndReformatContent=function(t,e){function r(){n.push({blockType:"content",type:a.type,text:i(a.texts)})}for(var n=[],s=t,a={type:"normal",texts:[]},o=0;o<s.length;o++)if(void 0!==s[o]&&-1===s[o].indexOf("\u700f\u89bd \u7b2c")){if(":"===s[o][0]||"\u203b"===s[o][0])var l="quote",u=s[o].substr(1);else var l="normal",u=s[o];a.type!==l?(r(),a={type:l,texts:[u]},this.parsingLine=o+e+1):0===s[o].removeSpace().length?(r(),a={type:"normal",texts:[]},this.parsingLine=o+e+1):a.texts.push(u)}return n=n.filter(function(t){return""!==t.text})},ArticleHandler.prototype.parseComments=function(e,r){function n(t,e,r,i){o.push({blockType:"comment",type:t,author:e,content:r.removeTailingSpace(),datetime_without_year:i||null})}function s(t,e){n("authorComment",a.article.author,t,e)}for(var a=this,o=[],l=[],u=0;u<e.length;u++){if(null!==t(e[u])){l.length>0&&s(i(l));break}if("\u203b"!==e[u][0]&&"\u25c6"!==e[u][0]){var c=/^(\u63a8|\u5653|\u2192)\s*(.*?):(.*?)(\d+\.\d+\.\d+\.\d+\s+)?(\d\d\/\d\d( \d\d:\d\d)?)/.exec(e[u]);if(null!==c){l.length>0&&(s(i(l)),l=[],this.parsingLine=r+u+1);var h="neutral";"\u63a8"===c[1]&&(h="like"),"\u5653"===c[1]&&(h="dislike");var d=c[2],g=c[3],f=c[5];d===this.article.author?s(g,f):n(h,d,g,f),this.parsingLine=r+u+1}else l.push(e[u])}}return o},ArticleHandler.prototype.parseArticle=function(e){var r=e.map(function(t){return t.fixFullWidthCharacters()}),i=[],n=r.indexOf("\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500  "),s=Math.max(n+1,this.parsingLine),a=s;if(!this.contentEnded)for(;s<r.length;s++){if(r[s]&&null!==r[s].match(/^\u203b \u767c\u4fe1\u7ad9:/)){i.push(""),this.contentEnded=!0;break}i.push(r[s])}for(var o=s,l=[];s<r.length&&null===t(r[s]);s++)l.push(r[s]);var u=this.parseQuotesAndReformatContent(i,a),c=this.parseComments(l,o);return u.concat(c)},ArticleHandler.prototype.checkMissing=function(){"\u627e \u4e0d \u5230 \u9019 \u500b \u6587 \u7ae0 \u4ee3 \u78bc"===term.getText(22,1,18)&&this.callback({message:"missing_article"},null)},ArticleHandler.prototype.isSelected=function(){return this.status===n.SELECTING_ITEM},ArticleHandler.prototype.isInArticle=function(){return this.status==n.GETTING_ARTICLE},ArticleHandler.prototype.isEnded=function(){return this.status===n.ENDING},ArticleHandler.prototype.end=function(){this.status=n.ENDING},ArticleHandler.prototype.onData=function(e){if(Logger.info("ArticleHandler",this.status),this.status!==n.ENDING)if(this.status!==n.BEGINNING||this.boardHandler.isInBoard()||(this.boardHandler.onData(e),!this.boardHandler.isInBoard())){if(this.status===n.SELECTING_ITEM&&(this.checkMissing(),this.changeStatus(n.GETTING_URL),this.client.write("Q")),this.status===n.GETTING_URL){this.checkMissing();var r=e.getAllTexts(),i=r.indexOf(" \u250c \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2500 \u2510  ");if(-1!==i){var s=r[i+2].fixFullWidthCharacters(),a=s.match(/https?:\/\/.*\.html/);this.article.url=null===a?"":a[0];var s=r[i+1],o=s.match(/#\S{8}/);this.article.id=null===o?"":o[0],e.position={type:"article",boardName:this.boardName,criteria:this.criteria,articleNum:this.articleNum},this.changeStatus(n.GETTING_ARTICLE),this.client.write("xxx[C")}}if(this.status===n.GETTING_ARTICLE||this.status===n.GETTING_MORE){var l=t(e.getText(23,0,80));if(null!==l&&l.endLine+1>=this.cachedTexts.length){for(var u=l.startLine;u<=l.endLine;u++)this.cachedTexts[l.startLine>4?u+1:u]=e.getText(u-l.startLine,0,80);if(l.progress>this.prevProgress){this.prevProgress=l.progress,this.client.setTimeout(5e3,this);var c=this.parseBlocks(this.cachedTexts);this.progressCallback(l.progress,c)}100===l.progress?(this.callback(null),this.changeStatus(n.ENDING)):this.nextPage()}}}else if(this.changeStatus(n.SELECTING_ITEM),"string"==typeof this.articleNum)this.client.write(this.articleNum+"\r\n");else if(this.articleNum>0)this.client.write(this.articleNum+"\r\n");else{for(var h="k",u=0;u<-this.articleNum;u++)h+="k";this.client.write("1\r\n"+h)}},module.exports=ArticleHandler}(),function(){var t={BEGINNING:"beginning",ITERATING:"iterating",ENDING:"ending"};RelatedArticleHandler=function(t,e,r,i){this.client=t,this.callback=i,this.boardName=e,this.articleNum=r,this.articleDict={}},RelatedArticleHandler.prototype.start=function(){this.articleHandler=new ArticleHandler(this.client,this.boardName,this.articleNum,function(){},function(){}),this.articleHandler.start(),this.status=t.BEGINNING},RelatedArticleHandler.prototype.changeStatus=function(t){Logger.info("RelatedArticleHandler: "+this.status+" -> "+t),this.status=t},RelatedArticleHandler.prototype.isEnded=function(){return this.status===t.ENDING},RelatedArticleHandler.prototype.end=function(){this.status=t.ENDING},RelatedArticleHandler.prototype.getTimeout=function(){return 3e4},RelatedArticleHandler.prototype.onData=function(e){if(Logger.info("RelatedArticleHandler",this.status),this.status!==t.ENDING&&(this.status===t.BEGINNING&&(this.articleHandler.isInArticle()?(this.changeStatus(t.ITERATING),this.client.write("=q"),e.position.type="board",delete e.position.articleNum):this.articleHandler.onData(e)),this.status===t.ITERATING&&"  \u6587 \u7ae0 \u9078 \u8b80  (y) \u56de \u61c9(X) \u63a8 \u6587(^X) \u8f49 \u9304 (=[]<>) \u76f8 \u95dc \u4e3b \u984c(/?a) \u627e \u6a19 \u984c/ \u4f5c \u8005 (b) \u9032 \u677f \u756b \u9762   "===e.getText(23,0,80))){for(var r=!1,i=0,n=e.getAllTexts();i<n.length;i++)if(">"===n[i][0]||"\u25cf"===n[i][1]||">>"===n[i].slice(0,2)){r=!0;break}if(r){var s=BoardHandler.parseArticle(n[i],BoardHandler.checkSixthDigit(n));s&&(this.articleDict[s.number]=s),this.client.write("+");var a=Object.keys(this.articleDict).length,o=this.articleDict,l=this;setTimeout(function(){var e=Object.keys(o);e.length===a&&(l.changeStatus(t.ENDING),l.callback(null,e.map(function(t){return o[t]})))},1e3)}}},module.exports=RelatedArticleHandler}(),function(){function t(t,e){var r=t.substr(0,7).match(/\d+$/);if(null!==r)var i=parseInt(r[0]);else var i=0/0;var n=t.substr(10,13).removeSpace(),s=t.substr(30,33).removeHeadingSpace().fixFullWidthCharacters(),a=t.substr(67,12),o=t.substr(23,6).removeSpace(),l="\u02c7"===t[9],u=t.substr(64,3).removeSpace(),c="",h=0,d=">"===t[0]||"\u25cf"===t[1]||">>"===t.substr(0,2);if("HOT"===u)c="hot";else if("\u7206!"===u)switch(e){case 1:c="red";break;case 2:c="green";break;case 3:c="yellow";break;case 4:c="blue";break;case 5:c="purple";break;case 6:c="cyan";break;case 7:c="white"}else c="count",h=""===u||"V"===u?0:parseInt(u);return(isNaN(h)||0>h||h>=100)&&(h=0),isNaN(i)||0>=i?null:"MyFavFolder"===n?{type:"directory",number:i,name:s,_hasCursor:d}:"------------"===n?{type:"separator",number:i,_hasCursor:d}:""===n?null:{type:"boardItem",number:i,boardItem:{name:n,title:s,boardMasters:a,tag:o,viewerSign:c,viewerCount:h,hasUnread:l,favorited:!0,isAccessible:"[\u7981\u5165]"===o?!1:!0},_hasCursor:d}}var e={BEGINNING:"beginning",FOLLOWING_PATH:"following_path",FAVORITES_LIST:"favorites_list",GOT_PAGE:"got_page",ENDING:"ending"};FavoritesHandler=function(t,e,r){this.client=t,this.path=e,this.hasPath=0!==e.length,this.callback=r,this.boardList={type:"favorites",items:[]},this.gotNumbers=[],this.isEmpty=!1,term.position={type:"favorites"}},FavoritesHandler.prototype.start=function(){this.enterList(),this.status=e.BEGINNING},FavoritesHandler.prototype.enterList=function(){this.client.write("[Aqqq")},FavoritesHandler.prototype.enterNewPage=function(){this.client.write("[5~"),this.changeStatus(e.FAVORITES_LIST)},FavoritesHandler.prototype.changeStatus=function(t){Logger.info("FavoritesHandler: "+this.status+" -> "+t),this.status=t},FavoritesHandler.prototype.parseList=function(e,r){for(var i=3,n=[],s=i;23>s;s++)if(""!==e[s].removeSpace()){if(-1!==e[s].indexOf("---  \u7a7a \u76ee \u9304 \uff0c \u8acb \u6309 a  \u65b0 \u589e \u6216 \u7528 y  \u5217 \u51fa \u5168 \u90e8 \u770b \u677f \u5f8c \u6309 z  \u589e \u522a ---")){this.isEmpty=!0;break}var a=t(e[s],r.getColor(s,65).frontground,r.getColor(s,10).frontground);null===a&&Logger.info(e[s]),n.push(a)}return n},FavoritesHandler.prototype.checkItems=function(t){for(var e=(this.boardList.items,0),r=0;r<t.length;r++){var i=t[r];null===i||this.gotNumbers[i.number]||e++}return e},FavoritesHandler.prototype.addItems=function(t){for(var e=this.boardList.items,r=0;r<t.length;r++){var i=t[r];null===i||this.gotNumbers[i.number]||(e.push(i),this.gotNumbers[i.number]=!0)}},FavoritesHandler.prototype.isEnded=function(){return this.status===e.ENDING},FavoritesHandler.prototype.end=function(){this.changeStatus(e.ENDING)},FavoritesHandler.prototype.isInList=function(){return this.status===e.FAVORITES_LIST},FavoritesHandler.prototype.onData=function(t){function r(){if(this.status===e.FAVORITES_LIST){for(var r=this.parseList(t.getAllTexts(),t),i=0;i<r.length;i++)if(null===r[i])return;for(var n=!1,s=-1,i=0;i<r.length;i++)1===r[i].number&&(n=!0),r[i]._hasCursor&&(s=r[i].number);this.isEmpty?(this.callback(null,this.boardList),this.changeStatus(e.ENDING)):0===this.boardList.items.length&&s<r.length||(this.addItems(r),n?(this.boardList.items.sort(function(t,e){return t.number-e.number}),this.callback(null,this.boardList),this.changeStatus(e.ENDING)):this.enterNewPage())}}if(Logger.info("FavoritesHandler",this.status),this.status!==e.ENDING){if(this.status===e.BEGINNING){if(-1!==t.getAllTexts().join("").indexOf("(G)oodbye"))return this.client.write("f\r\n$"),void this.changeStatus(e.FOLLOWING_PATH);this.client.write("q")}if(this.status===e.FOLLOWING_PATH)if(0===this.path.length)this.changeStatus(e.FAVORITES_LIST);else{var i=this.path.shift();this.client.write(i+"\r\n\r\n$")}this.status===e.FAVORITES_LIST&&(0===this.boardList.items.length&&this.hasPath?setTimeout(r.bind(this),3e3):r.bind(this)())}},module.exports=FavoritesHandler}(),function(){var t={BEGINNING:"beginning",ADDING_BOARD:"adding_board",ENDING:"ending"};FavoritesAddHandler=function(t,e,r,i){this.client=t,this.path=e,this.boardName=r,this.callback=i},FavoritesAddHandler.prototype.start=function(){this.favoritesHandler=new FavoritesHandler(this.client,this.path,function(){}),this.favoritesHandler.start(),this.status=t.BEGINNING},FavoritesAddHandler.prototype.changeStatus=function(t){Logger.info("FavoritesAddHandler: "+this.status+" -> "+t),this.status=t},FavoritesAddHandler.prototype.isEnded=function(){return this.status===t.ENDING},FavoritesAddHandler.prototype.end=function(){this.changeStatus(t.ENDING)},FavoritesAddHandler.prototype.onData=function(e){Logger.info("FavoritesAddHandler",this.status),this.status!==t.ENDING&&(this.status===t.BEGINNING&&(this.favoritesHandler.onData(e),(this.favoritesHandler.isInList()||this.favoritesHandler.isEnded())&&(this.favoritesHandler.end(),this.changeStatus(t.ADDING_BOARD))),this.status===t.ADDING_BOARD&&(this.client.write("a"+this.boardName+"\r\n"),this.callback(null),this.changeStatus(t.ENDING)))},module.exports=FavoritesAddHandler}(),function(){var t={BEGINNING:"beginning",REMOVING_BOARD:"removing_board",ENDING:"ending"};FavoritesRemoveHandler=function(t,e,r,i){this.client=t,this.path=e,this.boardName=r,this.callback=i},FavoritesRemoveHandler.prototype.start=function(){this.favoritesHandler=new FavoritesHandler(this.client,this.path,function(){}),this.favoritesHandler.start(),this.status=t.BEGINNING},FavoritesRemoveHandler.prototype.changeStatus=function(t){Logger.info("FavoritesHandler: "+this.status+" -> "+t),this.status=t},FavoritesRemoveHandler.prototype.isEnded=function(){return this.status===t.ENDING},FavoritesRemoveHandler.prototype.end=function(){this.status=t.ENDING},FavoritesRemoveHandler.prototype.onData=function(e){Logger.info("FavoritesRemoveHandler",this.status),this.status!==t.ENDING&&(this.status===t.BEGINNING&&(this.favoritesHandler.onData(e),(this.favoritesHandler.isInList()||this.favoritesHandler.isEnded())&&(this.favoritesHandler.end(),this.changeStatus(t.REMOVING_BOARD))),this.status===t.REMOVING_BOARD&&(this.client.write(""+this.boardName+"\r\ndy\r\n"),this.callback(null),this.changeStatus(t.ENDING)))},module.exports=FavoritesRemoveHandler}(),function(){var t={BEGINNING:"beginning",MOVING_BOARD:"moving_board",ENDING:"ending"};FavoritesMoveHandler=function(t,e,r,i,n){this.client=t,this.path=e,this.from=r,this.to=i,this.callback=n},FavoritesMoveHandler.prototype.start=function(){this.favoritesHandler=new FavoritesHandler(this.client,this.path,function(){}),this.favoritesHandler.start(),this.status=t.BEGINNING},FavoritesMoveHandler.prototype.changeStatus=function(t){Logger.info("FavoritesHandler: "+this.status+" -> "+t),this.status=t},FavoritesMoveHandler.prototype.isEnded=function(){return this.status===t.ENDING},FavoritesMoveHandler.prototype.end=function(){this.status=t.ENDING},FavoritesMoveHandler.prototype.onData=function(e){Logger.info("FavoritesMoveHandler",this.status),this.status!==t.ENDING&&(this.status===t.BEGINNING&&(this.favoritesHandler.onData(e),(this.favoritesHandler.isInList()||this.favoritesHandler.isEnded())&&(this.favoritesHandler.end(),this.changeStatus(t.MOVING_BOARD))),this.status===t.MOVING_BOARD&&(this.client.write(this.from+"\r\nM"+this.to+"\r\n"),this.callback(null),this.changeStatus(t.ENDING)))},module.exports=FavoritesMoveHandler}(),function(){var t={BEGINNING:"beginning",POSTING:"posting",ENDING:"ending"};CommentHandler=function(t,e,r,i,n,s){switch(this.client=t,this.callback=s,this.content=n,this.type=i,i){case"like":this.typeNum=1;break;case"dislike":this.typeNum=2;break;case"neutral":this.typeNum=3}this.boardName=e,this.articleNum=r},CommentHandler.prototype.start=function(){this.articleHandler=new ArticleHandler(this.client,this.boardName,this.articleNum,function(){},function(){}),this.articleHandler.start(),this.status=t.BEGINNING},CommentHandler.prototype.changeStatus=function(t){Logger.info("CommentHandler: "+this.status+" -> "+t),this.status=t},CommentHandler.prototype.isEnded=function(){return this.status===t.ENDING},CommentHandler.prototype.end=function(){this.status=t.ENDING},CommentHandler.prototype.onData=function(e){if(Logger.info("CommentHandler",this.status),this.status!==t.ENDING&&(this.status===t.BEGINNING&&(this.articleHandler.isSelected()?(this.changeStatus(t.POSTING),this.client.write("%")):this.articleHandler.onData(e)),this.status===t.POSTING))if("\u4f5c \u8005 \u672c \u4eba"===e.getText(22,1,8)||"\u6642 \u9593 \u592a \u8fd1"===e.getText(22,1,8))this.client.write(this.content+"\r\ny\r\n"),this.callback(null),this.changeStatus(t.ENDING);
else if("\u60a8 \u89ba \u5f97 \u9019 \u7bc7 \u6587 \u7ae0"===e.getText(23,1,14))this.client.write(this.typeNum+""),this.client.write(this.content+"\r\ny\r\n"),this.callback(null),this.changeStatus(t.ENDING);else if(-1!=e.getText(23,0,80).indexOf("\u672c \u677f \u7981 \u6b62 \u5feb \u901f \u9023 \u7e8c \u63a8 \u6587")){var r=e.getText(23,0,80).removeSpace(),i=/\u8acb\u518d\u7b49\s*(\d+)\s*\u79d2/,n=r.match(i);if(null!==n){var s=parseInt(n[1]);this.callback({message:"comment_delayed",delay:s}),this.changeStatus(t.ENDING)}}else pattern=/\u672a \u9054 \u770b \u677f \u767c \u6587 \u9650 \u5236:  \u767b \u5165 \u6b21 \u6578 \u672a \u6eff\s*(\d+)\s*\u767b \u5165 \u6b21 \u6578\( \u76ee \u524d\s*(\d+)\s*\u6b21\)/,match=e.getText(23,0,80).match(pattern),match&&(this.callback({message:"unsatisfied_condition",condition:"login_count",required_login_count:parseInt(match[1]),user_login_counter:parseInt(match[2])}),this.changeStatus(t.ENDING))},module.exports=CommentHandler}(),"undefined"==typeof IS_ON_IOS&&(IS_ON_IOS=!1),"undefined"==typeof IS_ON_WEB&&(IS_ON_WEB=!1),require("./uao"),require("./utils"),require("./logger"),require("./handlers/LoginHandler"),require("./handlers/LogoutHandler"),require("./handlers/HotHandler"),require("./handlers/FavoritesHandler"),require("./handlers/FavoritesAddHandler"),require("./handlers/FavoritesMoveHandler"),require("./handlers/FavoritesRemoveHandler"),require("./handlers/BoardHandler"),require("./handlers/ArticleHandler"),require("./handlers/RelatedArticleHandler"),require("./handlers/CommentHandler"),require("./handlers/BoardNameFetcher"),require("./term.js"),term=new Terminal({cols:80,rows:24,screenKeys:!0}),term.position={type:"unknown"},term.isLogging=!0;var handler=null,client,registerNextHandler,byteBuffer=[],setupClient=function(){if(client&&client.destroy(),IS_ON_IOS)client={write:writeMessage};else{var t=require("net");client=t.connect(443,"ptt.cc",function(){Logger.info("Client Connected")});var e=client.write;client.write=writeMessage,client.writeByteArray=function(t){e.call(client,new Buffer(t))},client.on("data",function(t){receivedFromPTT(Array.prototype.slice.call(t,0))}),client.on("error",function(t){Logger.info("Client Error"),IS_ON_WEB&&setupServer(t)}),client.on("end",function(){Logger.info("Client Disconnected"),IS_ON_WEB&&setupServer(new Error("Socket End"))})}client.setTimeout=function(t,e){client.timeoutStamp=Math.random();var r=client.timeoutStamp;setTimeout(function(){client.timeoutStamp===r&&(e.isEnded()||(e.callback({message:"timeout"}),e.end()))},t)}};setupClient();var nextHandler=null,PTT={setupClient:setupClient,registerSendToPTTCallback:function(t){client.writeByteArray=t},receivedFromPTT:receivedFromPTT,login:function(t,e,r){registerNextHandler(new LoginHandler(client,t,e,r))},logout:function(t){term.position={type:"unknown"},registerNextHandler(new LogoutHandler(client,t))},getHot:function(t){registerNextHandler(new HotHandler(client,t))},getBoard:function(t,e,r){registerNextHandler(new BoardHandler(client,t,e,r))},searchBoard:function(t,e,r,i){registerNextHandler(new BoardHandler(client,t,e,r,i))},getArticle:function(t,e,r,i){registerNextHandler(new ArticleHandler(client,t,e,r,i))},getSearchedArticle:function(t,e,r,i,n){registerNextHandler(new ArticleHandler(client,t,e,r,i,n))},getRelatedArticles:function(t,e,r){registerNextHandler(new RelatedArticleHandler(client,t,e,r))},postComment:function(t,e,r,i,n){registerNextHandler(new CommentHandler(client,t,e,r,i,n))},getFavorites:function(t,e){registerNextHandler(new FavoritesHandler(client,t,e))},addFavorite:function(t,e,r){registerNextHandler(new FavoritesAddHandler(client,t,e,r))},removeFavorite:function(t,e,r){registerNextHandler(new FavoritesRemoveHandler(client,t,e,r))},moveFavorite:function(t,e,r,i){registerNextHandler(new FavoritesMoveHandler(client,t,e,r,i))},fetchBoardNames:function(t){registerNextHandler(new BoardNameFetcher(client,t))}},mainIter=function(){null!==nextHandler&&(null===handler||handler.isEnded()||(handler.callback(null),handler.end()),handler=nextHandler,nextHandler=null,handler.start()),setTimeout(mainIter,10)},refreshIter=function(){handler&&!handler.isEnded()&&handler.onData(term),setTimeout(refreshIter,500)};mainIter(),refreshIter(),module.exports=PTT;