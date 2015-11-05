/*
* Currency Formatter
* version 1.0
*/

(function($){
   "use strict"
   $.fn.currencyFormat = function(options){
    
      var defaults = {
         thousandsLimit: 13,
         thousandsSep: ',',
         centsLimit: 2,
         centsSep: '.',
         allowNegative: true,
         formatOnly: false,
         defaultZero: "0",
         zeroIsDefault: true
      }
      
      var opts = $.extend(defaults, options);
      
      return this.each(function(){
         var thousandsLimit = opts.thousandsLimit;
         var thousandsSep = opts.thousandsSep;
         var centsLimit = opts.centsLimit;
         var centsSep = opts.centsSep;
         var allowNegative = opts.allowNegative;
         var formatOnly = opts.formatOnly;
         var zeroIsDefault = opts.zeroIsDefault;
         var defaultZero = opts.defaultZero;
         
         var isNumber = /[0-9]/g;
         
         var obj = $(this);
         
         //Setters and getters
         function cf_set(num){
            if(obj.is('input')){
               return obj.val(num);
            }else{
               return obj.html(num);
            }
         }
         
         function cf_get(){
            var inputVal;
            
            if(obj.is('input')){
               inputVal = obj.val();
            }else{
               inputVal = obj.html();
            }
            
            return inputVal;
         }
         
         function cf_to_numbers(str){
            var char;
            var formatted = "";
            
            for(var i = 0; i < (str.length); i++){
               char = str.charAt(i);
               if(char.match(isNumber)){
                  formatted += char;
               }   
            }
            
            //limit thousands
            formatted = formatted.substr(0, thousandsLimit + centsLimit);
            
            return formatted;
            
         }
         
         function cf_format_it(str){

            //check if number
            var formatted = cf_to_numbers(str);
            var thousandsFormatted = "";
            var thousandCtr  = 0;
            var decimalVal = "";
            var integerVal = "";
            
            var centsStartPoint = ((formatted.length - centsLimit) < 0 ? 0 : formatted.length - centsLimit);
            
            decimalVal = formatted.substr(centsStartPoint, centsLimit ); 
            integerVal = formatted.substr(0, (formatted.length - centsLimit)); 
            
            if(integerVal.substr(0,1) == 0) integerVal = integerVal.substr(1, integerVal.length);
            if(integerVal == 0) integerVal = 0;
            
            //Format integerval with thousands separator
            for(var i = integerVal.length; i > 0; i--){
               var char = integerVal.substr(i-1, 1);
               
               thousandCtr++;

               if(thousandCtr % 3 == 0){
                  char = thousandsSep + char;
               }
               
               thousandsFormatted = char + thousandsFormatted;
               
            }
            
            //check if thousand separator
            if(thousandsFormatted.substr(0,1) == thousandsSep) thousandsFormatted = thousandsFormatted.substr(1, thousandsFormatted.length);
            formatted =  (thousandsFormatted == "" ? 0 : thousandsFormatted) + centsSep + decimalVal;
            if(!thousandsFormatted && !decimalVal && !formatOnly) formatted = defaultZero;
            
            return formatted;
         }
         
         function cf_format_currency(e){
               var str = cf_get();
               
               //Format input made from the element
               var formatted = cf_format_it(str);
      
               if(!formatOnly) var code = (e.keycode  ? e.keycode : e.which);
               
               var startPos = this.selectionStart;
               var endPos = this. selectionEnd;
               
               //If negative value
               if(allowNegative && str.indexOf('-') >= 0){
                  formatted = "-" + formatted;
               }
               
               //set the value of the elements
               cf_set(formatted);
               
               //Cursor position
               var allowkeys = [8,39,37];
         
               if(!formatOnly){
                  if($.inArray(code, allowkeys) >= 0){
                     if(formatted != 0 ){
                        console.log(1)
                        this.setSelectionRange(startPos, endPos); 
                     }
                  }else{
                      
                        if(str.length != formatted.length){
                           if(formatted.length >= 8 ){
                              this.setSelectionRange(startPos+1, endPos+1);
                           }
                           return;
                        }
                        
                        //default position when backspace and arrows used.
                        this.setSelectionRange(startPos, endPos);  

                      
                  }
               }
               
         }

         if(formatOnly){
            cf_format_currency();
         }else{
            //default value for the field.
            if(!cf_get() && zeroIsDefault) cf_set(defaultZero); 
            
            obj.bind('keyup.currencyFormat',cf_format_currency);
         }
         
      });
   }
   

} (jQuery));