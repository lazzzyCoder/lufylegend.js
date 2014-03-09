/**
* lufylegend
* @version 1.8.7
* @Explain lufylegend是一个HTML5开源引擎，利用它可以快速方便的进行HTML5的开发
* @author lufy(lufy_legend)
* @blog http://blog.csdn.net/lufy_Legend
* @email lufy.legend@gmail.com
* @homepage http://lufylegend.com/lufylegend
* @github https://github.com/lufylegend/lufylegend.js
*/
var OS_PC = "pc",
OS_IPHONE = "iPhone",
OS_IPOD = "iPod",
OS_IPAD = "iPad",
OS_ANDROID = "Android",
STR_ZERO = "0",
NONE = "none",
SUPER = "super",
UNDEFINED = "undefined",
LANDSCAPE = "landscape",/*横向*/
PORTRAIT = "portrait",/*纵向*/
LAjax,LTweenLite,LLoadManage,p,mouseX,mouseY;
/*
 * LEvent.js
 **/
var LEvent = function (){throw "LEvent cannot be instantiated";};
LEvent.INIT = "init",
LEvent.COMPLETE = "complete",
LEvent.ENTER_FRAME = "enter_frame",
LEvent.SOUND_COMPLETE = "sound_complete",
LEvent.END_CONTACT = "endContact",
LEvent.PRE_SOLVE = "preSolve",
LEvent.POST_SOLVE = "postSolve",
LEvent.BEGIN_CONTACT = "beginContact";
LEvent.currentTarget = null;
LEvent.addEventListener = function (n, t, f,b){
	if(b==null)b=false;
	if(n.addEventListener){
		n.addEventListener(t, f, b);
	}else if(n.attachEvent){
		n["e" + t + f] = f;
		n[t + f] = function(){n["e" + t + f]();};
		n.attachEvent("on" + t, n[t + f]);
	}
};
/*
 * LMouseEvent.js
 **/
var LMouseEvent = function (){throw "LMouseEvent cannot be instantiated";};
LMouseEvent.MOUSE_DOWN = "mousedown";
LMouseEvent.MOUSE_UP = "mouseup";
LMouseEvent.TOUCH_START = "touchstart";
LMouseEvent.TOUCH_MOVE = "touchmove";
LMouseEvent.TOUCH_END = "touchend";
LMouseEvent.MOUSE_MOVE = "mousemove";
LMouseEvent.MOUSE_OUT = "mouseout";
LMouseEvent.DOUBLE_CLICK = "dblclick";
/*
 * LMouseEventContainer.js
 **/
function $LMouseEventContainer(){
	var s = this;
	s.mouseDownContainer = [];
	s.mouseUpContainer = [];
	s.mouseMoveContainer = [];
	s.textFieldInputContainer = [];
};
$LMouseEventContainer.prototype = {
	pushInputBox:function(d){
		var s  = this,c = s.textFieldInputContainer;
		for(var i=0,l=c.length;i<l;i++){
			if(d.objectIndex == c[i].objectIndex)return;
		}
		s.textFieldInputContainer.push(d);
	}
	,removeInputBox:function(d){
		var s  = this,c = s.textFieldInputContainer;
		for(var i=0,l=c.length;i<l;i++){
			if(d.objectIndex == c[i].objectIndex){
				s.textFieldInputContainer.splice(i,1);
				break;
			}
		}
	}
	,addEvent:function(o,list,f){
		var s = this;
		if(s.hasEvent(o,list))return;
		list.push({container:o,listener:f});
	}
	,removeEvent:function(o,list,f){
		var s = this;
		for(var i=0,l=list.length;i<l;i++){
			if(list[i].container.objectIndex === o.objectIndex && (!f || list[i].listener == f)){
				list.splice(i,1);
				break;
			}
		}
	}
	,addMouseDownEvent:function(o,f){
		var s = this;
		s.addEvent(o,s.mouseDownContainer,f);
	}
	,addMouseUpEvent:function(o,f){
		var s = this;
		s.addEvent(o,s.mouseUpContainer,f);
	}
	,addMouseMoveEvent:function(o,f){
		var s = this;
		s.addEvent(o,s.mouseMoveContainer,f);
	}
	,addMouseEvent:function(o,t,f){
		var s = this;
		if(t == LMouseEvent.MOUSE_DOWN){
			s.addMouseDownEvent(o,f);
		}else if(t == LMouseEvent.MOUSE_UP){
			s.addMouseUpEvent(o,f);
		}else{
			s.addMouseMoveEvent(o,f);
		}
	}
	,hasEvent:function(o,list){
		for(var i=0,l=list.length;i<l;i++){
			if(list[i].container.objectIndex === o.objectIndex)return true;
		}
		return false;
	}
	,removeMouseDownEvent:function(o,f){
		var s = this;
		s.removeEvent(o,s.mouseDownContainer,f);
	}
	,removeMouseUpEvent:function(o,f){
		var s = this;
		s.removeEvent(o,s.mouseUpContainer,f);
	}
	,removeMouseMoveEvent:function(o,f){
		var s = this;
		s.removeEvent(o,s.mouseMoveContainer,f);
	}
	,removeMouseEvent:function(o,t,f){
		var s = this;
		if(t == LMouseEvent.MOUSE_DOWN){
			s.removeMouseDownEvent(o,f);
		}else if(t == LMouseEvent.MOUSE_UP){
			s.removeMouseUpEvent(o,f);
		}else{
			s.removeMouseMoveEvent(o,f);
		}
	}
	,dispatchMouseEvent:function(event,type){
		var s = this;
		if(type == LMouseEvent.MOUSE_DOWN){
			s.dispatchEvent(event,s.mouseDownContainer,LMouseEvent.MOUSE_DOWN);
			s.dispatchEvent(event,s.textFieldInputContainer);
		}else if(type == LMouseEvent.MOUSE_UP){
			s.dispatchEvent(event,s.mouseUpContainer,LMouseEvent.MOUSE_UP);
		}else{
			s.dispatchEvent(event,s.mouseMoveContainer,LMouseEvent.MOUSE_MOVE);
		}
	}
    ,getRootParams:function(s){
		var p = s.parent,r = {x:0,y:0,scaleX:1,scaleY:1};
		while(p != "root"){
			r.x *= p.scaleX;
			r.y *= p.scaleY;
			r.x += p.x;
			r.y += p.y;
			r.scaleX *= p.scaleX;
			r.scaleY *= p.scaleY;
			p = p.parent;
		}
		return r;
    }
	,dispatchEvent:function(event,list,type){
		var self = this,sp,co,st=[],o;
		for(var i=0,l=list.length;i<l;i++){
			sp = list[i].container || list[i];
            if(!sp || (typeof sp.mouseChildren != UNDEFINED && !sp.mouseChildren) || !sp.visible)continue;
            var co = self.getRootParams(sp);
            if(!type && sp.mouseEvent){
				sp.mouseEvent(event,LMouseEvent.MOUSE_DOWN,co);
            	continue;
            }
            if(sp.ismouseon(event,co)){
            	st.push({sp:sp,co:co,listener:list[i].listener});
            }
		}
		if(st.length == 0)return;
		if(st.length > 1){
			st = st.sort(self._sort);
		}
		o = st[0];
		event.clickTarget = o.sp;
		event.event_type = type;
		event.selfX = (event.offsetX - o.co.x - o.sp.x)/(o.co.scaleX*o.sp.scaleX);
		event.selfY = (event.offsetY - o.co.y - o.sp.y)/(o.co.scaleY*o.sp.scaleY);
		o.listener(event);
	}
	,set:function(t,v){
		LGlobal.mouseEventContainer[t] = v;
	}
	,_sort:function(a,b){
		var s = LMouseEventContainer,o1,o2,p;
		var al=s._getSort(a.sp),bl=s._getSort(b.sp);
		for(var i=0,l1=al.length,l2=bl.length;i<l1 && i<l2;i++){
			o1 = al[i],o2 = bl[i];
			if(o1.objectIndex == o2.objectIndex){
				p = o1;
				continue;
			}
			return o1.parent.getChildIndex(o1) < o2.parent.getChildIndex(o2);
		}
		return al.length < bl.length;
	}
	,_getSort:function(layer){
		var p = layer.parent,list=[layer];
		while(p != "root"){
	        list.unshift(p);
			p = p.parent;
		}
		return list;
	}
};
var LMouseEventContainer = new $LMouseEventContainer();

/*
 * LKeyboardEvent.js
 **/
var LKeyboardEvent = function (){throw "LKeyboardEvent cannot be instantiated";};
LKeyboardEvent.KEY_DOWN = "keydown";
LKeyboardEvent.KEY_UP = "keyup";
LKeyboardEvent.KEY_PASS = "keypass";
/*
 * LAccelerometerEvent.js
 **/
var LAccelerometerEvent = function (){throw "LAccelerometerEvent cannot be instantiated";};
LAccelerometerEvent.DEVICEMOTION = "devicemotion";
/*
 * LMath.js
 **/
var LMath = {
	trim:function (s){
		return s.replace(/(^\s*)|(\s*$)|(\n)/g, "");
	},
	leftTrim:function (s){
		return s.replace(/(^\s*)|(^\n)/g, "");
	},
	rightTrim:function (s){
		return s.replace(/(\s*$)|(\n$)/g, "");
	},
	numberFormat:function (s,l){
		if (!l || l < 1) {
			l = 3;
		}
		s=String(s).split(".");
		s[0]=s[0].replace(new RegExp('(\\d)(?=(\\d{'+l+'})+$)','ig'),"$1,");
		return s.join(".");
	},
	isString:function (s){
		var p=/^([a-z]|[A-Z])+$/;
		return p.exec(s); 
	},
	isNumber:function (s){
		var p=/^\d+\.\d+$/;
		return p.exec(s); 
	},
	isInt:function (s){
		var p=/^\d+$/;
		return p.exec(s); 
	}
};
function LStageAlign(){throw "LStageAlign cannot be instantiated";}
LStageAlign.TOP = "T";
LStageAlign.BOTTOM = "B";
LStageAlign.LEFT = "L";
LStageAlign.RIGHT = "Re";
LStageAlign.TOP_LEFT = "TL";
LStageAlign.TOP_RIGHT = "TR";
LStageAlign.TOP_MIDDLE = "TM";
LStageAlign.BOTTOM_LEFT = "BL";
LStageAlign.BOTTOM_RIGHT = "BR";
LStageAlign.BOTTOM_MIDDLE = "BM";
LStageAlign.MIDDLE = "M";
function LStageScaleMode(){throw "LStageScaleMode cannot be instantiated";}
LStageScaleMode.EXACT_FIT = "exactFit";
LStageScaleMode.SHOW_ALL = "showAll";
LStageScaleMode.NO_BORDER = "noBorder";
LStageScaleMode.NO_SCALE = "noScale";
/*
 * LGlobal.js
 **/
