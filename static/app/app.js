import { EventBus } from './EventBus.js';

// Get the modal
var modal = document.getElementById("myModal");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}


let messagesToSend = []

let lastKey = "";
document.querySelector("#detail-area").addEventListener('keydown', (e) => {
    console.log(e.code);
    if(e.code == "Enter"){
        if(e.ctrlKey){
            EventBus.$emit("add");
            lastKey = "";
        }else if(document.activeElement.parentElement.nodeName == "TD"){
            if(document.activeElement.parentElement.nextSibling.className == "details"){
                document.activeElement.parentElement.nextSibling.childNodes[0].focus();
            }else 
            {
                if(document.activeElement.parentElement.parentElement.nextSibling){
                    document.activeElement.parentElement.parentElement.nextSibling.firstChild.firstChild.focus();
                }else{
                    EventBus.$emit("add");
                }
            }
        }
    }else if(e.code =="Backspace"){
        if(e.ctrlKey){
            EventBus.$emit("remove");
        }
    }
    else{
        lastKey = e.code;
    }
})

let tags = [];

const observer = new MutationObserver((mutation) => {
    console.log(mutation);
    for(let i = 0; i < mutation.length; i++){
        let currentMutation = mutation[i];
        if(currentMutation.removedNodes.length > 0){
            console.log(currentMutation);
            if(currentMutation.removedNodes[0].nodeName == "DIV"){
                if(currentMutation.removedNodes[0].className == "tag"){
                    let keyword = currentMutation.removedNodes[0].innerText;
                    EventBus.$emit("removeKeyword", keyword);
                    console.log(keyword);
                }
            }
        }
    }   
})

observer.observe(document.querySelector("#message-editor"), {childList: true});



const focusLastRow = () => {
    let table = document.querySelector("#detail-table");
    table.lastChild.lastChild.firstChild.firstChild.focus();
}

let moveFocus = false;


document.getElementById("send-button").addEventListener("click", () => {
/*    for(let i = 0; i < messagesToSend.length; i++){
        let number = messagesToSend[i].number.replace("0", 64);
        
        let trial = fetch(`https://textfoo.com/api/send?key=17eab8f4074305e411446df3a0d0acc9485f0fdc&phone=${number}&message=${messagesToSend[i].message.replace("\n", "%0A")}`).then((response) =>{
            console.log(response);
        });
    }
    messagesToSend = [];
*/
    let requestBody = {
        Comment: "Hi there",
        Name: "John Smith"
    }
    fetch("/api/send-messages/",
    {
        method :"POST",
    }).then(result => {
        console.log(result);
    });
    
})



