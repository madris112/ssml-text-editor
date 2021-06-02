var ssml = ssml || {};


function removethis(e){
    $(e).parent().remove();
}

function insertbreak(e){

    cls = e.innerText;
    cls = cls.replace('s','');

    var sel, range;
    if (window.getSelection && (sel = window.getSelection()).rangeCount) {
        
        range = sel.getRangeAt(0);
        var icon = '<i class="far fa-clock" style="margin-left:2px" onclick="removethis(this)"></i>';  
        range.deleteContents();
        range.collapse(true);
        var span = document.createElement("span");
        span.setAttribute('class', 'break-icon');
        span.setAttribute('contenteditable', 'false');
        span.setAttribute('value', cls);
        span.innerHTML = icon;
        range.insertNode(span);

        // Move the caret immediately after the inserted span
        range.setStartAfter(span);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
    
}


function converttotag(cls){
    
     var sel, range;
    if (window.getSelection && (sel = window.getSelection()).rangeCount) {
        
        range = sel.getRangeAt(0);
        var str = sel.toString();
        var icon = '<i class="inside-icon far fa-times-circle" style="margin-left:2px" onclick="removethis(this)"></i>';
        str = str + icon;
        range.deleteContents();
        range.collapse(true);
        var span = document.createElement("span");
        span.setAttribute('class', cls);
        span.setAttribute('contenteditable', 'false');
        span.innerHTML = str;
        range.insertNode(span);

        // Move the caret immediately after the inserted span
        range.setStartAfter(span);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

ssml.actions = {

    convertToSsml: function() {

        var html = $(".editor").html();
        var $newContent = $("<p/>");

        /* Wrap text */
        $newContent.append(html);

        /* remove nbsp */
        $newContent.html(function (i, html) {
            return html.replace(/&nbsp;/g, ' ');
        });
        /* remove icons */
        $newContent.find("i").replaceWith(function(){
            return '';
        });
        /* replace pause */
        $newContent.find(".break-icon").replaceWith(function(){
            console.log($(this).attr('value'));
             return `<break time="${$(this).attr('value')}"/>`
        });

        /* replace linebreaks */
        $newContent.find("p").each(function(){
            if ($.trim($(this).text()) == ""){
                $(this).remove();
            } 
          });

        /* replace br */
        $newContent.find("br").replaceWith(function(){
            return '';
        })
        
        /* replace strong */
        $newContent.find(".emphasis").replaceWith(function(){
            return '<emphasis level="strong">' +  this.innerHTML + "</emphasis>";
        })


        /* replace slow */
        $newContent.find(".slow").replaceWith(function(){
            return '<prosody rate="slow">' + this.innerHTML + "</prosody>";
        })

        /* replace fast */
        $newContent.find(".pitch-down").replaceWith(function(){
            return '<prosody rate="fast">' + this.innerHTML + "</prosody>";
        })

        console.log( $newContent);

        console.log("<speak>" + $newContent[0].innerHTML + "</speak>");
    }
}

ssml.listners = {
  actionbuttons: function() {
        $(".action-button").on("click", function (event) {
            event.preventDefault();
            var action = $(this).data("action");
            eval(action);
        });
    }
},

ssml.init = function () {   
    this.listners.actionbuttons();
    document.execCommand("defaultParagraphSeparator", false, "p");

    document.querySelector("div[contenteditable]").addEventListener("paste", function(e) {
        e.preventDefault();
        var text = e.clipboardData.getData("text/plain");
        document.execCommand("insertHTML", false, text);
    });
}

$(function () {
    "use strict";
    ssml.init();
});