var LGlobal = function (){throw "LGlobal cannot be instantiated";};
/*
设置全屏
*/
LGlobal.FULL_SCREEN="full_screen";
LGlobal.type = "LGlobal";
LGlobal.traceDebug = false;
LGlobal.aspectRatio = NONE;
LGlobal.script = null;
LGlobal.stage = null;
LGlobal.canvas = null;
LGlobal.width = 0;
LGlobal.height = 0;
LGlobal.box2d = null;
LGlobal.speed = 50;
LGlobal.IS_MOUSE_DOWN = false;
LGlobal.objectIndex = 0;
LGlobal.preventDefault = true;
LGlobal.childList = new Array();
LGlobal.buttonList = new Array();
LGlobal.stageScale = "noScale";
LGlobal.align = "M";
LGlobal.canTouch = false;
LGlobal.os = OS_PC;
LGlobal.ios = false;
LGlobal.android = false;
LGlobal.android_new = false;
LGlobal.backgroundColor = null;
LGlobal.destroy = true;
LGlobal.devicePixelRatio = window.devicePixelRatio || 1;
LGlobal.startTimer = 0;
LGlobal.mouseEventContainer = {};
LGlobal.keepClear = true;
(function(n){
	if (n.indexOf(OS_IPHONE) > 0) {
		LGlobal.os = OS_IPHONE;
		LGlobal.canTouch = true;
		LGlobal.ios = true;
	}else if (n.indexOf(OS_IPOD) > 0) {
		LGlobal.os = OS_IPOD;
		LGlobal.canTouch = true;
		LGlobal.ios = true;
	}else if (n.indexOf(OS_IPAD) > 0) {
		LGlobal.os = OS_IPAD;
		LGlobal.ios = true;
		LGlobal.canTouch = true;
	}else if (n.indexOf(OS_ANDROID) > 0) {
		LGlobal.os = OS_ANDROID;
		LGlobal.canTouch = true;
		LGlobal.android = true;
		var i = n.indexOf(OS_ANDROID);
		if(parseInt(n.substr(i+8,1)) > 3){
			LGlobal.android_new = true;
		}
	}
})(navigator.userAgent);
LGlobal.setDebug = function (v){
	LGlobal.traceDebug = v; 
};
LGlobal.setCanvas = function (id,w,h){
	LGlobal.id = id;
	LGlobal.window = window;
	LGlobal.object = document.getElementById(id);
	LGlobal.object.innerHTML='<div style="position:absolute;margin:0px 0px 0px 0px;overflow:visible;-webkit-transform: translateZ(0);z-index:0;">'+
	'<canvas id="' + LGlobal.id + '_canvas" style="margin:0px 0px 0px 0px;width:'+w+'px;height:'+h+'px;">'+
	'<div id="noCanvas">'+
	"<p>Hey there, it looks like you're using Microsoft's Internet Explorer. Microsoft hates the Web and doesn't support HTML5 :(</p>"+ 
	'</div>'+  
	'</canvas></div>'+
	'<div id="' + LGlobal.id + '_InputText" style="position:absolute;margin:0px 0px 0px 0px;z-index:10;display:none;">'+
	'<textarea rows="1" id="' + LGlobal.id + '_InputTextareaBox" style="resize:none;background:transparent;border:0px;"></textarea>'+
	'<input type="text" id="' + LGlobal.id + '_InputTextBox"  style="background:transparent;border:0px;" /><input type="password" id="' + LGlobal.id + '_passwordBox"  style="background:transparent;border:0px;" /></div>';
	LGlobal.canvasObj = document.getElementById(LGlobal.id+"_canvas");
	LGlobal._canvas=document.createElement("canvas");
	LGlobal._context=LGlobal._canvas.getContext("2d");
	LGlobal.inputBox = document.getElementById(LGlobal.id + '_InputText');
	LGlobal.inputTextareaBoxObj = document.getElementById(LGlobal.id + '_InputTextareaBox');
	LGlobal.inputTextBoxObj = document.getElementById(LGlobal.id + '_InputTextBox');
	LGlobal.passwordBoxObj = document.getElementById(LGlobal.id + '_passwordBox');
	LGlobal.inputTextField = null;
	if(w){LGlobal.canvasObj.width = w;}
	if(h){LGlobal.canvasObj.height = h;}
	LGlobal.width = LGlobal.canvasObj.width;
	LGlobal.height = LGlobal.canvasObj.height;
	LGlobal.canvas = LGlobal.canvasObj.getContext("2d");
	LGlobal.offsetX = 0;
	LGlobal.offsetY = 0;
	LGlobal.stage = new LSprite();
	LGlobal.stage.parent = "root";
	LGlobal.childList.push(LGlobal.stage);
	if(LSystem.sv == LStage.FULL_SCREEN){LGlobal.resize();}
	if(LGlobal.canTouch){
		LEvent.addEventListener(LGlobal.canvasObj,LMouseEvent.TOUCH_START,function(event){
			if(LGlobal.inputBox.style.display != NONE){
				LGlobal.inputTextField.text = LGlobal.inputTextBox.value;
				LGlobal.inputBox.style.display = NONE;
			}
			var canvasX = parseInt(STR_ZERO+LGlobal.object.style.left)+parseInt(LGlobal.canvasObj.style.marginLeft),
			canvasY = parseInt(STR_ZERO+LGlobal.object.style.top)+parseInt(LGlobal.canvasObj.style.marginTop),eve;
			eve = {offsetX:(event.touches[0].pageX - canvasX)
			,offsetY:(event.touches[0].pageY - canvasY)};
			eve.offsetX = LGlobal.scaleX(eve.offsetX);
			eve.offsetY = LGlobal.scaleY(eve.offsetY);
			mouseX = LGlobal.offsetX = eve.offsetX;
			mouseY = LGlobal.offsetY = eve.offsetY;
			LGlobal.mouseEvent(eve,LMouseEvent.MOUSE_DOWN);
			LGlobal.buttonStatusEvent = eve;
			LGlobal.IS_MOUSE_DOWN = true;
			if(LGlobal.IS_MOUSE_DOWN && LGlobal.box2d != null && LGlobal.mouseJoint_start){
				LGlobal.mouseJoint_start(eve);
			}
			LGlobal.touchHandler(event);
		});
		LEvent.addEventListener(document,LMouseEvent.TOUCH_END,function(event){
			var eve = {offsetX:LGlobal.offsetX,offsetY:LGlobal.offsetY};
			LGlobal.mouseEvent(eve,LMouseEvent.MOUSE_UP);
			LGlobal.touchHandler(event);
			LGlobal.IS_MOUSE_DOWN = false;
			LGlobal.buttonStatusEvent = null;
			if(LGlobal.box2d != null && LGlobal.box2d.mouseJoint){
				LGlobal.box2d.world.DestroyJoint(LGlobal.box2d.mouseJoint);
				LGlobal.box2d.mouseJoint = null;
			}
		});
		LEvent.addEventListener(LGlobal.canvasObj,LMouseEvent.TOUCH_MOVE,function(e){
			var cX = parseInt(STR_ZERO+LGlobal.object.style.left)+parseInt(LGlobal.canvasObj.style.marginLeft),
			cY = parseInt(STR_ZERO+LGlobal.object.style.top)+parseInt(LGlobal.canvasObj.style.marginTop),
			eve,h,w,de,db,mX,mY;
			eve = {offsetX:(e.touches[0].pageX - cX),offsetY:(e.touches[0].pageY - cY)};
			eve.offsetX = LGlobal.scaleX(eve.offsetX);
			eve.offsetY = LGlobal.scaleY(eve.offsetY);
			LGlobal.buttonStatusEvent = eve;
			mouseX = LGlobal.offsetX = eve.offsetX;
			mouseY = LGlobal.offsetY = eve.offsetY;
			LGlobal.mouseEvent(eve,LMouseEvent.MOUSE_MOVE);
			LGlobal.touchHandler(e);
			if(LGlobal.IS_MOUSE_DOWN && LGlobal.box2d != null && LGlobal.mouseJoint_move){
				LGlobal.mouseJoint_move(eve);
			}
		});
	}else{
		LEvent.addEventListener(LGlobal.canvasObj,LMouseEvent.MOUSE_DOWN,function(e){
			if(e.offsetX == null && e.layerX != null){
				e.offsetX = e.layerX;
				e.offsetY = e.layerY;
			}
			if(LGlobal.inputBox.style.display != NONE){
				LGlobal.inputTextField.text = LGlobal.inputTextBox.value;
				LGlobal.inputBox.style.display = NONE;
			}
			var event = {button:e.button};
			event.offsetX = LGlobal.scaleX(e.offsetX);
			event.offsetY = LGlobal.scaleY(e.offsetY);
			LGlobal.mouseEvent(event,LMouseEvent.MOUSE_DOWN);
			LGlobal.IS_MOUSE_DOWN = true;
			if(LGlobal.IS_MOUSE_DOWN && LGlobal.box2d != null && LGlobal.mouseJoint_start){
				LGlobal.mouseJoint_start(e);
			}
		});
		LEvent.addEventListener(LGlobal.canvasObj,LMouseEvent.MOUSE_MOVE,function(e){
			if(e.offsetX == null && e.layerX != null){
				e.offsetX = e.layerX;
				e.offsetY = e.layerY;
			}
			var event = {};
			event.offsetX = LGlobal.scaleX(e.offsetX);
			event.offsetY = LGlobal.scaleY(e.offsetY);
			LGlobal.buttonStatusEvent = event;
			mouseX = LGlobal.offsetX = event.offsetX;
			mouseY = LGlobal.offsetY = event.offsetY;
			LGlobal.mouseEvent(event,LMouseEvent.MOUSE_MOVE);
			if(LGlobal.IS_MOUSE_DOWN && LGlobal.box2d != null && LGlobal.box2d.mouseJoint){
				LGlobal.box2d.mouseJoint.SetTarget(new LGlobal.box2d.b2Vec2(e.offsetX / LGlobal.box2d.drawScale, e.offsetY / LGlobal.box2d.drawScale));
			}
		});
		LEvent.addEventListener(LGlobal.canvasObj,LMouseEvent.MOUSE_UP,function(e){
			if(e.offsetX == null && e.layerX != null){
				e.offsetX = e.layerX;
				e.offsetY = e.layerY;
			}
			var event = {button:e.button};
			event.offsetX = LGlobal.scaleX(e.offsetX);
			event.offsetY = LGlobal.scaleY(e.offsetY);
			LGlobal.mouseEvent(event,LMouseEvent.MOUSE_UP);
			LGlobal.IS_MOUSE_DOWN = false;
			if(LGlobal.box2d != null && LGlobal.box2d.mouseJoint){
				LGlobal.box2d.world.DestroyJoint(LGlobal.box2d.mouseJoint);
				LGlobal.box2d.mouseJoint = null;
			}
		});
		LEvent.addEventListener(LGlobal.canvasObj,LMouseEvent.MOUSE_OUT,function(e){
			if(e.offsetX == null && e.layerX != null){
				e.offsetX = e.layerX;
				e.offsetY = e.layerY;
			}
			var event = {};
			event.offsetX = LGlobal.scaleX(e.offsetX);
			event.offsetY = LGlobal.scaleY(e.offsetY);
			LGlobal.mouseEvent(event,LMouseEvent.MOUSE_OUT);
			LGlobal.IS_MOUSE_DOWN = false;
		});
	}
} ;
LGlobal.touchHandler = function(e){
	e.stopPropagation();
	if(LGlobal.preventDefault)e.preventDefault();
	if(e.stopImmediatePropagation){
		e.stopImmediatePropagation();
	}
	return e;
};
LGlobal.mouseEvent = function(e,t){
	if(LGlobal.mouseEventContainer[t]){
		LMouseEventContainer.dispatchMouseEvent(e,t);
		return;
	}
    for(var k = LGlobal.childList.length - 1; k >= 0; k--) {
		if(LGlobal.childList[k].mouseEvent && LGlobal.childList[k].mouseEvent(e,t)){
			break;
		}
	}
};
LGlobal.horizontalError = function(){
	var b = new LSprite(),c='#cccccc',d='#000000';
	b.graphics.drawRoundRect(4,c,[5,5,70,100,5]);
	b.graphics.drawRect(4,c,[30,15,20,10]);
	b.graphics.drawRoundRect(4,d,[125,25,100,70,5]);
	b.graphics.drawRect(4,d,[200,50,10,20]);
	b.graphics.drawRect(4,d,[80,50,20,20]);
	b.graphics.drawVertices(4,d,[[100,40],[120,60],[100,80]]);
	addChild(b);
	var f = function(){
		setTimeout(function(){location.href=location.href;}, 100);
	};
	window.onorientationchange = f;
};
LGlobal.verticalError = function(){
	var b = new LSprite(),c='#cccccc',d='#000000';
	b.graphics.drawRoundRect(4,c,[5,25,100,70,5]);
	b.graphics.drawRect(4,c,[80,50,10,20]);
	b.graphics.drawRoundRect(4,d,[155,5,70,100,5]);
	b.graphics.drawRect(4,d,[180,15,20,10]);
	b.graphics.drawRect(4,d,[110,50,20,20]);
	b.graphics.drawVertices(4,d,[[130,40],[150,60],[130,80]]);
	addChild(b);
	var f = function(){
		setTimeout(function(){location.href=location.href;}, 100);
	};
	window.onorientationchange = f;
};
LGlobal.onShow = function (){
	if(LGlobal.canvas == null)return;
	if(LGlobal.box2d != null){
		LGlobal.box2d.show();
		if(!LGlobal.traceDebug){
			LGlobal.canvas.clearRect(0,0,LGlobal.width+1,LGlobal.height+1);
		}
	}else{
		if(LGlobal.keepClear){LGlobal.canvas.clearRect(0,0,LGlobal.width+1,LGlobal.height+1);}
		if(LGlobal.backgroundColor !== null){
			LGlobal.canvas.fillStyle=LGlobal.backgroundColor;
			LGlobal.canvas.fillRect(0,0,LGlobal.width,LGlobal.height);
		}
	}
	LGlobal.buttonShow(LGlobal.buttonList);
	LGlobal.show(LGlobal.childList);
};
LGlobal.buttonShow = function(b){
	for(var i=0,l=b.length;i<l;i++){
		if(b[i].buttonModeChange)b[i].buttonModeChange();
	}
};
LGlobal.show = function(s){
	for(var i=0,l=s.length;i<l;i++){
		if(s[i].show)s[i].show();
	}
};
LGlobal.divideCoordinate = function (w,h,row,col){
	var i,j,cw = w/col,ch = h/row,r = [];
	for(i=0;i<row;i++){
		var c=[];
		for(j=0;j<col;j++){
			c.push({x:cw*j,y:ch*i});
		}
		r.push(c);
	}
	return r;
};
LGlobal._create_loading_color = function(){
	var co = LGlobal.canvas.createRadialGradient(LGlobal.width/2, LGlobal.height, 0, LGlobal.width/2, 0, LGlobal.height);  
	co.addColorStop(0, "red");  
	co.addColorStop(0.3, "orange");  
	co.addColorStop(0.4, "yellow");  
	co.addColorStop(0.5, "green");  
	co.addColorStop(0.8, "blue");  
	co.addColorStop(1, "violet");  
	return co;
};
LGlobal.hitTestArc = function(objA,objB,objAR,objBR){
	var rA = objA.getWidth()*0.5
	,rB = objB.getWidth()*0.5
	,xA = objA.startX()
	,xB = objB.startX()
	,yA = objA.startY()
	,yB = objB.startY();
	if(typeof objAR != UNDEFINED){
		xA += (rA - objAR);
		yA += (rA - objAR);
		rA = objAR;
	}
	if(typeof objBR != UNDEFINED){
		xB += (rB - objBR);
		yB += (rB - objBR);
		rB = objBR;
	}
	var disx = xA + rA - xB - rB
	,disy = yA + rA - yB - rB;
	return disx*disx + disy*disy < (rA + rB)*(rA + rB);
};
LGlobal.hitTestRect = function(objA,objB,vecA,vecB){
	var wA = objA.getWidth()
	,wB = objB.getWidth()
	,hA = objA.getHeight()
	,hB = objB.getHeight()
	,xA = objA.x
	,xB = objB.x
	,yA = objA.y
	,yB = objB.y;
	if(typeof vecA != UNDEFINED){
		xA += (wA - vecA[0])*0.5;
		yA += (hA - vecA[1])*0.5;
		wA = vecA[0];
		hA = vecA[1];
	}
	if(typeof vecB != UNDEFINED){
		xB += (wB - vecB[0])*0.5;
		yB += (hB - vecB[1])*0.5;
		wB = vecB[0];
		hB = vecB[1];
	}
	var minx = xA > xB ? xA : xB
	,miny = yA > yB ? yA : yB
	,maxx = (xA + wA) > (xB + wB) ? (xB + wB) : (xA + wA)
	,maxy = (yA + hA) > (yB + hB) ? (yB + hB) : (yA + hA);
	return minx <= maxx && miny <= maxy;
};
LGlobal.hitTest = LGlobal.hitTestRect;
LGlobal.setFrameRate = function(s){
	if(LGlobal.frameRate)clearInterval(LGlobal.frameRate);
	LGlobal.speed = s;
	LGlobal.frameRate = setInterval(function(){LGlobal.onShow();}, s);
};
LGlobal.scaleX = function(v){
	var w = parseInt(LGlobal.canvasObj.style.width);
	return v*LGlobal.canvasObj.width/w;
};
LGlobal.scaleY = function(v){
	var h = parseInt(LGlobal.canvasObj.style.height);
	return v*LGlobal.canvasObj.height/h;
};
/*
将canvas缩放为规定大小
*/
LGlobal.setStageSize = function(w,h){
	LGlobal.canvasObj.style.width = w+"px";
	LGlobal.canvasObj.style.height = h+"px";
};
LGlobal.resize = function(){
	var w,h,t=0,l=0,ww=window.innerWidth,wh=window.innerHeight;
	switch(LGlobal.stageScale){
		case "exactFit":
			w = ww;
			h = wh;
			break;
		case "noBorder":
			w = ww;
			h = LGlobal.height*ww/LGlobal.width;
			break;
		case "showAll":
			if(ww/wh > LGlobal.width/LGlobal.height){
				h = wh;
				w = LGlobal.width*wh/LGlobal.height;
			}else{
				w = ww;
				h = LGlobal.height*ww/LGlobal.width;
			}
		default:
			switch(LGlobal.align){
				case LStageAlign.BOTTOM:
				case LStageAlign.BOTTOM_LEFT:
					t = wh - h;
					break;
				case LStageAlign.RIGHT:
				case LStageAlign.TOP_RIGHT:
					l = ww - w;
					break;
				case LStageAlign.TOP_MIDDLE:
					l = (ww - w)*0.5;
					break;
				case LStageAlign.BOTTOM_RIGHT:
					t = wh - h;
					l = ww - w;
					break;
				case LStageAlign.BOTTOM_MIDDLE:
					t = wh - h;
					l = (ww - w)*0.5;
					break;
				case LStageAlign.MIDDLE:
					t = (wh - h)*0.5;
					l = (ww - w)*0.5;
					break;
				case LStageAlign.TOP:
				case LStageAlign.LEFT:
				case LStageAlign.TOP_LEFT:
				default:
			}
			LGlobal.canvasObj.style.marginTop = t + "px";
			LGlobal.canvasObj.style.marginLeft = l + "px";
	}
	LGlobal.setStageSize(w,h);
};
var LStage = LGlobal;

