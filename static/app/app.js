import { EventBus } from './EventBus.js';

let details = new Vue({
    el: '#app',
    data: {
        counter:1,
        keywords: ["Number"],
    },

    mounted() {
        EventBus.$on("newKeyword", (keyword) => {
            console.log(this.keywords);
            this.keywords.push(keyword);
            console.log(this.keywords);
        });
    },
    
    methods: {
        addTableRow() { 
            this.counter++;
        },

        removeTableRow() {
            this.counter--;
        },

        reset(){
            this.keywords = ["Number"];
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
    console.log("change registered");

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
        autoComplete_people: {
          initiator: '@',
          listEl: function(text) {
              var resultsArray = []
              for (var i = 0; i < 5; i++) {
                  resultsArray.push(`<div class="option person" title="${text}">${ text }&nbsp;</div>`)
              }
              return resultsArray
          }
        },
        people: {
          find: new RegExp(/@\w+\s/g),
          convertTo: function(match) {
              return `<div class="person">${match}</div> `
          }
        }
    })
})