const details = new Vue({
    el: '#app',
    delimiters: ["[[", "]]"],
    data: {
        counter:1,
        keywords: ["Number"],
    },

    mounted() {
        EventBus.$on("newKeyword", (keyword) => {
            console.log(this.keywords);
            this.keywords.push(keyword);
            console.log(this.keywords);
            this.$nextTick(()=> {
                updateTableHeader();
            });
            
        });

        EventBus.$on("add", () =>{
            this.counter++;
            moveFocus = true;
        });

        EventBus.$on("remove", () =>{
            if(this.counter > 1){
                this.counter--;
            }

        });


        EventBus.$on("removeKeyword", (keyword) => {
            this.keywords.splice(this.keywords.indexOf(keyword), 1);
        })
    },
    
    updated(){
        this.$nextTick(() => {
            if(moveFocus){
                moveFocus = false;
                focusLastRow();
            }
        })
    },

    methods: {
        addTableRow() { 
            this.counter++;
        },

        removeTableRow() {
            this.counter--;
        },

        reset(){
            this.keywords = ["Phone Number"];
        },

        removeSpecificRow(e){
            e.target.parentElement.parentElement.remove();
            console.log(this.counter);
        },

        formatText(){
            modal.style.display = "block";
            document.querySelector("#send-button").addEventListener('onclick', () => {
                console.log("Me was pressed");
            })
            const editor = document.querySelector("#message-editor");
            let message = editor.innerHTML.toString();
            message = message.replace(/&nbsp;/g, "");
            message = message.replace("<div>", "\n");
            message = message.replace(/<div>/g, "");
            message = message.replace(/(<div class="tag" data-converted="true" title=")/g, "");
            message = message.replace(/(" draggable="false".+?<\/div>)/g, " ");
            message = message.replace(/<\/div>/g, "\n");
            console.log(message);


            const dataContainer = document.querySelector("#detail-data");
            let rowCount = dataContainer.childNodes.length;
            let outputMessages = [];
            for(let row = 0; row < rowCount; row++){
                let currentMessage = message;
                let currentRow = dataContainer.childNodes[row];
                let phoneNumber = currentRow.childNodes[0].firstChild.value;
                let validEntry = true;
                if(phoneNumber){
                    for(let col = 1; col < this.keywords.length; col++){
                        let currentKeyword = this.keywords[col];
                        let value = currentRow.childNodes[col].firstChild.value;
                        if(!value){
                            validEntry = false;
                        }
                        currentMessage = currentMessage.replace("//".concat(currentKeyword), value);
                    }
                    if(validEntry){
                        outputMessages.push(`<div class="message-display-container">
                                                <div class="message-header-container">
                                                    <h5 class="message-header">To: ${phoneNumber}</h5>
                                                </div>
                                                <p class="message">${currentMessage}</p>
                                            </div>`);
                        messagesToSend.push({number: phoneNumber, message: currentMessage});
                    }
                }
                
            }

            const modalNode = document.querySelector("#modal-message");
            let finalString = "";
            for(let i in outputMessages){
                finalString += "<p>" + outputMessages[i] + "</p>";
            }
            modalNode.innerHTML = finalString;
            console.log(outputMessages);
        },

    } 
});
        //
var replaceIt_EscapedTextNodes = []
var relaceIt_ran = false;

// a function for autocomplete
function currentText(element) {
    element.focus()
    var doc = element.ownerDocument || element.document
    var win = doc.defaultView || doc.parentWindow
    var sel
    var preCaretRange
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection()
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0)
            preCaretRange = range.cloneRange()
        }
        return {
            pos: (preCaretRange.endContainer.nodeType == 3) ? range.endOffset : range.endOffset,
            text: (preCaretRange.endContainer.nodeType == 3) ? preCaretRange.endContainer.textContent : '',
            el: (preCaretRange.endContainer.nodeType == 3) ? preCaretRange.endContainer : preCaretRange.endContainer
        }
    }
}

function updateTableHeader(){
    // Change the selector if needed
    var $table = $('table'),
        $bodyCells = $table.find('tbody tr:first').children(),
        colWidth;

    // Get the tbody columns width array
    colWidth = $bodyCells.map(function() {
        return $(this).width();
    }).get();

    // Set the width of thead columns
    $table.find('thead tr').children().each(function(i, v) {
        $(v).width(colWidth[i]);
    }); 
}    


$(document).ready(function() {
    $("input[type=number]").on("focus", function() {
      $(this).on("keydown", function(event) {
        if (event.keyCode === 38 || event.keyCode === 40 || event.keyCode === 69) {
          event.preventDefault();
        }
      });
    });
  });

updateTableHeader();

function replaceInsert(el, title, replaceWith){
  var current = currentText(el)
  var node = current.el
  if(node.nodeType == 3){
  var offset = current.pos
  var curText = current.text
  var beforeText = curText.slice(0, offset)
  if(replaceWith) beforeText = beforeText.replace(replaceWith, '')
  node.textContent = beforeText + ' ' + title + ' ' + curText.slice(offset, curText.length) +' '
  }else{
    node.append(document.createTextNode(' '+ title +' '))
  }
  $(el).change()
}

function replaceIt(argObj) {
// addStyles once
    if(!relaceIt_ran){
    $(`<style>
      .ac-option {
      transition: transform 0.1s ease-out;
      }
      .ac-hlted {
      transform: scale(1.5);
     }</style>`).appendTo('body')
     relaceIt_ran = true
   }
function placeCaretAtEnd(el, moveTo) {
        el.focus()
        if (typeof window.getSelection != "undefined" &&
            typeof document.createRange != "undefined") {
            var range = document.createRange()
            // range.selectNodeContents(el)
            range.setStartAfter(moveTo) //this does the trick
            range.collapse(false)
            var sel = window.getSelection()
            sel.removeAllRanges()
            sel.addRange(range)
        }
    }

    function escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    /*  argObj = {
        e: event,
        el: element,
        replace: {
        $asdasd: {
          regex:
          convertTo:
        },
        autoComplete_...: {
        initiator:
        listEl:
        }
        }
    }*/
    var replaces = []
    var autoCompleteArray = []
    var element, event;

    for (var arg in argObj) {
        var acKey = arg.match(/autoComplete\S+/)
        if (acKey !== null) {
            autoCompleteArray.push(argObj[arg])
        } else {
            switch (arg) {
                case 'e':
                    event = argObj[arg]
                case 'el':
                    element = argObj[arg]
                    break
                default:
                    replaces.push(argObj[arg])
                    break
            }
        }
    }

//   fix for jumping cursor
      if(event.type == 'input'){
        var curText = currentText(element)
        if(curText.text == ''){
          curText.el.appendChild(document.createTextNode(' '))
        }
      }
  
//   fix for jumping cursor
  
    var wait = []
    if (event.type == 'input') {
        autoCompleteArray.forEach(autoComp => {
            wait.push(autoCompleter(autoComp))
        })
        wait = wait.filter((el, i) => {
            return el
        })
    }
    if (wait.length > 0) return
    $(element).next('.autocomp-list').hide()
    replaces.forEach((e, i) => {
        replace(element, e.find, e.convertTo)
    })

    function replace(el, regex, converted) {
        $.each(el.childNodes, (i, e) => {
            var node = e
            var nodeIndex = i

            var matches = node.textContent.match(regex)
            var data = (typeof node.getAttribute == 'function') ? node.getAttribute('data-converted') : false
            if (matches && !data) {
                var e = matches[0]
                var start = node.textContent.indexOf(e)
                var end = node.textContent.indexOf(e) + e.length

                var stringToConvert = node.textContent.slice(start, end)

                var temp_container = document.createElement('div')
                temp_container.innerHTML = converted(stringToConvert)

                var emo = $(temp_container).find('.emojione').get(0) || temp_container.firstChild
                emo.setAttribute('data-converted', 'true')
                emo.setAttribute('title', stringToConvert)
                emo.setAttribute('draggable', 'false')
                emo.style.display = 'inline-block'
                if (emo.textContent.length > 0) {
                    emo.setAttribute('contenteditable', 'false')
                }

                var beforeText = document.createTextNode(node.textContent.slice(0, start))
                var afterText = document.createTextNode(node.textContent.slice(end) || ' ')

                node.parentNode.insertBefore(beforeText, node)
                node.parentNode.insertBefore(afterText, node.nextSibling)
                node.parentNode.replaceChild(emo, node)
                placeCaretAtEnd(el, emo)
                replace(el, regex, converted) // check for other
            }
        })
    }

    //   autocomplete
    //end of function
    function autoCompleter(autoComplete) {
        var $listDiv = $(element).next()
        if (!($listDiv.hasClass('autocomp-list'))) {
            $listDiv = $(document.createElement('div'))
            $listDiv.addClass('autocomp-list')
            $(element).after($listDiv)
        }
       $listDiv.css({
                position: 'absolute',
                top: $(element).position().top + $(element).outerHeight(),
                left: $(element).position().left,
                width: $(element).outerWidth(),
                padding: $(element).css('padding'),
                backgroundColor: $(element).css('background-color')
            })

        var reg = autoComplete.initiator
        var text = currentText(element).text
        var textNode = currentText(element).el

        // update escapeNodes
        replaceIt_EscapedTextNodes.forEach((e, i) => {
            if (textNode.nodeType == 3) {
                if (textNode.isSameNode(e.node)) {
                    if (e.escapedFor == reg) {
                        var matching = e.node.textContent.match(new RegExp(escapeRegExp(e.escapedFor), 'g'))
                        var matchLength = matching ? matching.length : 0
                        if (matchLength == 0) {
                            var spliced = replaceIt_EscapedTextNodes.splice(i, 1)
                        } else if (matchLength < e.escaped) {
                            replaceIt_EscapedTextNodes[i] = {
                                node: textNode,
                                escaped: textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')) ? textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')).length : 0,
                                escapedFor: reg
                            }

                        }

                    }

                }

            }
        })
        // update escapeNodes

        //escape Decision
        var ac_escaped = {
            is: false,
            for: null,
            times: null
        }
        replaceIt_EscapedTextNodes.forEach((e, i) => {

            if (textNode.nodeType == 3) {

                if (textNode.isSameNode(e.node)) {
                    ac_escaped.for = e.escapedFor

                    if (e.escapedFor == reg) {
                        var matching = e.node.textContent.match(new RegExp(escapeRegExp(e.escapedFor), 'g'))
                        var matchLength = matching ? matching.length : 0
                        ac_escaped.times = e.escaped
                        if (matchLength == e.escaped) {
                            ac_escaped.is = true
                        }
                    }
                }
            }
        })

        var match = text.match(new RegExp(escapeRegExp(reg), 'g'))
        var matched = match ? true : false
        var start = match ? text.indexOf(reg) : -1

        var chopped = text
        var chopInd = chopped.indexOf(reg)
        for (var i = 0; i < ac_escaped.times; i++) {
            chopped = chopped.slice(chopped.indexOf(reg) + 1, chopped.length)
            chopInd += chopped.indexOf(reg)
        }
        start = chopInd + ac_escaped.times

        //escape Decision

        var beforeText = text.slice(0, start)
        var sliced = text.slice(start)
        var end = (sliced.indexOf(' ') == -1) ? sliced.length : sliced.indexOf(' ')
        var afterText = sliced.slice(end)
        sliced = sliced.slice(0, end)
        var listHtml = autoComplete.listEl(sliced)

        if (matched && listHtml.length > 0 && !ac_escaped.is) {
            $listDiv.html('')
            $listDiv.show()

            listHtml.forEach(e => {
                var tempContainer = document.createElement('div')
                tempContainer.innerHTML = e
                var $el = $($(tempContainer).find('*')[0])
                $el.css({
                    padding: '3px 10px',
                    margin: '3px'
                })
                $listDiv.prepend($el)
                $el.addClass('ac-option')
                $el.click(e => {
                    var title = e.currentTarget.getAttribute('title')
                    var newText = document.createTextNode(beforeText + title + afterText + ' ')
                    textNode.parentNode.replaceChild(newText, textNode)
                    $(element).change()
                    $(element).off('.ac-keys')
                    $listDiv.hide()
                })
              })

                $(document).on('click.ac-elsewhere', e => {
                    if ($(e.originalEvent.path).hasClass('autocomp-list')) return
                    $listDiv.hide()
                  if (replaceIt_EscapedTextNodes.length > 0) {
                        replaceIt_EscapedTextNodes.forEach((e, i) => {
                            if (textNode.nodeType == 3) {
                                if (textNode.isSameNode(e.node)) {
                                    if (e.escapedFor == reg) {
                                        replaceIt_EscapedTextNodes[i] = {
                                            node: textNode,
                                            escaped: textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')) ? textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')).length : 0,
                                            escapedFor: reg
                                        }
                                    } else {
                                        replaceIt_EscapedTextNodes.push({
                                            node: textNode,
                                            escaped: textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')) ? textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')).length : 0,
                                            escapedFor: reg
                                        })
                                    }
                                } else {
                                        replaceIt_EscapedTextNodes.push({
                                            node: textNode,
                                            escaped: textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')) ? textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')).length : 0,
                                            escapedFor: reg
                                        })
                                    }
                            }
                        })
                    $(document).off('.ac-elsewhere')
                    $(element).off('.ac-keys')
                }
            })
        }
        if (matched) {
            $(element).on('keydown.ac-keys', e => {
                if (e.which == 32 || e.which == 13 || e.which == 27) { //space | enter | esc

                    if (e.which == 13) e.preventDefault()

                    if($listDiv.find('.ac-hlted').length !== 0){
                      // selection
                      if(e.which == 32 || e.which == 13){
                        //enter or space
                        var $hlted = $listDiv.find('.ac-hlted').eq(0)
                        var title = $hlted.attr('title')
                        replaceInsert(element, title, sliced)
                        $(element).off('.ac-keys')
                        $listDiv.hide()
                          return
                      }
                    }


                    if (replaceIt_EscapedTextNodes.length > 0) {
                      replaceIt_EscapedTextNodes.forEach((e, i) => {
                        if (textNode.nodeType == 3) {
                          if (textNode.isSameNode(e.node)) {
                            if (e.escapedFor == reg) {
                              replaceIt_EscapedTextNodes[i] = {
                                node: textNode,
                                escaped: textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')).length || 0,
                                escapedFor: reg
                              }
                            } else {
                              replaceIt_EscapedTextNodes.push({
                                node: textNode,
                                escaped:textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')) ? textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')).length : 0,
                                escapedFor: reg
                              })
                            }
                          } else {
                              replaceIt_EscapedTextNodes.push({
                                node: textNode,
                                escaped:textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')) ? textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')).length : 0,
                                escapedFor: reg
                              })
                            }
                        }
                      })
                    } else {
                      replaceIt_EscapedTextNodes.push({
                        node: textNode,
                        escaped: textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')) ? textNode.textContent.match(new RegExp(escapeRegExp(reg), 'g')).length : 0,
                        escapedFor: reg
                      })
                    }
                    
                    $(element).change()
                    $listDiv.hide()
                }
                if (e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40) { // left | up | right | bottom
                    var $hlted
                    if($listDiv.find('.ac-hlted').length == 0 ){
                    $hlted = $listDiv.find('.ac-option').eq(0)
                    $hlted.addClass('ac-hlted')
                    }else{
                     $hlted = $listDiv.find('.ac-hlted')
                    switch(e.which){
                        case 37:
                        $hlted.removeClass('ac-hlted')
                        $hlted.prev('.ac-option').addClass('ac-hlted')
                        break
                        case 38:
                        $hlted.removeClass('ac-hlted')
                        $hlted.prev('.ac-option').addClass('ac-hlted')
                        break
                        case 39:
                        $hlted.removeClass('ac-hlted')
                        $hlted.next('.ac-option').addClass('ac-hlted')
                        break
                        case 40:
                        $hlted.removeClass('ac-hlted')
                        $hlted.next('.ac-option').addClass('ac-hlted')
                        break
                        default:
                        break
                           }
                    }
                    e.preventDefault()
                    return false
                } else {
                    $(element).off('.ac-keys')
                }
            })
        }
        return matched
    }
}

function handleDataColumns(keyword){
    
}

//THIS IS THE USAGE PART

$('.editable').on('input change', e => {

    replaceIt({
        e: e,
        el: $('.editable').get(0),
        tag: {
            find: new RegExp(/([/]{2})\w+/g),
            convertTo: function(match) {
                let keyword = match.slice(2, match.length);
                EventBus.$emit("newKeyword", keyword);
                return `<div class="tag">${keyword}</div> `
            }
        },
        autoComplete_tag: {
            initiator: '//',
            listEl: function(text) {
                var resultsArray = []
                for (var i = 0; i < 1; i++) {
                    resultsArray.push(`<div class="option tag" title="${text}">${ text }&nbsp;</div>`)
                }
                return resultsArray
            }
        },
    })
})