var LSystem = {
	sv:0,
	sleep:function(s){
		var d = new Date();   
		while((new Date().getTime()-d.getTime()) < s){}
	},
	screen:function(a){
		LSystem.sv = a;
		if(LGlobal.stage){LGlobal.resize();}
	}
};
/*
* PageProperty.js
**/
function trace(){
	if(!LGlobal.traceDebug)return;
	var t = document.getElementById("traceObject"),i;
	if(trace.arguments.length > 0 && t == null){
		t = document.createElement("div");
		t.id = "traceObject";
		t.style.position = "absolute";
		t.style.top = (LGlobal.height + 20) + "px";
		document.body.appendChild(t);
	}
	for(i=0; i < trace.arguments.length; i++){
		t.innerHTML=t.innerHTML+trace.arguments[i] + "<br />";
	}
}
function addChild(o){
	LGlobal.stage.addChild(o);
}
function removeChild(o){
	LGlobal.stage.removeChild(o);
}
function init(s,c,w,h,f,t){
	LGlobal.speed = s;
	var _f = function (){
		if(LGlobal.canTouch && LGlobal.aspectRatio == LANDSCAPE && window.innerWidth < window.innerHeight){
			LGlobal.horizontalError();
		}else if(LGlobal.canTouch && LGlobal.aspectRatio == PORTRAIT && window.innerWidth > window.innerHeight){
			LGlobal.verticalError();
		}else{
			f();
		}
		LGlobal.startTimer = (new Date()).getTime();
	};
	if(t != null && t == LEvent.INIT){
		LGlobal.frameRate = setInterval(function(){LGlobal.onShow();}, s);
		LGlobal.setCanvas(c,w,h);
		_f();
	}else{
		LEvent.addEventListener(window,"load",function(){
			LGlobal.frameRate = setInterval(function(){LGlobal.onShow();}, s);
			LGlobal.setCanvas(c,w,h);
			_f();
		});
	}
}
function base(d,b,a){
	var p=null,o=d.constructor.prototype,h={};
	if(d.constructor.name == "Object"){
		console.warn( "When you use the extends. You must make a method like 'XX.prototype.xxx=function(){}'. but not 'XX.prototype={xxx:function(){}}'.");
	}
	for(p in o)h[p]=1;
	for(p in b.prototype){
		if(!h[p])o[p] = b.prototype[p];
		o[p][SUPER] = b.prototype;
	}
	b.apply(d,a);
}
function getTimer(){
	return (new Date()).getTime() - LGlobal.startTimer;
}
if (!Array.prototype.indexOf){
	Array.prototype.indexOf = function(elt){
		var len = this.length >>> 0;
		var from = Number(arguments[1]) || 0;
		from = (from < 0) ? Math.ceil(from) : Math.floor(from);
		if (from < 0)from += len;
		for (; from < len; from++){
			if (from in this && this[from] === elt)return from;
		}
		return -1;
	};
}
/*
 * LObject.js
 **/
function LObject(){
	this.type = "LObject";
	this.objectIndex = ++LGlobal.objectIndex;
	this.objectindex = this.objectIndex;
}
LObject.prototype = {
	callParent:function(f_n,args){
		if(!args || !f_n)return;
		return args.callee[SUPER][f_n].apply(this,args);
	},
	toString:function(){
		return "[object "+this.type+"]";
	}
};
function LMatrix(a,b,c,d,tx,ty){
	var s = this;
	if(typeof a != UNDEFINED)s.a = a;
	if(typeof b != UNDEFINED)s.b = b;
	if(typeof c != UNDEFINED)s.c = c;
	if(typeof d != UNDEFINED)s.d = d;
	if(typeof tx != UNDEFINED)s.tx = tx;
	if(typeof ty != UNDEFINED)s.ty = ty;
}
LMatrix.prototype = {
	a:1,
	b:0,
	c:0,
	d:1,
	tx:0,
	ty:0,
	setTo:function(a,b,c,d,tx,ty){
		var s = this;
		if(typeof a != UNDEFINED)s.a = a;
		if(typeof b != UNDEFINED)s.b = b;
		if(typeof c != UNDEFINED)s.c = c;
		if(typeof d != UNDEFINED)s.d = d;
		if(typeof tx != UNDEFINED)s.tx = tx;
		if(typeof ty != UNDEFINED)s.ty = ty;
		return s;
	},
	isIdentity:function(){
		var s = this;
		return (s.a == 1 && s.b == 0 && s.c == 0 && s.d == 1 && s.tx == 0 && s.ty == 0);
	},
	transform:function(c){
		var s = this;
		c.transform(s.a,s.b,s.c,s.d,s.tx,s.ty);
		return s;
	},
	toString:function(){
		return "[LMatrix]";
	}
};
/*
 * LEventDispatcher.js
 **/
function LEventDispatcher(){
	var s = this;
	base(s,LObject,[]);
	s._eventList = new Array();
}
p = {
	addEventListener:function(type,listener){
		this._eventList.push({listener:listener,type:type});
	},
	removeEventListener:function(type,listener){
		var s = this,i,length;
		length = s._eventList.length;
		for(i=0;i<length;i++){
			if(type == s._eventList[i].type && s._eventList[i].listener == listener){
				s._eventList.splice(i,1);
				return;
			}
		}
	},
	removeAllEventListener:function (){
		this._eventList = [];
	},
	dispatchEvent:function(type){
		var s = this;
		var i,length = s._eventList.length;
		for(i=0;i<length;i++){
			if(type == s._eventList[i].type){
				s.target = s;
				s.event_type = type;
				s._eventList[i].listener(s);
				return;
			}
		}
	},
	hasEventListener:function(type){
		var s = this,i,length = s._eventList.length;
		for(i=0;i<length;i++){
			if(type == s._eventList[i].type)return true;
		}
		return false;
	}
};
for(var k in p)LEventDispatcher.prototype[k]=p[k];
/*
 * LDisplayObject.js
 **/
function LDisplayObject(){
	var s = this;
	base(s,LEventDispatcher,[]);
	s.x = 0;  
	s.y = 0;  
	s.width = 0;  
	s.height = 0;  
	s.scaleX=1;
	s.scaleY=1;
	s.alpha = 1;
	s.visible=true;
	s.rotate = 0;
	s.mask = null;
	s.blendMode = null;
}
p = {
	show:function (){
		var s = this,c = LGlobal.canvas;
		if(!s._canShow())return;
		c.save();
		s._showReady(c);
		if(s.blendMode){
			c.globalCompositeOperation = s.blendMode;
		}
		if(s.filters){
			s.setShadow();
		}
		s._rotateReady();
		if(s.mask != null && s.mask.show){
			s.mask.show();
			c.clip();
		}

		s._transformRotate();

		s._transformScale();

		s._coordinate(c);
		if(s.alpha < 1){
			c.globalAlpha = s.alpha;
		}
		s._show(c);
		c.restore();
		s.loopframe();
	},
	_canShow:function(){return this.visible;},
	_coordinate:function(c){
		var s = this;
		if(s.x != 0 || s.y != 0)c.transform(1,0,0,1,s.x,s.y);
	},
	_rotateReady:function(){},
	_showReady:function(c){},
	_show:function(c){},
	loopframe:function(){},
	setShadow:function(){
		var s=this,f=s.filters;
		if(!f)return;
		for(var i=0,l=f.length;i<l;i++)f[i].show();
	},
	_transformRotate:function(){
		var s = this;
		if(s.rotate == 0)return;
		var c = LGlobal.canvas,rotateFlag = Math.PI / 180,rotateObj = new LMatrix();
		if((typeof s.rotatex) == UNDEFINED){
			s.rotatex=s.rotatey=0;
		}
		if(s.box2dBody)rotateFlag=1;
		rotateObj.a = Math.cos(s.rotate * rotateFlag);
		rotateObj.b = Math.sin(s.rotate * rotateFlag);
		rotateObj.c = -rotateObj.b;
		rotateObj.d = rotateObj.a;
		rotateObj.tx = s.x + s.rotatex;
		rotateObj.ty = s.y + s.rotatey;
		rotateObj.transform(c).setTo(1,0,0,1,-rotateObj.tx,-rotateObj.ty).transform(c);
	},
	_transformScale:function(){
		var s = this,c = LGlobal.canvas;
		if(s.scaleX == 1 && s.scaleY == 1)return;
		var scaleObj = new LMatrix();
		if(s.scaleX != 1)scaleObj.tx = s.x;
		if(s.scaleY != 1)scaleObj.ty = s.y;
		scaleObj.a = s.scaleX;
		scaleObj.d = s.scaleY;
		scaleObj.transform(c).setTo(1,0,0,1,-scaleObj.tx,-scaleObj.ty).transform(c);
	},
	copyProperty:function(a){
		var s = this;
		for(var k in a){
			if(typeof a[k] == "number" || typeof a[k] == "string" || typeof a[k] == "boolean"){
				if(k == "objectindex" || k == "objectIndex"){continue;}
				s[k] = a[k];
			}
		}
		if(a.mask)s.mask = a.mask.clone();
	},
	getAbsoluteScale:function(){
		var s = this;
		var sX=s.scaleX,sY=s.scaleY;
		var p = s.parent;
		while(p != "root"){
	        sX *= p.scaleX;
	        sY *= p.scaleY;
			p = p.parent;
		}
		return {scaleX:sX,scaleY:sY};
	},
	getRootCoordinate:function(){
		var s = this;
		var sx=s.x,sy=s.y;
		var p = s.parent;
		while(p != "root"){
	        sx *= p.scaleX;
	        sy *= p.scaleY;
			sx += p.x;
			sy += p.y;
			p = p.parent;
		}
		return new LPoint(sx,sy);
	},
	getBounds:function(d){
		if(typeof d == UNDEFINED)return new LRectangle(0,0,0,0);
		var s = this,x=0,y=0,w=0,h=0;
		if(s.objectIndex != d.objectIndex){
			var sp = s.getRootCoordinate();
			var dp = d.getRootCoordinate();
			x = sp.x - dp.x;
			y = sp.y - dp.y;
		}
		if(d.getWidth)w=d.getWidth();
		if(d.getHeight)h=d.getHeight();
		return new LRectangle(x,y,w,h);
	},
	getDataURL:function(){
		var s = this,_o,o,_c,c;
		o = LGlobal.canvasObj,c = LGlobal.canvas;
		_o = LGlobal._canvas,_c = LGlobal._context;
		s.width = s.getWidth();
		s.height = s.getHeight();
		_o.width = s.width;
		_o.height = s.height;
		_c.clearRect(0,0,s.width,s.height);
		LGlobal.canvasObj = LGlobal._canvas;
		LGlobal.canvas = LGlobal._context;
		s.show();
		var data = LGlobal.canvasObj.toDataURL();
		LGlobal._canvas = _o;
		LGlobal._context = _c;
		LGlobal.canvasObj = o;
		LGlobal.canvas = c;
		return data;
	},
	remove:function(){
		var s = this;
		if(!s.parent)return;
		s.parent.removeChild(s);
	}
};
for(var k in p)LDisplayObject.prototype[k]=p[k];
/*
 * LInteractiveObject.js
 **/
