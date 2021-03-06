//застосуємо модульний підхід до розробки списку.
//замість множини глобальних змінних ,створимо лише один глобальний об'єкт 
$(document).ready(function(){

	var App={};
	(function(App, $){
		var
			_$container,
			_$list,
			_document,
			id=0;
	    //ініціалізація, створення обробників подій
	    App.init=function(document){
	    	_document=document;
	    	_$container=$('#toDoList');
	    	this.addContainer(_$container);
	    	_$list=$('ul');

	    	_$container.on('keyup','[data-action="addProduct"]', event.data , $.proxy(this.addNewProduct, this) )
	    	           .on('mouseenter','li', function(){ $(event.target).find("img").fadeIn(100); })
	    	           .on('mouseleave','li', function(){ $(event.target).find("img").fadeOut(100); })
	    			   .on('change', '[data-action="crossOut"]', event.data, $.proxy(this.crossOutProduct, this))
	    			   .on('click', 'li img', function(){ event.target.closest('li').remove(); })
	    	           .on('change','[data-action="crossOutAll"]', event.data , $.proxy(this.crossOutAll, this) )
	    			   .on('click', '[data-action="deleteChecked"]', $.proxy(this.deleteChecked, this) )
	    			   .on('dblclick', 'label',  event.data , $.proxy(this.changeProduct, this))
	    			   .on('keyup','[data-action="changeProduct"]', event.data , $.proxy(this.changeLabel, this) );
	    };
        //створуємо початкове DOM дерево
	    App.addContainer=function(_$container){
	    	$('<input data-action="addProduct" placeholder="What do you need to buy?" class="inputField"/>').appendTo(_$container);
	    	$('<ul class="list"></ul>').appendTo(_$container);
	    	$('<li class="crossOutAll"><input  type="checkbox" data-action="crossOutAll"/><label>Check All</label></li>').appendTo(_$container);
	    	$('<input  class="btn" type="button" data-action="deleteChecked" value="Delete checked"/>').appendTo(_$container);
	    };
        //додавання нового елементу списку
        App.addNewProduct=function(event){
        	var newProduct=event.target.value;
            if (event.keyCode==13 && newProduct!='')
            {
                $('.inputField').val('');
            	$('<li><input type="checkbox" data-action="crossOut"/><label>'+newProduct+'<img src="img/delete.png"/></label></li>')
            	  .prependTo(_$list);

            	this.checkCountOfCrossed();  
            }
        };
        //викреслювання елементу списку
        App.crossOutProduct=function(event){ 
        	var
        	    _$target = $( event.target ),
        	    _$item= _$target.parent().find("label");

        	if ( _$target.prop( "checked" ) ){
                   _$item.addClass("cross");} 
            else {
                   _$item.removeClass("cross");
            }
            this.checkCountOfCrossed();
        }
        //перевірка чи викресленні усі елеменети списку. Для логічої роботи checkbox - викреслити все
        App.checkCountOfCrossed=function(){
        	var
        	    ItemsCount=$("ul").find(".cross").length,
        	    CrossedCount=$("ul").find("li").length;
            if (ItemsCount!=CrossedCount){ $('.crossOutAll').find('input').prop("checked",false);}
            else {$('.crossOutAll').find('input').prop("checked",true);}
        }
        //викреслити все
        App.crossOutAll=function(event){
        	var
        	    _$target = $( event.target ),
        	    _$items= $("ul").find("[data-action='crossOut']");
        	if ( _$target.prop( "checked" ) ){
        		  _$items.prop("checked",true); 
                  _$items.parent().find("label").addClass("cross");} 
            else {
            	  _$items.prop("checked",false);
                  _$items.parent().find("label").removeClass("cross");
            }
        };
        //видалити викреслені
        App.deleteChecked=function(){
        	var _$items = $( " .cross " ).parent();
        	_$items.remove();
        	$('.crossOutAll').find('input').prop("checked",false);
        };

        //змінити поле з продуктом
        //поверх нашого елементу списку відображаємо поле вводу. 
        //залежно від натиснутої кнопки, або старе поле заміниться новим, або ж водобразимо знову старий елемент списку
        App.changeProduct=function(event){
        	var _$item=$(event.target),
        	    text=_$item.text();

        	    _$item.after("<input data-action='changeProduct' value="+text+">");
        	    _$item.hide();
        };
     
        App.changeLabel=function(event){
            var _$item=$(event.target),
        	    _$oldItem=_$item.parent().find('label'),
        	    newProduct=event.target.value;

        	if (event.keyCode==13 && newProduct!='')
            {
            	$('<label>'+newProduct+'<img src="img/delete.png"/></label>').appendTo(_$item.parent());
                if ( _$oldItem.hasClass('cross') ){ _$item.parent().find('label').addClass('cross');}
                 _$item.remove();
                 _$oldItem.remove();

            }
            if (event.keyCode==27)
            {
            	 _$oldItem.show();
            	 _$item.remove();	
            }
        }; 
        //початкова ініціалізація
        App.init();

	})(App, jQuery);



});