function LInteractiveObject(){
	var s = this;
	base(s,LDisplayObject,[]);
	s.type = "LInteractiveObject";
	s.mouseChildren = true;
	s.frameList = new Array();
	s.mouseList = new Array();
}
p = {
	addEventListener:function(type,listener){
		var s = this;
		if(type == LEvent.ENTER_FRAME){
			s.frameList.push(listener);
		}else if(type.indexOf("mouse")>=0 || type.indexOf("touch")>=0){
			if(LGlobal.mouseEventContainer[type]){
				LMouseEventContainer.addMouseEvent(s,type,listener);
				return;
			}
			s.mouseList.push({listener:listener,type:type});
		}else{
			s._eventList.push({listener:listener,type:type});
		}
	},
	removeEventListener:function(type,listener){
		var s = this,i,length;
		if(type == LEvent.ENTER_FRAME){
			length = s.frameList.length;
			for(i=0;i<length;i++){
				if(type == LEvent.ENTER_FRAME && s.frameList[i] == listener){
					s.frameList.splice(i,1);
					return;
				}
			}
		}else if(type.indexOf("mouse")>=0 || type.indexOf("touch")>=0){
			if(LGlobal.mouseEventContainer[type]){
				LMouseEventContainer.removeMouseEvent(s,type,listener);
				return;
			}
			length = s.mouseList.length;
			for(i=0;i<length;i++){
				if(type == s.mouseList[i].type && s.mouseList[i].listener == listener){
					s.mouseList.splice(i,1);
					return;
				}
			}
		}else{
			length = s._eventList.length;
			for(i=0;i<length;i++){
				if(type == s._eventList[i].type && s._eventList[i].listener == listener){
					s._eventList.splice(i,1);
					return;
				}
			}
		}
	},
	removeAllEventListener:function (){
		var s = this;
		s.frameList.length = 0;
		s.mouseList.length = 0;
		s._eventList.length = 0;
		if(LGlobal.mouseEventContainer[LMouseEvent.MOUSE_DOWN]){
			LMouseEventContainer.removeMouseEvent(s,LMouseEvent.MOUSE_DOWN);
		}
		if(LGlobal.mouseEventContainer[LMouseEvent.MOUSE_UP]){
			LMouseEventContainer.removeMouseEvent(s,LMouseEvent.MOUSE_UP);
		}
		if(LGlobal.mouseEventContainer[LMouseEvent.MOUSE_MOVE]){
			LMouseEventContainer.removeMouseEvent(s,LMouseEvent.MOUSE_MOVE);
		}
	},
	hasEventListener:function(type){
		var s = this,i,length;
		if(type == LEvent.ENTER_FRAME && s.frameList.length > 0)return true;
		if(type.indexOf("mouse")>=0 || type.indexOf("touch")>=0){
			length = s.mouseList.length;
			for(i=0;i<length;i++){
				if(type == s.mouseList[i].type)return true;
			}
		}else{
			length = s._eventList.length;
			for(i=0;i<length;i++){
				if(type == s._eventList[i].type)return true;
			}
		}
		return false;
	}
};
for(var k in p)LInteractiveObject.prototype[k]=p[k];
/*
* LLoader.js
**/
function LLoader(){
	base(this,LEventDispatcher,[]);
	var s = this;
	s.type="LLoader";
	s.loadtype = "";
	s.content = null;
	s.oncomplete = null;
	s.event = {};
}
p = {
	addEventListener:function(t,l){
		if(t == LEvent.COMPLETE){
			this.oncomplete = l;
		}
	},
	load:function (u,t){
		var s = this;
		s.loadtype = t;
		if(!t || t == "bitmapData"){
			s.content = new Image();
			s.content.onload = function(){
				s.content.onload = null;
				if(s.oncomplete){
					s.event.currentTarget = s.content;
					s.event.target = s;
					s.oncomplete(s.event);
				}
			};
			s.content.src = u; 
		}
	}
};
for(var k in p)LLoader.prototype[k]=p[k];
/*
* LURLLoader.js
**/
function LURLLoader(){
	var s = this;
	base(s,LObject,[]);
	s.type="LURLLoader";
	s.loadtype = "";
	s.content = null;
	s.oncomplete = null;
	s.event = {};
}
p = {
	addEventListener:function(t,l){
		if(t == LEvent.COMPLETE){
			this.oncomplete = l;
		}
	},
	load:function (u,t){
		var s = this;
		s.loadtype = t;
		if(!t || t == "text"){
			LAjax.get(u,{},function(data){
				if(s.oncomplete){
					s.event.currentTarget = data;
					s.event.target = s;
					s.data = data;
					if(s.oncomplete)s.oncomplete(s.event);
				}
			});
		}else if(t=="js"){
			var script = document.createElement("script");
			script.onload = function (){
				if(s.oncomplete)s.oncomplete({});
			};
			script.src = u;
			script.type = "text/javascript";
			document.querySelector('head').appendChild(script);
		}
	}
};
for(var k in p)LURLLoader.prototype[k]=p[k];
/*
 * LMedia.js 
 **/
function LMedia(){
	var s = this;
	base(s,LDisplayObject,[]);
	s.length=0;
	s.loopIndex=0;
	s.loopLength = 1;
	s.playing=false;
	s.event = {};
	s.oncomplete = null;
	s.onsoundcomplete = null;
}
LMedia.CANPLAYTHROUGH_EVENT = "canplaythrough";
LMedia.ENDED_EVENT = "ended";
p = {
	addEventListener:function(t,l){
		if(t == LEvent.COMPLETE){
			this.oncomplete = l;
		}else if(t == LEvent.SOUND_COMPLETE){
			this.onsoundcomplete = l;
		}
	},
	removeEventListener:function(t,l){
		if(t == LEvent.COMPLETE){
			this.oncomplete = null;
		}else if(t == LEvent.SOUND_COMPLETE){
			this.onsoundcomplete = null;
		}
	},
	onload:function(){
		var s=this;
		if(s.data.readyState){
			s.length=s.data.duration;
			if(s.oncomplete){
				s.event.currentTarget = s;
				s.oncomplete(s.event);
			}
			return;
		}
		s.data.addEventListener(LMedia.CANPLAYTHROUGH_EVENT, function () {
			s.onload();
		}, false);
	},
	_onended:function(){
		var s=this;
		if(s.data.ended){
			if(s.onsoundcomplete)s.onsoundcomplete();
			if(++s.loopIndex < s.loopLength){
				s.data.currentTime=0;
				s.data.play();
			}else{
				s.close();
			}
		}
	},
	load:function(u){
		var s = this,a,b,k,d,q={"mov":"quicktime","3gp":"3gpp","ogv":"ogg","m4a":"mpeg","mp3":"mpeg","wave":"wav","aac":"mp4"};
		a = u.split(',');
		for(k in a){
			b = a[k].split('.');
			d=b[b.length-1];
			if(q[d])d=q[d];
			if(s.data.canPlayType(s._type+"/"+d)){
				s.data.src = a[k];
				s.onload();
				s.data.addEventListener(LMedia.ENDED_EVENT, function(){
					s._onended();
				}, false);
				s.data.load();
				return;
			}
		}
		if(s.oncomplete)s.oncomplete({});
	},
	setVolume:function(v){
		this.data.volume=v;
	},
	getVolume:function(){
		return this.data.volume;
	},
	play:function(c,l){
		var s=this;
		if(typeof l == UNDEFINED)l=1;
		if(typeof c == UNDEFINED)c=0;
		if(c>0)s.data.currentTime=c;
		s.data.loop = false;
		s.loopIndex=0;
		s.loopLength = l;
		s.playing=true;
		s.data.play();
		s._onended();
	},
	stop:function(){
		this.playing=false;
		this.data.pause();
	},
	close:function(){
		var s=this;
		s.playing=false;
		s.data.pause();
		s.data.currentTime=0;
	}
};
for(var k in p)LMedia.prototype[k]=p[k];
/*
 * LSound.js 
 **/
function LSound(u){
	var s = this;
	base(s,LMedia,[]);
	s.type = "LSound";
	s._type="audio";
	s.data = new Audio();
	s.data.loop = false;
	s.data.autoplay = false;
	if(u)s.load(u);
}
/*
 * LVideo.js 
 **/
function LVideo(u){
	var s = this;
	base(s,LMedia,[]);
	s.type = "LVideo";
	s._type="video";
	s.x=s.y=0;
	s.visible=true;
	s.alpha=1;
	s.scaleX=s.scaleY=1;
	s.rotatex = 0;
	s.rotatey = 0;
	s.rotate = 0;
	s.data = document.createElement("video");
	s.data.style.display = "none";
	document.body.appendChild(s.data);
	s.data.id="video_"+s.objectIndex;
	s.data.loop = false;
	s.data.autoplay = false;
	if(u)s.load(u);
}
p = {
	show:function (){
		var s=this,c=LGlobal.canvas;
		if(!s.visible)return;
		c.save();
		if(s.alpha < 1){
			c.globalAlpha = s.alpha;
		}

		s._transformScale();

		s._transformRotate();
		if(s.mask != null && s.mask.show){
			s.mask.show();
			c.clip();
		}
		c.drawImage(s.data,s.x,s.y);
		c.restore();
	},
	die:function(){
		var s=this;
		document.body.removeChild(s.data);
		delete s.data;
	},
	getWidth:function(){
		return this.data.width;
	},
	getHeight:function(){
		return this.data.height;
	}
};
for(var k in p)LVideo.prototype[k]=p[k];
/*
* LPoint.js
**/
function LPoint(x,y){
	var s = this;
	s.x = x;
	s.y = y;
}
LPoint.distance = function(p1,p2){
	return LPoint.distance2(p1.x,p1.y,p2.x,p2.y);
};
LPoint.distance2 = function(x1,y1,x2,y2){
	var x = x1 - x2, y = x1 - x2;
	return Math.sqrt(x*x + y*y);
};
LPoint.interpolate = function(p1,p2,f){
	return new LPoint(p1.x+(p2.x-p1.x)*(1-f),p1.y+(p2.y-p1.y)*(1-f));
};
LPoint.polar = function(l, a){
	return new LPoint(l*Math.cos(a),l*Math.sin(a));
};
LPoint.prototype = {
	toString:function(){
		return '[object LPoint('+this.x+','+this.y+')]';
	},
	length:function(){
		return LPoint.distance2(this.x,this.y,0,0);
	},
	add:function(v){
		return LPoint(this.x+v.x,this.y+v.y);
	},
	clone:function(){
		return new LPoint(this.x,this.y);
	},
	setTo:function(x, y){
		this.x = x,this.y=y;
	},
	copyFrom:function(s){
		this.setTo(s.x,s.y);
	},
	equals:function(t){
		return this.x == t.x && this.y == t.y;
	},
	normalize:function(t){
		var s = this,scale = t/s.length();
		s.x *= scale,s.y *= scale;
	},
	offset:function(dx,dy){
		this.x += dx;
		this.y += dy;
	},
	subtract:function(v){
		return new LPoint(this.x  - v.x,this.y - v.y);
	}
};
/*
* LRectangle.js
**/
function LRectangle(x,y,w,h){
	var s = this;
	s.x = x;
	s.y = y;
	s.width = w;
	s.height=h;
	s.setRectangle();
}
LRectangle.prototype = {
	setRectangle:function(){
		var s = this;
		s.bottom = s.y + s.height;
		s.right = s.x + s.width;
		s.left = s.x;
		s.top = s.y;
	},
	clone:function(){
		var s = this;
		return new LRectangle(s.x,s.y,s.width,s.height);
	},
	contains:function(x, y){
		var s = this;
		return x>=s.x && x <= s.right && y>= s.y && y <= s.bottom;
	},
	containsRect:function(rect){
		var s = this;
		return rect.x>=s.x && rect.right <= s.right && rect.y>= s.y && rect.bottom <= s.bottom;
	},
	equals:function(v){
		var s = this;
		return v.x==s.x && v.width == s.width && v.y== s.y && v.height == s.height;
	},
	inflate:function(dx,dy){
		var s = this;
		s.width += dx;
		s.height += dy;
		s.setRectangle();
	},
	intersection:function(t){
		var s = this;
		var ix = s.x > t.x ? s.x : t.x;
		var iy = s.y > t.y ? s.y : t.y;
		var ax = s.right > t.right ? t.right : s.right;
		var ay = s.bottom > t.bottom ? t.bottom : s.bottom;
		if(ix <= ax && iy <= ay){
			return new LRectangle(ix,iy,ax,ay);
		}else{
			return new LRectangle(0,0,0,0);
		}
	},
	intersects:function(t){
		var s = this;
		var ix = s.x > t.x ? s.x : t.x;
		var iy = s.y > t.y ? s.y : t.y;
		var ax = s.right > t.right ? t.right : s.right;
		var ay = s.bottom > t.bottom ? t.bottom : s.bottom;
		return ix <= ax && iy <= ay;
	},
	isEmpty:function(){
		var s = this;
		return s.x==0 && s.y==0 && s.width==0 && s.height==0;
	},
	offset:function(dx,dy){
		var s = this;
		s.x += dx;
		s.y += dy;
		s.setRectangle();
	},
	setEmpty:function(){
		var s = this;
		s.x = 0;
		s.y = 0;
		s.width = 0;
		s.height = 0;
		s.setRectangle();
	},
	setTo:function(xa, ya, w, h){
		var s = this;
		s.x = xa;
		s.y = ya;
		s.width = w;
		s.height = h;
		s.setRectangle();
	},
	toString:function(){
		var s = this;
		return "[object LRectangle("+s.x+","+s.y+","+s.width+","+s.height+")]";
	},
	union:function(t){
		var s=this;
		return new LRectangle(s.x>t.x?t.x:s.x,s.y>t.y?t.y:s.y,s.right>t.right?s.right:t.right,s.bottom>t.bottom?s.bottom:t.bottom);
	}
};
/*
* LGraphics.js
**/
function LGraphics(){
	base(this,LObject,[]);
	var s = this;
	s.type = "LGraphics";
	s.color = "#000000";
	s.i = 0;
	s.alpha = 1;
	s.bitmap = null;
	s.setList = new Array();
	s.showList = new Array();
}
p = {
	show:function (){
		var s = this,k,l=s.setList.length;
		if(l == 0)return;
		for(k=0;k<l;k++){
			s.setList[k]();
		}
	},
	clone:function(){
		var s = this,a = new LGraphics(),i,l,c;
		a.color = s.color;
		a.i = s.i;
		a.alpha = s.alpha;
		a.bitmap = s.bitmap;
		for(i=0,l=s.setList.length;i<l;i++){
			c = s.setList[i];
			a.setList.push(c);
		}
		for(i=0,l=s.showList.length;i<l;i++){
			c = s.showList[i];
			a.showList.push(c);
		}
		return a;
	},
	lineWidth:function (t){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.lineWidth = t;});
	},
	strokeStyle:function (co){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.strokeStyle = co;});
	},
	stroke:function (){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.stroke();});
	},
	beginPath:function (){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.beginPath();});
	},
	closePath:function (){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.closePath();});
	},
	moveTo:function (x,y){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.moveTo(x,y);});
	},
	lineTo:function (x,y){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.lineTo(x,y);});
	},
	clear:function (){
		var s = this;
		s.bitmap = null;
		s.setList.splice(0,s.setList.length);
		s.showList.splice(0,s.showList.length);
	},
	rect:function (x,y,w,h){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.rect(x, y, w, h);});
		s.showList.push({type:"rect",value:[x,y,w,h]});
	},
	fillStyle:function (co){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.fillStyle = co;});
	},
	fill:function (){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.fill();});
	},
	arc:function(x,y,r,sa,ea,aw){
		var s = this;
		s.setList.push(function(){LGlobal.canvas.arc(x,y,r,sa,ea,aw);});
		s.showList.push({type:"arc",value:sa});
	},
	beginBitmapFill:function(b){
		var s = this;
		s.setList.push(function(){
			s.bitmap=b;
		});
	},
	drawArc:function(tn,lco,pa,isf,co){
		var s = this,c;
		s.setList.push(function(){
			c=LGlobal.canvas;
			c.beginPath();
			c.arc(pa[0],pa[1],pa[2],pa[3],pa[4],pa[5]);
			if(s.bitmap){
				c.save();
				c.clip();
				c.drawImage(s.bitmap.image,
						s.bitmap.x,s.bitmap.y,s.bitmap.width,s.bitmap.height,
						0,0,s.bitmap.width,s.bitmap.height);
				c.restore(); 
				s.bitmap=null;
				return;
			}
			if(isf){
				c.fillStyle = co;
				c.fill();
			}
			if(tn>0){
				c.lineWidth = tn;
				c.strokeStyle = lco;
				c.stroke();
			}
		});
		s.showList.push({type:"arc",value:pa});
	},
	drawRect:function (tn,lco,pa,isf,co){
		var s = this,c;
		s.setList.push(function(){
			c=LGlobal.canvas;
			c.beginPath();
			c.rect(pa[0],pa[1],pa[2],pa[3]);
			c.closePath();
			if(s.bitmap){
				c.save();
				c.clip();
				c.drawImage(s.bitmap.image,
						s.bitmap.x,s.bitmap.y,
						s.bitmap.width,s.bitmap.height,
						0,0,
						s.bitmap.width,s.bitmap.height);
				c.restore(); 
				s.bitmap=null;
				return;
			}
			if(isf){
				c.fillStyle = co;
				c.fill();
			}
			if(tn>0){
				c.lineWidth = tn;
				c.strokeStyle = lco;
				c.stroke();
			}
		});
		s.showList.push({type:"rect",value:pa});
	},
	drawRoundRect:function(tn,lco,pa,isf,co){
		var s = this,c;
		s.setList.push(function(){
			c=LGlobal.canvas;
			c.beginPath();
			c.moveTo(pa[0]+pa[4],pa[1]);
			c.lineTo(pa[0]+pa[2]-pa[4],pa[1]);
			c.arcTo(pa[0]+pa[2],pa[1],pa[0]+pa[2],pa[1]+pa[4],pa[4]);
			c.lineTo(pa[0]+pa[2],pa[1]+pa[3]-pa[4]);
			c.arcTo(pa[0]+pa[2],pa[1]+pa[3],pa[0]+pa[2]-pa[4],pa[1]+pa[3],pa[4]);
			c.lineTo(pa[0]+pa[4],pa[1]+pa[3]);
			c.arcTo(pa[0],pa[1]+pa[3],pa[0],pa[1]+pa[3]-pa[4],pa[4]);
			c.lineTo(pa[0],pa[1]+pa[4]);
			c.arcTo(pa[0],pa[1],pa[0]+pa[4],pa[1],pa[4]);
			c.closePath();
			if(s.bitmap){
				c.save();
				c.clip();
				c.drawImage(s.bitmap.image,
						0,0,
						s.bitmap.width,s.bitmap.height,
						0,0,
						s.bitmap.width,s.bitmap.height);
				c.restore(); 
				s.bitmap=null;
				return;
			}
			if(isf){
				c.fillStyle = co;
				c.fill();
			}
			if(tn>0){
				c.lineWidth = tn;
				c.strokeStyle = lco;
				c.stroke();
			}
		});
		s.showList.push({type:"rect",value:pa});
	},
	drawVertices:function(tn,lco,v,isf,co){
		var s = this,c;
		if(v.length < 3)return;
		s.setList.push(function(){
			c=LGlobal.canvas;
			c.beginPath();
			c.moveTo(v[0][0],v[0][1]);
			var i,l = v.length;
			for(i=1;i<l;i++){
				var pa = v[i];
				c.lineTo(pa[0],pa[1]);
			};
			c.lineTo(v[0][0],v[0][1]);
			c.closePath();
			if(s.bitmap){
				c.save();
				c.clip();
				c.drawImage(s.bitmap.image,
						s.bitmap.x,s.bitmap.y,s.bitmap.width,s.bitmap.height,
						0,0,s.bitmap.width,s.bitmap.height);
				c.restore(); 
				s.bitmap=null;
				return;
			}
			if(isf){
				c.fillStyle = co;
				c.fill();
			}
			if(tn>0){
				c.lineWidth = tn;
				c.strokeStyle = lco;
				c.closePath();
				c.stroke();
			}
		});
		s.showList.push({type:"vertices",value:v});
	},
	drawTriangles:function(ve, ind, u ,tn,lco){
		var s = this;
		var i,j,l = ind.length,c;
		s.setList.push(function(){
			c=LGlobal.canvas;
			var v = ve;
			for(i=0,j=0;i<l;i+=3){
				a=0;
				c.save();
				c.beginPath();
				c.moveTo(v[ind[i]*2],v[ind[i]*2+1]);
				c.lineTo(v[ind[i+1]*2],v[ind[i+1]*2+1]);
				c.lineTo(v[ind[i+2]*2],v[ind[i+2]*2+1]);
				c.lineTo(v[ind[i]*2],v[ind[i]*2+1]);
				c.closePath();
				if(tn){
					c.lineWidth = tn;
					c.strokeStyle = lco;
					c.stroke();
				}
				c.clip();
				if(i%6==0){
					var sw = -1;
					var w = (u[ind[i+1 + j]*2]-u[ind[i + j]*2])*s.bitmap.width;
					var h = (u[ind[i+2]*2+1]-u[ind[i]*2+1])*s.bitmap.height;
					if(j==0 && w < 0){
						for(var k=i+9;k<l;k+=3){
							if(u[ind[i+2]*2+1] == u[ind[k+2]*2+1]){
								j = k - i;
								break;
							}
						}
						if(j==0)j=(l-i);
						w = (u[ind[i+1 + j]*2]-u[ind[i + j]*2])*s.bitmap.width;
					}
					if(i + j >= l){
						w = (u[ind[i + j - l]*2]-u[ind[i+1]*2])*s.bitmap.width;
						sw = u[ind[i]*2]==1?0:s.bitmap.width*u[ind[i]*2]+w;
						if(sw > s.bitmap.width)sw -= s.bitmap.width;
					}else{
						sw = s.bitmap.width*u[ind[i + j]*2];
					}
					sh = s.bitmap.height*u[ind[i]*2+1];
					if(h < 0){
						h = (u[ind[i+2 - (i > 0?6:-6)]*2+1]-u[ind[i - (i > 0?6:-6)]*2+1])*s.bitmap.height;
						sh = 0;
					}
					var t1 = (v[ind[i+1]*2]-v[ind[i]*2])/w;
					var t2 = (v[ind[i+1]*2+1]-v[ind[i]*2+1])/w;
					var t3 = (v[ind[i+2]*2]-v[ind[i]*2])/h;
					var t4 = (v[ind[i+2]*2+1]-v[ind[i]*2+1])/h;
					c.transform(t1,t2,t3,t4, v[ind[i]*2], v[ind[i]*2+1]);
					c.drawImage(s.bitmap.image,
								s.bitmap.x+sw,
								s.bitmap.y+sh,
								w,h,
								0,0,
								w,h);
				}else{
					var sw;
					var w = (u[ind[i+2 + j]*2]-u[ind[i+1 + j]*2])*s.bitmap.width;
					var h = (u[ind[i+2]*2+1]-u[ind[i]*2+1])*s.bitmap.height;
					if(j==0 && w < 0){
						for(var k=i+9;k<l;k+=3){
							if(u[ind[i+2]*2+1] == u[ind[k+2]*2+1]){
								j = k - i;
								break;
							}
						}
						if(j==0)j=(l-i);
						w = (u[ind[i+2 + j]*2]-u[ind[i+1 + j]*2])*s.bitmap.width;
					}
					if(i+1 + j >= l){
						w = (u[ind[i+1 + j - l]*2]-u[ind[i+2]*2])*s.bitmap.width;
						sw = u[ind[i+1]*2]==1?0:s.bitmap.width*u[ind[i+1]*2]+w;
						if(sw > s.bitmap.width)sw -= s.bitmap.width;
					}else{
						sw = s.bitmap.width*u[ind[i+1 + j]*2];
					}
					sh = s.bitmap.height*u[ind[i]*2+1];
					if(h < 0){
						h = (u[ind[i+2 - (i > 0?6:-6)]*2+1]-u[ind[i - (i > 0?6:-6)]*2+1])*s.bitmap.height;
						sh = 0;
					}
					var t1 = (v[ind[i+2]*2]-v[ind[i+1]*2])/w;
					var t2 = (v[ind[i+2]*2+1]-v[ind[i+1]*2+1])/w;
					var t3 = (v[ind[i+2]*2]-v[ind[i]*2])/h;
					var t4 = (v[ind[i+2]*2+1]-v[ind[i]*2+1])/h;
					c.transform(t1,t2,t3,t4, v[ind[i+1]*2], v[ind[i+1]*2+1]);
					c.drawImage(s.bitmap.image,
							s.bitmap.x+sw,
							s.bitmap.y+sh,
							w,h,
							0,-h,
							w,h);
				}
				c.restore();
			}
		});
	},
	drawLine:function (tn,lco,pa){
		var s = this,c;
		s.setList.push(function(){
			c=LGlobal.canvas;
			c.beginPath();
			c.moveTo(pa[0],pa[1]);
			c.lineTo(pa[2],pa[3]);
			c.lineWidth = tn;
			c.strokeStyle = lco;
			c.closePath();
			c.stroke();
		});
	},
	lineStyle:function (tn,co){
		var s = this,c;
		if(co==null)co=s.color;
		s.color = co;
		s.setList.push(function(){
			c=LGlobal.canvas;
			c.lineWidth = tn;
			c.strokeStyle = co;
		});
	},
	add:function (f){
		this.setList.push(f);
	},
	ismouseon:function(e,co){
		var s = this;
		var k = null;
		if(e==null || e == UNDEFINED)return false;
		if(co==null)co={x:0,y:0,scaleX:1,scaleY:1};
		var ox = e.offsetX,oy = e.offsetY;
		for(k in s.showList){
			if(s.showList[k].type == "rect"){
				if(ox >= co.x + s.showList[k].value[0]*co.scaleX && ox <= co.x + (s.showList[k].value[0] + s.showList[k].value[2])*co.scaleX && 
					oy >= co.y + s.showList[k].value[1]*co.scaleY && oy <= co.y + (s.showList[k].value[1] + s.showList[k].value[3])*co.scaleY){
					return true;
				}
			}else if(s.showList[k].type == "arc"){
				var xl = co.x + (s.showList[k].value[0])*co.scaleX - ox;
				var yl = co.y + (s.showList[k].value[1])*co.scaleY - oy;
				return xl*xl+yl*yl <= s.showList[k].value[2]*co.scaleX*s.showList[k].value[2]*co.scaleY;
			}
		}		
		return false;
	},
	getWidth:function(){
		var s = this;
		var k = null,k1=null;
		var min = 0,max = 0,v;
		for(k in s.showList){
			if(s.showList[k].type == "rect"){
				if(min > s.showList[k].value[0])min = s.showList[k].value[0];
				if(max < s.showList[k].value[0] + s.showList[k].value[2])max = s.showList[k].value[0] + s.showList[k].value[2];
			}else if(s.showList[k].type == "arc"){
				if(min > s.showList[k].value[0] - s.showList[k].value[2])min = s.showList[k].value[0] - s.showList[k].value[2];
				if(max < s.showList[k].value[0] + s.showList[k].value[2])max = s.showList[k].value[0] + s.showList[k].value[2];
			}else if(s.showList[k].type == "vertices"){
				for(k1 in s.showList[k].value){
					v = s.showList[k].value[k1];
					if(min > v[0])min = v[0];
					if(max < v[0])max = v[0];
				}
			}
		}
		s.left = min;
		return max - min;
	},
	getHeight:function(){
		var s = this;
		var k = null,k1=null;
		var min = 0,max = 0,v;
		for(k in s.showList){
			if(s.showList[k].type == "rect"){
				if(min > s.showList[k].value[1])min = s.showList[k].value[1];
				if(max < s.showList[k].value[1] + s.showList[k].value[3])max = s.showList[k].value[1] + s.showList[k].value[3];
			}else if(s.showList[k].type == "arc"){
				if(min > s.showList[k].value[1] - s.showList[k].value[2])min = s.showList[k].value[1] - s.showList[k].value[2];
				if(max < s.showList[k].value[1] + s.showList[k].value[2])max = s.showList[k].value[1] + s.showList[k].value[2];
			}else if(s.showList[k].type == "vertices"){
				for(k1 in s.showList[k].value){
					v = s.showList[k].value[k1];
					if(min > v[1])min = v[1];
					if(max < v[1])max = v[1];
				}
			}
		}	
		s.top = min;	
		return max - min;
	},
	startX:function(){
		var s=this;
		s.getWidth();
		return s.left;
	},
	startY:function(){
		var s=this;
		s.getHeight();
		return s.top;
	}
};
for(var k in p)LGraphics.prototype[k]=p[k];
/*
* LShape.js
**/
function LShape(){
	var s = this;
	base(s,LInteractiveObject,[]);
	s.type = "LShape";
	s.graphics = new LGraphics();
	s.graphics.parent = s;
}
p = {
	_show:function(c){
		var s = this;
		s.graphics.show();
	},
	getWidth:function(){
		var s=this,
		left = s.graphics.startX(),right = left + s.graphics.getWidth();
		s.left = s.x + left;
		return (right - left)*s.scaleX;
	},
	getHeight:function(){
		var s=this,
		top = s.graphics.startY(),bottom = top + s.graphics.getHeight();
		s.top = s.y + top;
		return (bottom - top)*s.scaleY;
	},
	_startX:function(){
		var s = this;
		s.getWidth();
		return s.left;
	},
	startX:function(){
		var s = this;
		return s._startX()*s.scaleX;
	},
	_startY:function(){
		var s = this;
		s.getHeight();
		return s.top;
	},
	startY:function(){
		var s = this;
		return s._startY()*s.scaleY;
	},
	remove:function(){
		var s = this;
		if(!s.parent || s.parent == "root")return;
		s.parent.removeChild(s);
	},
	clone:function(){
		var s = this,a = new LShape(),c,o;
		a.copyProperty(s);
		a.graphics = s.graphics.clone();
		a.graphics.parent = a;
		return a;
	},
	_mevent:function(type){
		var s = this;
		for(k=0;k<s.mouseList.length;k++){
			var o = s.mouseList[k];
			if(o.type == type){
				return true;
			}
		}
		return false;
	},
	mouseEvent:function (e,type,cd){
		if(!e)return false;
		var s = this;
		if(!s.visible)return false;
		if(cd==null)cd={x:0,y:0,scaleX:1,scaleY:1};
		var i,k,ox = e.offsetX,oy = e.offsetY;
		var on = s.ismouseon(e,cd);
		if(on){
			if(s._mevent(type)){
				for(k=0;k<s.mouseList.length;k++){
					var o = s.mouseList[k];
					if(o.type == type){
						e.selfX = (ox - (s.x*cd.scaleX+cd.x))/(cd.scaleX*s.scaleX);
						e.selfY = (oy - (s.y*cd.scaleY+cd.y))/(cd.scaleY*s.scaleY);
						e.clickTarget = s;
						o.listener(e,s);
						return true;
					}
				}
			}
			return true;
		}
		return false;
	},
	ismouseon:function(e,cd){
		var s = this;
		if(!s.visible || e==null)return false;
		var k = null,i=false;
		var sc={x:s.x*cd.scaleX+cd.x,y:s.y*cd.scaleY+cd.y,scaleX:cd.scaleX*s.scaleX,scaleY:cd.scaleY*s.scaleY};
		if(s.mask && !s.mask.ismouseon(e,sc))return false;
		if(s.graphics)i = s.graphics.ismouseon(e,sc);
		return i;
	},
	die:function (){
		var s = this;
		s.graphics.clear();
		s.removeAllEventListener();
	}
};
for(var k in p)LShape.prototype[k]=p[k];
/*
* LSprite.js
**/
function LSprite(){
	var s = this;
	base(s,LInteractiveObject,[]);
	s.type = "LSprite";
	s.rotatex;
	s.rotatey;
	s.childList = new Array();
	s.graphics = new LGraphics();
	s.graphics.parent = s;
	s.box2d = null;
}
p = {
	setRotate:function (angle){
		var s = this;
		if(s.box2dBody){
			s.box2dBody.SetAngle(angle);
		}else{
			s.rotate = angle;
		}
	},
	_rotateReady:function(){
		var s = this;
		if(s.box2dBody){
			if((typeof s.rotatex) == "undefined"){
				s.getRotateXY();
			}
			s.x = s.box2dBody.GetPosition().x * LGlobal.box2d.drawScale - s.parent.x - s.rotatex;
			s.y = s.box2dBody.GetPosition().y * LGlobal.box2d.drawScale - s.parent.y - s.rotatey;
			s.rotate = s.box2dBody.GetAngle();
		}
	},
	_show:function(c){
		var s = this;
		s.graphics.show();
		LGlobal.show(s.childList);
	},
	getRotateXY:function(w,h){
		var s = this;
		if(!w || !h){
			w=s.getWidth();
			h=s.getHeight();
		}
		s.rotatex = w/2;
		s.rotatey = h/2;
	},
	getWidth:function(){
		var s=this,i,l,o,a,b,
		left = s.graphics.startX(),right = left + s.graphics.getWidth();
		for(i=0,l=s.childList.length;i<l;i++){
			o = s.childList[i];
			if(typeof o.visible == UNDEFINED || !o.visible)continue;
			a = o.x;
			if(typeof o._startX == "function")a=o._startX();
			b = a + o.getWidth();
			if(a < left)left = a;
			if(b > right)right = b;
		}
		s.left = s.x + left;
		return (right - left)*s.scaleX;
	},
	getHeight:function(){
		var s=this,i,l,o,a,b,
		top = s.graphics.startY(),bottom = top + s.graphics.getHeight();
		for(i=0,l=s.childList.length;i<l;i++){
			o = s.childList[i];
			if(typeof o.visible == UNDEFINED || !o.visible)continue;
			a = o.y;
			if(typeof o._startY == "function")a=o._startY();
			b = a + o.getHeight();
			if(a < top)top = a;
			if(b > bottom)bottom = b;
		}
		s.top = s.y + top;
		return (bottom - top)*s.scaleY;
	},
	_startX:function(){
		var s = this;
		s.getWidth();
		return s.left;
	},
	startX:function(){
		var s = this;
		return s._startX()*s.scaleX;
	},
	_startY:function(){
		var s = this;
		s.getHeight();
		return s.top;
	},
	startY:function(){
		var s = this;
		return s._startY()*s.scaleY;
	},
	loopframe:function (){
		var s = this;
		for(var k=0,l=s.frameList.length;k<l;k++){
			s.target = s;
			s.event_type = LEvent.ENTER_FRAME;
			s.frameList[k](s);
		}
	},
	remove:function(){
		var s = this;
		if(!s.parent || s.parent == "root")return;
		s.parent.removeChild(s);
	},
	addChild:function (d){
		var s  = this;
		d.parent = s;
		s.childList.push(d);
	},
	addChildAt:function(d, i){
		var s = this;
		if(i < 0 || i > s.childList.length){
			return;
		}
		if(typeof d.remove == "function")d.remove();
		d.parent = s;
		s.childList.splice(i,0,d);
	},
	removeChild:function(d){
		var s  = this,c = s.childList;
		for(var i=0,l=c.length;i<l;i++){
			if(d.objectIndex == c[i].objectIndex){
				if(LGlobal.destroy && d.die)d.die();
				s.childList.splice(i,1);
				break;
			}
		}
		delete d.parent;
	},
	getChildAt:function(i){
		var s  = this,c=s.childList;
		if(c.length == 0 || c.length <= i)return null;
		return c[i];
	},
	removeChildAt:function(i){
		var s  = this,c=s.childList;
		if(c.length <= i)return;
		if(LGlobal.destroy && c[i].die)c[i].die();
		s.childList.splice(i,1);
	},
	getChildIndex:function(child){
		var s = this,c=s.childList,i,l=c.length;
		for(i=0;i<l;i++){
			if(c[i].objectIndex == child.objectIndex){
				return i;
			}
		}
		return -1;
	},
	setChildIndex:function(child, index){
		var s = this,c=s.childList,i,l=c.length;
		if(child.parent == "root" || child.parent.objectIndex != s.objectIndex || index < 0 || index >= l){
			return;
		}
		for(i=0;i<l;i++){
			if(c[i].objectIndex == child.objectIndex){
				break;
			}
		}
		s.childList.splice(i,1);
		s.childList.splice(index,0,child);
	},
	resize:function(){
		var s  = this;
		s.width = s.getWidth();
		s.height = s.getHeight();
	},
	removeAllChild:function(){
		var s  = this,c=s.childList;
		for(var i=0,l=c.length;i<l;i++){
			if(LGlobal.destroy && c[i].die)c[i].die();
		}
		s.childList.length = 0;
		s.width = 0;
		s.height = 0;
	},
	clone:function(){
		var s = this,a = new LSprite(),c,o;
		a.copyProperty(s);
		a.graphics = s.graphics.clone();
		a.graphics.parent = a;
		for(var i=0,l=s.childList.length;i<l;i++){
			c = s.childList[i];
			if(c.clone){
				o = c.clone();
				o.parent = a;
				a.childList.push(o);
			}
		}
		return a;
	},
	_mevent:function(type){
		var s = this;
		for(k=0;k<s.mouseList.length;k++){
			var o = s.mouseList[k];
			if(o.type == type){
				return true;
			}
		}
		return false;
	},
	mouseEvent:function (e,type,cd){
		if(!e)return false;
		var s = this;
		if(!s.mouseChildren || !s.visible)return false;
		if(cd==null)cd={x:0,y:0,scaleX:1,scaleY:1};
		var i,k,ox = e.offsetX,oy = e.offsetY;
		var on = s.ismouseon(e,cd);
		if(on){
			if(s._mevent(type)){
				for(k=0;k<s.mouseList.length;k++){
					var o = s.mouseList[k];
					if(o.type == type){
						e.selfX = (ox - (s.x*cd.scaleX+cd.x))/(cd.scaleX*s.scaleX);
						e.selfY = (oy - (s.y*cd.scaleY+cd.y))/(cd.scaleY*s.scaleY);
						e.clickTarget = s;
						o.listener(e,s);
						return true;
					}
				}
			}else{
				var mc = {x:s.x*cd.scaleX+cd.x,y:s.y*cd.scaleY+cd.y,scaleX:cd.scaleX*s.scaleX,scaleY:cd.scaleY*s.scaleY};
				for(k=s.childList.length-1;k>=0;k--){
					if(s.childList[k].mouseEvent){
						i = s.childList[k].mouseEvent(e,type,mc);
						if(i)return true;
					}
				}
			}
			return true;
		}
		return false;
	},
	ismouseon:function(e,cd){
		var s = this;
		if(!s.visible || e==null)return false;
		var k = null,i=false,l=s.childList;
		var sc={x:s.x*cd.scaleX+cd.x,y:s.y*cd.scaleY+cd.y,scaleX:cd.scaleX*s.scaleX,scaleY:cd.scaleY*s.scaleY};
		if(s.mask && !s.mask.ismouseon(e,sc))return false;
		if(s.graphics)i = s.graphics.ismouseon(e,sc);
		if(!i){
			for(k=l.length-1;k>=0;k--){
				if(l[k].ismouseon)i = l[k].ismouseon(e,sc);
				if(i)break;
			}
		}
		return i;
	},
	die:function (){
		var s = this;
		s.graphics.clear();
		s.removeAllEventListener();
		if(s.box2dBody)s.clearBody();
		for(var i=0,c=s.childList,l=c.length;i<l;i++){
			if(c[i].die)c[i].die();
		}
	}
};
for(var k in p)LSprite.prototype[k]=p[k];
/*
* LButton.js
**/
function LButton(d_up,d_over){
	base(this,LSprite,[]);
	var s = this;
	s.type = "LButton";
	s.bitmap_up = d_up;
	s.addChild(d_up);
	if(d_over == null){
		d_over = d_up;
	}else{
		s.addChild(d_over);
	}
	s.bitmap_over = d_over;
	s.bitmap_over.visible = false;
	s.bitmap_up.visible = true;
	LGlobal.buttonList.push(s);
}
LButton.prototype.clone = function (){
	var s = this,d_up = s.bitmap_up.clone(),d_over = s.bitmap_over.clone(),
	a = new LButton(d_up,d_over);
	return a;
};
LButton.prototype.buttonModeChange = function (){
	var s = this;
	var cood={x:0,y:0,scaleX:1,scaleY:1};
	var parent = s.parent;
	while(parent && parent != "root"){
		cood.scaleX *= parent.scaleX;
		cood.scaleY *= parent.scaleY;
		cood.x *= parent.scaleX;
		cood.y *= parent.scaleY;
		cood.x += parent.x;
		cood.y += parent.y;
		parent = parent.parent;
	}
	if(s.ismouseon(LGlobal.buttonStatusEvent,cood)){
		s.bitmap_up.visible = false;
		s.bitmap_over.visible = true;
	}else{
		s.bitmap_over.visible = false;
		s.bitmap_up.visible = true;
	}
};
LButton.prototype.die = function (){
	var s = this;
	s.graphics.clear();
	s.removeAllEventListener();
	if(s.box2dBody)s.clearBody();
	for(var i=0,c=s.childList,l=c.length;i<l;i++){
		if(c[i].die)c[i].die();
	}
	for(var i=0,b=LGlobal.buttonList,l=b.length;i<l;i++){
		if(b[i].objectIndex == s.objectIndex){
			LGlobal.buttonList.splice(i,1);
			break;
		}
	}
};
function LBlendMode(){throw "LBlendMode cannot be instantiated";}
LBlendMode.SOURCE_OVER = "source-over";
LBlendMode.SOURCE_ATOP = "source-atop";
LBlendMode.SOURCE_IN = "source-in";
LBlendMode.SOURCE_OUT = "source-out";
LBlendMode.DESTINATION_OVER = "destination-over";
LBlendMode.DESTINATION_ATOP = "destination-atop";
LBlendMode.DESTINATION_IN = "destination-in";
LBlendMode.DESTINATION_OUT = "destination-out";
LBlendMode.LIGHTER = "lighter";
LBlendMode.COPY = "copy";
LBlendMode.XOR = "xor";
LBlendMode.NONE = null;
/*
* LTextFieldType.js
**/
var LTextFieldType = function (){throw "LTextFieldType cannot be instantiated";};
LTextFieldType.INPUT = "input";
LTextFieldType.DYNAMIC = null;
/*
* LTextField.js
**/
function LTextField(){
	var s = this;
	base(s,LDisplayObject,[]);
	s.type = "LTextField";
	s.texttype = null;
	s.text = "";
	s.font = "Arial";
	s.size = "11";
	s.color = "#000000";
	s.weight = "normal";
	s.textAlign = "left";
	s.textBaseline = "top";
	s.lineWidth = 1;
	s.width = 150;
	s.height = s.size;
	s.stroke = false;
	s.displayAsPassword = false;
	s.wordWrap=false;
	s.multiline = false;
	s.numLines = 1;
}
p = {
	_showReady:function(c){
		var s = this;
		c.font = s.weight + " " + s.size+"pt "+s.font;  
		c.textAlign = s.textAlign;
		c.textBaseline = s.textBaseline;
		c.lineWidth = s.lineWidth;  
	},
	_show:function (c){
		var s = this;
		if(s.texttype == LTextFieldType.INPUT){
			s.inputBackLayer.show();
			var rc = s.getRootCoordinate();
		    if(LGlobal.inputBox.name == "input"+s.objectIndex){
		    	LGlobal.inputBox.style.marginTop = (parseInt(LGlobal.canvasObj.style.marginTop) + (((rc.y + s.inputBackLayer.startY())*parseInt(LGlobal.canvasObj.style.height)/LGlobal.canvasObj.height) >>> 0)) + "px";
		    	LGlobal.inputBox.style.marginLeft = (parseInt(LGlobal.canvasObj.style.marginLeft) + (((rc.x + s.inputBackLayer.startX())*parseInt(LGlobal.canvasObj.style.width)/LGlobal.canvasObj.width) >>> 0)) + "px";
		    }
		}
		var lbl = s.text;
		if(s.displayAsPassword){
			lbl = '';
			for(var i=0,l=s.text.length;i<l;i++)lbl+='*';
		}
		var d;
		if(s.stroke){
			c.strokeStyle = s.color;
			d = c.strokeText;
		}else{
			c.fillStyle = s.color;
			d = c.fillText;
		}
		if(s.wordWrap || s.multiline){
			var i,l,j=0,k=0,m=0,b=0;
			for(i=0,l=s.text.length;i<l;i++){
				j = c.measureText(s.text.substr(k,i-k)).width;
				var enter = /(?:\r\n|\r|\n|¥n)/.exec(lbl.substr(i,1));
				if((s.wordWrap && j > s.width) || enter){
					j = 0;
					k = i;
					m++;
					if(enter)k++;
				}
				if(!enter)d.apply(c,[lbl.substr(i,1),j,m*s.wordHeight,c.measureText(lbl).width]);
				s.numLines = m;
			}
			s.height = (m+1)*s.wordHeight;
		}else{
			s.numLines = 1;
			d.apply(c,[lbl,0,0,c.measureText(lbl).width]);
		}
		if(s.wind_flag){
			s.windRun();
		}
	},
	_wordHeight:function(h){
		var s = this;
		if(h>0){
			s.wordHeight = h;
		}else{
			s.wordWrap = false;
			s.wordHeight = s.getHeight();
		}
		s.height = 0;
	},
	setMultiline:function(v,h){
		var s = this;
		if(v){s._wordHeight(h);}
		s.multiline = v;
	},
	setWordWrap:function(v,h){
		var s = this;
		if(v){s._wordHeight(h);}
		s.wordWrap = v;
	},
	setType:function(type,inputBackLayer){
		var s = this;
		if(s.texttype != type && type == LTextFieldType.INPUT){
			if(inputBackLayer==null || inputBackLayer.type != "LSprite"){
				s.inputBackLayer = new LSprite();
				s.inputBackLayer.graphics.drawRect(1,"#000000",[0, -s.getHeight()*0.4, s.width, s.getHeight()*1.5]);
			}else{
				s.inputBackLayer = inputBackLayer;
			}
			if(LGlobal.mouseEventContainer[LMouseEvent.MOUSE_DOWN])LMouseEventContainer.pushInputBox(s);
		}else{
			s.inputBackLayer = null;
			LMouseEventContainer.removeInputBox(s);
		}
		s.texttype = type;
	},
	ismouseon:function(e,cood){
		var s = this,ox,oy;
		if(e==null || e == UNDEFINED)return false;
		if(!s.visible)return false;
		if(cood==null)cood={x:0,y:0,scaleX:1,scaleY:1};
		var co={x:s.x*cood.scaleX+cood.x,y:s.y*cood.scaleY+cood.y,scaleX:cood.scaleX*s.scaleX,scaleY:cood.scaleY*s.scaleY};
		if(s.inputBackLayer){
			return s.inputBackLayer.ismouseon(e,co);
		}
		ox = e.offsetX;
		oy = e.offsetY;
		if(ox >=  cood.x + s.x*cood.scaleX && ox <= cood.x + (s.x + s.getWidth())*cood.scaleX*s.scaleX && 
			oy >= cood.y + s.y*cood.scaleY && oy <= cood.y + (s.y + s.getHeight())*cood.scaleY*s.scaleY){
			return true;
		}else{
			return false;
		}
	},
	clone:function(){
		var s = this,a = new LTextField();
		a.copyProperty(s);
		a.texttype = null;
		if(s.texttype ==  LTextFieldType.INPUT){
			a.setType( LTextFieldType.INPUT);
		}
		return a;
	},
	mouseEvent:function (event,type,cood){
		var s = this;
		if(s.inputBackLayer == null)return;
		var on = s.ismouseon(event,cood);
		if(type != LMouseEvent.MOUSE_DOWN || !on)return;
		LGlobal.inputBox.style.display = "";
		LGlobal.inputBox.name = "input"+s.objectIndex;
		LGlobal.inputTextField = s;
		LGlobal.inputTextareaBoxObj.style.display = NONE;
		LGlobal.inputTextBoxObj.style.display = NONE;
		LGlobal.passwordBoxObj.style.display = NONE;
		if(s.displayAsPassword){
			LGlobal.inputTextBox = LGlobal.passwordBoxObj;
		}else if(s.multiline){
			LGlobal.inputTextBox = LGlobal.inputTextareaBoxObj;
		}else{
			LGlobal.inputTextBox = LGlobal.inputTextBoxObj;
		}
		var sx = parseInt(LGlobal.canvasObj.style.width)/LGlobal.canvasObj.width,sy = parseInt(LGlobal.canvasObj.style.height)/LGlobal.canvasObj.height;
		LGlobal.inputTextBox.style.display = "";
		LGlobal.inputTextBox.value = s.text;
		LGlobal.inputTextBox.style.height = s.inputBackLayer.getHeight()*cood.scaleY*s.scaleY*sy+"px";
		LGlobal.inputTextBox.style.width = s.inputBackLayer.getWidth()*cood.scaleX*s.scaleX*sx+"px";
		s.text = "";
		setTimeout(function(){LGlobal.inputTextBox.focus();},50);
	},
	getWidth:function(){
		var s = this;
		if(s.wordWrap)return s.width;
		LGlobal.canvas.font = s.size+"pt "+s.font;
		return LGlobal.canvas.measureText(s.text).width;
	},
	getHeight:function(){
		var s = this,c = LGlobal.canvas;
		if(s.wordWrap){
			c.font = s.weight + " " + s.size+"pt "+s.font;
			if(s.height == 0){  
				var i,l,j=0,k=0,m=0;
				for(i=0,l=s.text.length;i<l;i++){
					j = c.measureText(s.text.substr(k,i-k)).width;
					if(j > s.width){
						j = 0;
						k = i;
						m++;
					}
				}
				s.height = (m+1)*s.wordHeight;
			}
			return s.height;
		}
		c.font = s.weight + " " + s.size+"pt "+s.font; 
		return c.measureText("O").width*1.2;
	},
	wind:function(listener){
		var s = this;
		s.wind_over_function = listener;
		s.wind_flag = true;
		s.wind_text = s.text;
		s.text = "";
		s.wind_length = 0;
	},
	windRun:function(){
		var s = this;
		if(s.wind_length > s.wind_text.length){
			s.wind_flag = false;
			if(s.wind_over_function)s.wind_over_function();
			return;
		}
		s.text = s.wind_text.substring(0,s.wind_length);
		s.wind_length++;
	},
	die:function(){
		LMouseEventContainer.removeInputBox(this);
	}
};
for(var k in p)LTextField.prototype[k]=p[k];
/*
* LLabel.js
**/
function LLabel(){
	var s = this;
	base(s,LTextField,[]);
	s.width = LGlobal.width;
}
/*
* LBitmap.js
**/
function LBitmap(bitmapdata){
	base(this,LDisplayObject,[]);
	var s = this;
	s.type = "LBitmap";
	s.rotateCenter = true;
	s.bitmapData = bitmapdata; 
	if(s.bitmapData){
		s.width = s.bitmapData.width;
		s.height = s.bitmapData.height;
	}
}
p = {
	_canShow:function(){return (this.visible && this.bitmapData);},
	_rotateReady:function(){
		var s = this;
		if(s.rotate != 0 && s.rotateCenter){
			s.rotatex = s.getWidth()*0.5;
			s.rotatey = s.getHeight()*0.5;
		}else{
			s.rotatex = s.rotatey = 0;
		}
	},
	_coordinate:function(c){},
	_show:function(){
		this.draw();
	},
	draw:function(){
		var s=this;
		LGlobal.canvas.drawImage(s.bitmapData.image,
			s.bitmapData.x,s.bitmapData.y,
			s.bitmapData.width,s.bitmapData.height,
			s.x,s.y,
			s.bitmapData.width,s.bitmapData.height);
	},
	clone:function(){
		var s = this,a = new LBitmap(s.bitmapData.clone());
		a.copyProperty(s);
		a.rotateCenter = s.rotateCenter;
		return a;
	},
	ismouseon:function(e,cood){
		var s = this;
		if(e==null || e == UNDEFINED)return false;
		if(!s.visible || !s.bitmapData)return false;
		if(cood==null)cood={x:0,y:0,scaleX:1,scaleY:1};
		var ox = e.offsetX,oy = e.offsetY;
		if(ox >= cood.x + s.x*cood.scaleX && ox <= cood.x + (s.x + s.bitmapData.width)*cood.scaleX*s.scaleX && 
			oy >= cood.y + s.y*cood.scaleY && oy <= cood.y + (s.y + s.bitmapData.height)*cood.scaleY*s.scaleY){
			return true;
		}else{
			return false;
		}
	},
	getWidth:function(){
		var s = this;
		return s.bitmapData != null?s.bitmapData.width*(s.scaleX>0?s.scaleX:-s.scaleX):0;
	},
	getHeight:function(){
		var s = this;
		return s.bitmapData != null?s.bitmapData.height*(s.scaleY>0?s.scaleY:-s.scaleY):0;
	},
	startX:function(){
		return this.x;
	},
	startY:function(){
		return this.y;
	},
	die:function(){}
};
for(var k in p)LBitmap.prototype[k]=p[k];
/*
* LBitmapData.js
**/
function LBitmapData(image,x,y,width,height){
	base(this,LObject,[]);
	var s = this;
	s.type = "LBitmapData";
	s.oncomplete = null;
	s._locked=false;
	s._setPixel=false;
	s.x = (x==null?0:x);  
	s.y = (y==null?0:y);
	if(image && typeof image == "object"){
		s.image = image; 
		s.width = (width==null?s.image.width:width);  
		s.height = (height==null?s.image.height:height);
	}else{
		s.image = new Image();	
		s.width = (width==null?1:width); 
		s.height = (height==null?1:height);
		var o = LGlobal._canvas,c = LGlobal._context;
		o.width = s.width;
		o.height = s.height;
		c.clearRect(0,0,s.width,s.height);
		if(typeof image == "string"){
			c.fillStyle = image;
			c.fillRect(0,0,s.width,s.height);
		}
		s.image.src = o.toDataURL();
	}
}
p = {
	setProperties:function (x,y,width,height){
		var s = this;
		s.x = x;
		s.y = y;
		s.width = width;
		s.height = height;
		s.resize();
	}
	,setCoordinate:function (x,y){
		var s = this;
		s.x = x;
		s.y = y;
		s.resize();
	}
	,clone:function(){
		var s = this;
		return new LBitmapData(s.image,s.x,s.y,s.width,s.height);
	}
	,ready:function(){
		var s = this;
		var o = LGlobal._canvas,c = LGlobal._context;
		o.width = s.width;
		o.height = s.height;
		c.clearRect(0,0,s.width,s.height);
		c.drawImage(s.image,0,0,s.width,s.height);
	}
	,getPixel:function(x,y){
		var s = this;
		var o = LGlobal._canvas,c = LGlobal._context;
		if(!s._locked)s.ready();
		return c.getImageData(x,y,1,1).data;
	}
	,getPixels:function(rect){
		var s = this;
		var o = LGlobal._canvas,c = LGlobal._context;
		if(!s._locked)s.ready();
		return c.getImageData(rect.x,rect.y,rect.width,rect.height);
	}
	,lock:function(){
		var s = this;
		s.ready();
		s._locked=true;
	}
	,unlock:function(){
		var s = this;
		if(s._setPixel)s.image.src = LGlobal._canvas.toDataURL();
		s._locked=false;
		s._setPixel=false;
	}
	,setPixel:function(x,y,data){
		var s = this;
		if(!s._locked)s.ready();
		var c = LGlobal._context;
		c.fillStyle = 'rgb('+data[0]+', '+data[1]+', '+data[2]+')';
		c.fillRect(x,y,1,1);
		s._setPixel=true;
	}
	,setPixels:function(rect, img){
		var s = this;
		if(!s._locked)s.ready();
		LGlobal._context.putImageData(img, rect.x, rect.y,0,0,rect.width,rect.height);
		s._setPixel=true;
	}
	,draw:function(source){
		var s = this;
		s.image.src = source.getDataURL();
		s.resize();
	},
	resize:function(){
		var s = this,w=s.image.width-s.x,h=s.image.height-s.y;
		s.width = s.width<w?s.width:w;
		s.height = s.height<h?s.height:h;
	}
};
for(var k in p)LBitmapData.prototype[k]=p[k];
/*
 * LDropShadowFilter.js
 **/
function LDropShadowFilter(distance,angle,color,blur){
	var s = this;
	base(s,LObject,[]);
	s.type = "LDropShadowFilter";
	s.distance=distance?distance:0;
	s.angle=angle?angle:0;
	s.shadowColor=color?color:"#000000";
	s.shadowBlur=blur?blur:20;
	s.setShadowOffset();
}
p = {
	setShadowOffset:function(){
		var s = this;
		var a = s.angle*Math.PI/180;
		s.shadowOffsetX=s.distance*Math.cos(a);
		s.shadowOffsetY=s.distance*Math.sin(a);
	},
	show:function(){
		var s = this,c = LGlobal.canvas;
		c.shadowColor=s.shadowColor;
		c.shadowBlur=s.shadowBlur;
		c.shadowOffsetX=s.shadowOffsetX;
		c.shadowOffsetY=s.shadowOffsetY;
	},
	setDistance:function(distance){
		this.distance=distance;
		this.setShadowOffset();
	},
	setAngle:function(angle){
		this.angle=angle;
		this.setShadowOffset();
	},
	setColor:function(color){
		this.shadowColor=color;
	},
	setBlur:function(blur){
		this.shadowBlur=blur;
	}
};
for(var k in p)LDropShadowFilter.prototype[k]=p[k];
/*
* LAnimation.js
**/
function LAnimation(layer,data,list){
	base(this,LSprite,[]);
	var s = this;
	s.type = "LAnimation";
	s.rowIndex = 0;
	s.colIndex = 0;
	s.mode = 1;
	s.isMirror = false;
	s.bitmap =  new LBitmap(data);
	s.imageArray = list;
	s.addChild(s.bitmap);
	if(layer != null)layer.addChild(s);
};
LAnimation.prototype.setAction = function (rowIndex,colIndex,mode,isMirror){
	var s = this;
	if(rowIndex != null && rowIndex >= 0 && rowIndex < s.imageArray.length)s.rowIndex = rowIndex;
	if(colIndex != null && colIndex >= 0 && colIndex < s.imageArray[rowIndex].length)s.colIndex = colIndex;
	if(mode != null)s.mode = mode;
	if(isMirror != null){
		s.isMirror = isMirror;
		if(s.isMirror){
			s.bitmap.x = s.bitmap.getWidth();
			s.bitmap.scaleX = -1*Math.abs(s.bitmap.scaleX);
		}else{
			s.bitmap.x = 0;
			s.bitmap.scaleX = 1*Math.abs(s.bitmap.scaleX);
		}
	}
};
LAnimation.prototype.clone = function (){
	var s = this,cB = s.bitmap.bitmapData.clone(),cI = s.imageArray.slice(0),
	a = new LAnimation(null,cB,cI);
	a.copyProperty(s);
	return a;
};
LAnimation.prototype.getAction = function (){
	var s = this;
	return [s.rowIndex,s.colIndex,s.mode,s.isMirror];
};
LAnimation.prototype.onframe = function (){
	var s = this;
	var arr = s.imageArray[s.rowIndex][s.colIndex];
	s.bitmap.bitmapData.setCoordinate(arr.x,arr.y);
	if(typeof arr.script == "function"){
		arr.script(s,arr.params);
	}
	s.colIndex += s.mode;
	if(s.colIndex >= s.imageArray[s.rowIndex].length || s.colIndex < 0){
		s.colIndex = s.mode>0?0:s.imageArray[s.rowIndex].length - 1;
		s.dispatchEvent(LEvent.COMPLETE);
	}
};
/*
* LAnimationTimeline.js
**/
function LAnimationTimeline(data,list){
	var s = this;
	base(s,LAnimation,[null,data,list]);
	s.type = "LAnimationTimeline";
	s.speed = 0;
	s._speedIndex = 0;
	s.labelList = {};
	s.addEventListener(LEvent.ENTER_FRAME,s._onframe);
};
LAnimationTimeline.prototype.clone = function (){
	var s = this,k,o,cB = s.bitmap.bitmapData.clone(),cI = s.imageArray.slice(0),
	a = new LAnimationTimeline(cB,cI);
	a.copyProperty(s);
	for(k in s.labelList){
		o = s.labelList[k];
		a.labelList[k] = {rowIndex:o.rowIndex,colIndex:o.colIndex,mode:o.mode,isMirror:o.isMirror};
	}
	return a;
};
LAnimationTimeline.prototype._onframe = function (event){
	var self = event.target;
	if(self._speedIndex++<self.speed)return;
	self._speedIndex = 0;
	self.onframe();
};
LAnimationTimeline.prototype.setLabel = function (name,_rowIndex,_colIndex,_mode,_isMirror){
	this.labelList[name] = {rowIndex:_rowIndex,colIndex:_colIndex,mode:_mode,isMirror:_isMirror};
};
LAnimationTimeline.prototype.play = function (){
	this.mode = this.saveMode;
};
LAnimationTimeline.prototype.stop = function (){
	this.saveMode = this.mode;
	this.mode = 0;
};
LAnimationTimeline.prototype.gotoAndPlay = function (name){
	var l = this.labelList[name];
	this.setAction(l.rowIndex,l.colIndex,l.mode,l.isMirror);
};
LAnimationTimeline.prototype.gotoAndStop = function (name){
	var l = this.labelList[name];
	this.setAction(l.rowIndex,l.colIndex,l.mode,l.isMirror);
	this.stop();
};
LAnimationTimeline.prototype.addFrameScript = function (name,func,params){
	var l = this.labelList[name];
	var arr = this.imageArray[l.rowIndex][l.colIndex];
	arr.script = func;
	arr.params = params?params:null;
};
LAnimationTimeline.prototype.removeFrameScript = function (name){
	var l = this.labelList[name];
	this.imageArray[l.rowIndex][l.colIndex].script = null;
};
function $LoadManage(){}
$LoadManage.prototype={
	load:function(l,u,c){
		var s = this;
		s.list=l,s.onupdate=u,s.oncomplete=c;
		s.loader=s,s.index=0,s.loadIndex=0,s.result=[];
		s.loadStart();
	},
	loadStart:function(){
		var s = LLoadManage,d;
		if(s.loadIndex >= s.list.length)return;
		d = s.list[s.loadIndex];
		if(d["type"] == "text" || d["type"] == "js"){
			s.loader = new LURLLoader();
			s.loader.name = s.list[s.loadIndex].name;
			s.loader.addEventListener(LEvent.COMPLETE,s.loadComplete);
			s.loader.load(s.url(s.list[s.loadIndex].path),d["type"]);
		}else if(d["type"] == "sound"){
			s.loader = new LSound();
			s.loader.addEventListener(LEvent.COMPLETE,s.loadComplete);
			s.loader.load(s.url(s.list[s.loadIndex].path));
		}else{
			s.loader = new LLoader();
			s.loader.name = s.list[s.loadIndex].name;
			s.loader.addEventListener(LEvent.COMPLETE,s.loadComplete);
			s.loader.load(s.url(s.list[s.loadIndex].path),"bitmapData");
		}
		s.loadIndex++;
		s.loadStart();
	},
	loadComplete:function(e){
		var s = LLoadManage;
		if(e  && e.target && e.target.name)s.result[e.target.name] = e.currentTarget;
		s.index++;
		if(s.onupdate){
			s.onupdate(Math.floor(s.index*100/s.list.length));
		}
		if(s.index >= s.list.length){
			s.loader = null;
			var r = s.result;
			s.oncomplete(r);
		}
	},
	url:function(u){
		if(!LGlobal.traceDebug)return u;
		return u+(u.indexOf('?')>=0?'&':'?')+'t='+(new Date()).getTime();
	}
};
var LEasing = {
	None:{
		easeIn:function(t,b,c,d){
			return b+t*c/d;
		}
	},
	Quad: {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t + b;
		},
		easeOut: function(t,b,c,d){
			return -c *(t/=d)*(t-2) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
	},
	Cubic: {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t*t + b;
		},
		easeOut: function(t,b,c,d){
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		}
	},
	Quart: {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t*t*t + b;
		},
		easeOut: function(t,b,c,d){
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b;
		}
	},
	Quint: {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t*t*t*t + b;
		},
		easeOut: function(t,b,c,d){
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		}
	},
	Sine: {
		easeIn: function(t,b,c,d){
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		},
		easeOut: function(t,b,c,d){
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		},
		easeInOut: function(t,b,c,d){
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		}
	},
	Strong: {
		easeIn: function(t,b,c,d){
			return c*(t/=d)*t*t*t*t + b;
		},
		easeOut: function(t,b,c,d){
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		}
	},
	Expo: {
		easeIn: function(t,b,c,d){
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
		},
		easeOut: function(t,b,c,d){
			return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
		},
		easeInOut: function(t,b,c,d){
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
			return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
		}
	},
	Circ: {
		easeIn: function(t,b,c,d){
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		},
		easeOut: function(t,b,c,d){
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		},
		easeInOut: function(t,b,c,d){
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		}
	},
	Elastic: {
		easeIn: function(t,b,c,d,a,p){
			var s;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (!a || a < Math.abs(c)) { a=c; s=p/4; }
			else s = p/(2*Math.PI) * Math.asin (c/a);
			return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
		},
		easeOut: function(t,b,c,d,a,p){
			var s;
			if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
			if (!a || a < Math.abs(c)) { a=c; s=p/4; }
			else s = p/(2*Math.PI) * Math.asin (c/a);
			return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
		},
		easeInOut: function(t,b,c,d,a,p){
			var s;
			if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
			if (!a || a < Math.abs(c)) { a=c;s=p/4; }
			else s = p/(2*Math.PI) * Math.asin (c/a);
			if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
			return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
		}
	},
	Back: {
		easeIn: function(t,b,c,d,s){
			if (s == undefined) s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		},
		easeOut: function(t,b,c,d,s){
			if (s == undefined) s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		},
		easeInOut: function(t,b,c,d,s){
			if (s == undefined) s = 1.70158; 
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		}
	},
	Bounce: {
		easeIn: function(t,b,c,d){
			return c - LEasing.Bounce.easeOut(d-t, 0, c, d) + b;
		},
		easeOut: function(t,b,c,d){
			if ((t/=d) < (1/2.75)) {
				return c*(7.5625*t*t) + b;
			} else if (t < (2/2.75)) {
				return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
			} else if (t < (2.5/2.75)) {
				return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
			} else {
				return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
			}
		},
		easeInOut: function(t,b,c,d){
			if (t < d/2) return LEasing.Bounce.easeIn(t*2, 0, c, d) * .5 + b;
			else return LEasing.Bounce.easeOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
	}
};
var Quad = LEasing.Quad;
var Cubic = LEasing.Cubic;
var Quart = LEasing.Quart;
var Quint = LEasing.Quint;
var Sine = LEasing.Sine;
var Strong = LEasing.Strong;
var Expo = LEasing.Expo;
var Circ = LEasing.Circ;
var Elastic = LEasing.Elastic;
var Back = LEasing.Back;
var Bounce = LEasing.Bounce;
function $LTweenLiteChild($target,$duration,$vars){
	var s = this;
	s.objectIndex = s.objectindex = ++LGlobal.objectIndex;
	s.toNew=[];
	s.init($target,$duration,$vars);
}
$LTweenLiteChild.prototype = {
	init:function($target,$duration,$vars){
		var s = this,k=null;
		s.target=$target;s.duration=$duration || 0.001;s.vars=$vars;
		s.currentTime = (new Date()).getTime() / 1000;
		s.delay = s.vars.delay || 0;
		s.combinedTimeScale = s.vars.timeScale || 1;
		s.active = s.duration == 0 && s.delay == 0;
		s.varsto={};
		s.varsfrom={};
		if (typeof(s.vars.ease) != "function") {
			s.vars.ease = LEasing.None.easeIn;
		}
		s.ease = s.vars.ease;
		delete s.vars.ease;
		if(s.vars.onComplete){
			s.onComplete = s.vars.onComplete;
			delete s.vars.onComplete;
		}
		if(s.vars.onUpdate){
			s.onUpdate = s.vars.onUpdate;
			delete s.vars.onUpdate;
		}
		if(s.vars.onStart){
			s.onStart = s.vars.onStart;
			delete s.vars.onStart;
		}
		for(k in s.vars){
			s.varsto[k] = s.vars[k];
			s.varsfrom[k] = s.target[k];
		}
		s.initTime = s.currentTime;
		s.startTime = s.initTime + s.delay;
	},
	tween:function(){
		var s = this;
		var time = (new Date()).getTime() / 1000 , etime;
		etime = (time - s.startTime);
		if(etime < 0)return;
		var tweentype=null;
		for(tweentype in s.varsto){
			var v = s.ease(etime,s.varsfrom[tweentype],s.varsto[tweentype]-s.varsfrom[tweentype],s.duration);
			s.target[tweentype] = v;
		}
		if(s.onStart){
			s.onStart(s.target);
			delete s.onStart;
		}
		if (etime >= s.duration){
			for(tweentype in s.varsto)s.target[tweentype] = s.varsto[tweentype];
			if(s.onComplete)s.onComplete(s.target);
			return true;
		}else if(s.onUpdate){
			s.onUpdate(s.target);
		}
		return false;
	},
	to:function($target,$duration,$vars){
		var s = this;
		s.toNew.push({target:$target,duration:$duration,vars:$vars});
		return s;
	},
	keep:function(){
		var s = this;
		if(s.toNew.length > 0){
			var t = s.toNew.shift();
			if(t.vars.loop)s.loop = true;
			if(s.loop){
				var vs = {},k;
				for(k in t.vars)vs[k]=t.vars[k];
				s.to(t.target,t.duration,vs);
			}
			s.init(t.target,t.duration,t.vars);
			return true;
		}
		return false;
	}
};
function $LTweenLite(){}
$LTweenLite.prototype = {
	tweens:[],
	show:null,
	frame:function(){
		var s = this;
		var i,length=s.tweens.length,t;
		for(i=0;i < length;i++){
			t = s.tweens[i];
			if(t.tween()){
				s.tweens.splice(i,1);
				i--,length=s.tweens.length;
				if(t.keep())s.add(t);
			}
		}
		if(s.tweens.length == 0)s.show = null;
	},
	to:function($target,$duration,$vars){
		if(!$target)return;
		var s = this;
		var tween = new $LTweenLiteChild({},0,{});
		s.tweens.push(tween);
		s.show = s.frame;
		tween.to($target,$duration,$vars);
		return tween;
	},
	add:function(tween){
		this.tweens.push(tween);
	},
	remove:function(tween){
		var s = this;
		if(typeof tween == UNDEFINED)return;
		for(i=0,l=s.tweens.length;i < l;i++){
			if(tween.objectIndex == s.tweens[i].objectIndex){
				s.tweens.splice(i,1);
				break;
			}
		}
	},
	removeAll:function(){
		this.tweens.splice(0,this.tweens.length);
	}
};
function $Ajax(){}
$Ajax.prototype = {
	get:function(url, data, oncomplete,onerror){
		this.getRequest("GET",url, data, oncomplete,onerror);
	},
	post:function(url, data, oncomplete,onerror){
		this.getRequest("POST",url, data, oncomplete,onerror);
	},
	getRequest:function(t,url, d, oncomplete,err){
		var s = this,k,data="",a="";
		s.err = err;
		var ajax = s.getHttp();
		if (!ajax)return;
		if(d){
			for(k in d){
				data += (a+k+"="+d[k]);
				a="&";	
			}
		}
		if(t.toLowerCase() == "get"){
			url += ((url.indexOf('?')>=0?'&':'?')+data);
			data = null;
		}
		ajax.open(t, url, true);
		ajax.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		ajax.onreadystatechange = function(){
			if (ajax.readyState == 4){
				if(ajax.status >= 200 && ajax.status < 300 || ajax.status === 304){
					if (ajax.responseText.length > 0){
						oncomplete(ajax.responseText);
					}else{
						oncomplete(null);
					}
				}else{
					if(err)err(ajax);
				}
	 		}
		};
		ajax.send(data);
	},
	getHttp:function(){
		if (typeof XMLHttpRequest != UNDEFINED){
			return new XMLHttpRequest();
		}  
		try{
			return new ActiveXObject("Msxml2.XMLHTTP");
		}catch (e){
			try{
				return new ActiveXObject("Microsoft.XMLHTTP");
			}catch (e) {
				if(!this.err)this.err(e);
			}
		}
		return false;
	}
};
function LStageWebView(){
	var s = this;
	base(s,LObject,[]);
	s.display = document.createElement("div");
	s.iframe = document.createElement("iframe");
	s.display.style.position = "absolute";
	s.display.style.marginTop = "0px";
	s.display.style.marginLeft = "0px";
	s.display.style.zIndex = 11;
	s.display.appendChild(s.iframe);
}
LStageWebView.prototype = {
	loadURL:function(u){
		this.iframe.src=u;
	},
	show:function(){
		LGlobal.object.appendChild(this.display);
	},
	die:function(){
		LGlobal.object.removeChild(this.display);
	},
	setViewPort:function(r){
		var s = this,sx = parseInt(LGlobal.canvasObj.style.width)/LGlobal.canvasObj.width,sy = parseInt(LGlobal.canvasObj.style.height)/LGlobal.canvasObj.height;
		s.display.style.marginTop = (parseInt(LGlobal.canvasObj.style.marginTop) + ((r.y*sy) >>> 0)) + "px";
		s.display.style.marginLeft = (parseInt(LGlobal.canvasObj.style.marginLeft) + ((r.x*sx) >>> 0)) + "px";
		s.iframe.style.width = s.display.style.width = (r.width*sx >>> 0)+"px";
		s.iframe.style.height = s.display.style.height = (r.height*sy >>> 0)+"px";
	}
};
function FPS(){
        var s = this;
        base(s,LSprite,[]);
        s.fps = new LTextField();
        s.fpsCount = 0;
        s.fpsTime = (new Date()).getTime();
        s.fps.color = "#ffffff";
        s.addChild(s.fps);
        s.addEventListener(LEvent.ENTER_FRAME,s.showFPS);
}
FPS.prototype.showFPS = function(s){
        s.fpsCount++;
        var t = (new Date()).getTime();
        if(t - s.fpsTime < 1000)return;
        s.fpsTime = t;
        s.fps.text = s.fpsCount;
        s.fpsCount = 0;
        s.graphics.clear();
        s.graphics.drawRect(0,"#000000",[0,0,s.fps.getWidth(),20],true,"#000000");
};
(function(){
	LAjax = new $Ajax();
	LLoadManage = new $LoadManage();
	LTweenLite = new $LTweenLite();
	LGlobal.childList.push(LTweenLite);
})();